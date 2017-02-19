var
    color3i={
        color:'var(--color3i)'
    },
    color4i={
        color:'var(--color4i)'
    }
Promise.all([
    module.shareImport('build/uiText.js'),
    module.shareImport('build/createTextContentCli.js'),
]).then(async modules=>{
    let
        Cli=                    await module.repository.Cli,
        uiText=                 modules[0],
        createTextContentCli=   modules[1]
    function build(cli,ui,showCursor,showNumber){
        let 
            cursor= ui._vim._cursor,
            width=  ui._width,
            height= ui._height,
            data=   ui._wrapMethodData,
            txt=    data.text
        let numberWidth=Math.max(3,Math.floor(
            Math.log(cursor._countOfRows)/Math.log(10)
        )+1)
        let textWidth=showNumber?width-(numberWidth+1):width
        txt.width=textWidth
        txt.wrap()
        checkScroll(txt.row(cursor.abs),height,data)
        let text=uiText(data,textWidth,cursor,height)
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
    function checkScroll(cursorViewRow,height,data){
        if(data._scroll+height-1<=cursorViewRow)
            data._scroll=cursorViewRow-(height-1)+1
        if(cursorViewRow<data._scroll)
            data._scroll=cursorViewRow
    }
    return build
})
