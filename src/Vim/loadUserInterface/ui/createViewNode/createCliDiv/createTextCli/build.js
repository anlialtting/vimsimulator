let
    color3i={
        color:'var(--color3i)'
    },
    color4i={
        color:'var(--color4i)'
    }
;(async()=>{
    let[
        Cli,
        visualRange,
        createTextContentCli,
    ]=await Promise.all([
        module.module('../Cli.js'),
        module.module('../../../../visualRange.js'),
        module.module('./build/createTextContentCli.js'),
    ])
    function build(cli,ui,showCursor,showNumber){
        let 
            cursor= ui._vim._trueCursor,
            width=  ui._width,
            height= ui._height,
            data=   ui._wrapMethodData,
            txt=    data.text
        let numberWidth=ui._numberWidth
        let textWidth=ui._textWidth
        let text=data.text.uiText(data._scroll,data._scroll+height-1)
        let res=createTextContentCli(
            text,
            cursor,
            showCursor,
            ui._vim._mode=='visual'&&visualRange(ui._vim),
            ui._cursorSymbol,
            width
        )
        if(showNumber){
            cli.appendChild(number(text,numberWidth))
            cli.appendChild({
                child:res.textCli,
                c:numberWidth+1,
            })
        }else{
            cli.appendChild(res.textCli)
        }
        for(let r=res.rowsCount;r<ui.height-1;r++)
            cli.appendChild({
                child:'~',
                r,
                style:color4i
            })
        return cli
    }
    function number(text,numberWidth){
        let cli=new Cli
        let currentRowsCount=0
        text.map(l=>{
            cli.appendChild({
                child:pad((l.index+1).toString()),
                r:currentRowsCount,
                style:color3i
            })
            currentRowsCount+=l.rows.length||1
        })
        return cli
        function pad(s){
            return ' '.repeat(numberWidth-s.length)+s
        }
    }
    return build
})()
