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
            cliView=cli.view,
            currentR,
            currentWelcomeText
        view._commandCli=createCommandCli(vim)
        update()
        view.on('update',update)
        return cliView.node
        function update(){
            if(cliView.width!=view._width)
                cliView.width=view._width
            if(cliView.height!=view._height)
                cliView.height=view._height
            let r=view._height-1||vim._cursor._countOfRows||1
            if(
                currentR==r&&
                currentWelcomeText==vim._welcomeText
            )
                return
            cli.clear()
            cli.appendChild(createTextCli(view))
            cli.appendChild({
                child:view._commandCli,
                r,
            })
            if(vim._welcomeText&&50<=view.width&&16<=view.height){
                let
                    r=Math.floor(
                        (view.height-vim._welcomeText.split('\n').length-1)/2
                    ),
                    c=Math.floor(
                        (view.width-vim._welcomeText.split('\n').map(
                            s=>s.length
                        ).reduce(
                            (a,b)=>Math.max(a,b)
                        ))/2
                    )
                cli.appendChild({
                    child:vim._welcomeText,
                    r,
                    c,
                })
            }
            cli.flush()
            currentR=r
            currentWelcomeText=vim._welcomeText
        }
    }
})
