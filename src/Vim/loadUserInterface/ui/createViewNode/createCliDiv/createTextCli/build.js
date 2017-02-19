var
    color3i={
        color:'var(--color3i)'
    },
    color4i={
        color:'var(--color4i)'
    }
Promise.all([
    module.repository.Cli,
    module.shareImport('build/uiText.js'),
    module.shareImport('build/createTextContentCli.js'),
]).then(modules=>{
    let
        Cli=                    modules[0],
        uiText=                 modules[1],
        createTextContentCli=   modules[2]
    function build(cli,ui,showCursor,showNumber){
        let 
            cursor=ui._vim._cursor
        let numberWidth=Math.max(3,Math.floor(
            Math.log(ui._vim._cursor._countOfRows)/Math.log(10)
        )+1)
        text=uiText(
            ui,
            showNumber?ui.width-(numberWidth+1):ui.width,
            cursor
        )
        let res=createTextContentCli(
            ui,
            text,
            cursor,
            showCursor,
            ui._vim._mode=='visual'&&visualRange(ui._vim)
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
})
