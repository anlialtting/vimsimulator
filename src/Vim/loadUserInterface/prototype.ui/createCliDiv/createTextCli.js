Promise.all([
    module.repository.Cli,
    module.shareImport('createTextCli/build.js'),
]).then(modules=>{
    let
        Cli=                    modules[0],
        build=                  modules[1]
    function createTextCli(ui){
        let
            cli=new Cli,
            updated=false
        f()
        ui.on('update',()=>updated=false)
        setInterval(f,ui._refreshMinTime)
        return cli
        function f(){
            if(updated)
                return
            cli.clear()
            build(
                cli,
                ui,
                ui._vim._trueText,
                ui._vim._cursor,
                document.activeElement==ui._inputTag&&
                    ui._vim.mode!='cmdline',
                ui._vim._options.number
            )
            cli.flush()
            updated=true
        }
    }
    return createTextCli
})
