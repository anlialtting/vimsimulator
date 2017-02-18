var build=module.shareImport('createTextCli/build.js')
;(async()=>{
    let Cli=await module.repository.Cli
    build=await build
    function createTextCli(ui){
        let
            cli=new Cli,
            updated=false
        f()
        ui.on('update',()=>updated=false)
        ui.on('_clock',f)
        return cli
        function f(){
            if(updated)
                return
            cli.clear()
            build(
                cli,
                ui,
                document.activeElement==ui._inputTag&&
                    ui._vim.mode!='cmdline',
                ui._vim._options.number
            )
            cli.flush()
            updated=true
        }
    }
    return createTextCli
})()
