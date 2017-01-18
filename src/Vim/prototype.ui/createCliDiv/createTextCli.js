Promise.all([
    module.repository.Cli,
    module.shareImport('createTextCli/viewText.js'),
    module.shareImport('createTextCli/createTextContentCli.js'),
]).then(modules=>{
    let
        Cli=                    modules[0],
        viewText=               modules[1],
        createTextContentCli=   modules[2]
    function createTextCli(ui){
        let
            cli=new Cli,
            updated=false
        f()
        ui.on('update',()=>updated=false)
        setInterval(f,ui.refreshMinTime)
        return cli
        function f(){
            if(updated)
                return
            cli.clear()
            build(
                cli,
                ui,
                viewText(
                    ui,
                    ui._vim._text||'\n',
                    ui._vim._options.number?ui.width-4:ui.width,
                    ui._vim._cursor
                ),
                ui._vim._cursor,
                document.activeElement==ui._inputTag&&
                ui._vim.mode!='cmdline'
            )
            cli.flush()
            updated=true
        }
    }
    function build(cli,ui,text,cursor,showCursor){
        let res=createTextContentCli(ui,text,cursor,showCursor)
        if(ui._vim._options.number){
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
    return createTextCli
})
