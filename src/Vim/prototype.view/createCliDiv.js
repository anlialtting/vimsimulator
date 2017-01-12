Promise.all([
    module.shareImport('createCliDiv/createCommandCli.js'),
    module.repository.Cli,
]).then(modules=>{
    let
        createCommandCli=   modules[0],
        Cli=                modules[1]
    return createCliDiv
    function createCliDiv(view){
        let cli=createCli(view)
        let div=document.createElement('div')
        div.style.position='absolute'
        div.style.top='0'
        div.appendChild(cli.view.div)
        return div
    }
    function createCli(view){
        let
            vim=view._vim,
            cli=new Cli
        view._commandCli=createCommandCli(vim)
        setCliChild()
        vim.on('view',setCliChild)
        return cli
        function setCliChild(){
            cli.clear()
            cli.appendChild({
                child:view._commandCli,
                r:view._height-1||vim._cursor._countOfRows||1
            })
            cli.flush()
        }
    }
})
