Promise.all([
    module.repository.Cli,
    module.shareImport('viewText.js'),
    module.shareImport('createTextContentCli.js'),
]).then(modules=>{
    let
        Cli=                    modules[0],
        viewText=               modules[1],
        createTextContentCli=   modules[2]
    function build(cli,ui,text,cursor,showCursor,showNumber){
        text=viewText(
            ui,
            text,
            showNumber?ui.width-4:ui.width,
            cursor
        )
        let res=createTextContentCli(ui,text,cursor,showCursor)
        if(showNumber){
            cli.appendChild(number(text))
            cli.appendChild({
                child:res.textCli,
                c:4,
            })
        }else{
            cli.appendChild(res.textCli)
        }
        for(let r=res.rowsCount;r<ui.height-1;r++)
            cli.appendChild({child:'~',r})
        return cli
    }
    function number(text){
        let cli=new Cli
        let currentRowsCount=0
        text.map(l=>{
            cli.appendChild({
                child:pad((l.index+1).toString()),
                r:currentRowsCount,
            })
            currentRowsCount+=l.rows.length||1
        })
        return cli
        function pad(s){
            return ' '.repeat(3-s.length)+s
        }
    }
    return build
})

