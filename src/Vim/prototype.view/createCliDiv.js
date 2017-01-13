module.repository.Cli=module.shareImport('createCliDiv/Cli.js')
Promise.all([
    module.shareImport('createCliDiv/createCommandCli.js'),
    module.repository.Cli,
    module.shareImport('createCliDiv/createTextCli.js'),
]).then(modules=>{
    let
        createCommandCli=   modules[0],
        Cli=                modules[1],
        createTextCli=      modules[2]
    return createCliDiv
    function createCliDiv(view){
        let
            vim=view._vim,
            cli=new Cli,
            currentR
        view._commandCli=createCommandCli(vim)
        setCliChild()
        view.on('update',setCliChild)
        return cli.view.div
        function setCliChild(){
            let r=view._height-1||vim._cursor._countOfRows||1
            if(currentR==r)
                return
            cli.clear()
            cli.appendChild(createTextCli(view))
            cli.appendChild({
                child:view._commandCli,
                r,
            })
            cli.flush()
            currentR=r
        }
    }
})
