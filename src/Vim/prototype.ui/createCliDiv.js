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
    function createCliDiv(ui){
        let
            vim=ui._vim,
            cli=new Cli,
            cliView=cli.view,
            currentR,
            currentWelcomeText
        ui._commandCli=createCommandCli(vim)
        cliView.fontSize=ui._fontSize
        update()
        ui.on('update',update)
        return cliView.node
        function update(){
            if(cliView.width!=ui._width)
                cliView.width=ui._width
            if(cliView.height!=ui._height)
                cliView.height=ui._height
            let r=ui._height-1||vim._cursor._countOfRows||1
            if(
                currentR==r&&
                currentWelcomeText==vim._welcomeText
            )
                return
            cli.clear()
            cli.appendChild(createTextCli(ui))
            cli.appendChild({
                child:ui._commandCli,
                r,
            })
            if(vim._welcomeText&&50<=ui.width&&16<=ui.height){
                let
                    r=Math.floor(
                        (ui.height-vim._welcomeText.split('\n').length-1)/2
                    ),
                    c=Math.floor(
                        (ui.width-vim._welcomeText.split('\n').map(
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
