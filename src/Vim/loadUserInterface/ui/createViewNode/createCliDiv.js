module.repository.Cli=module.shareImport('createCliDiv/Cli.js')
Promise.all([
    module.shareImport('createCliDiv/createCommandCli.js'),
    module.repository.Cli,
    module.shareImport('createCliDiv/createTextCli.js'),
    module.shareImport('createCliDiv/createInput.js'),
]).then(modules=>{
    let
        createCommandCli=   modules[0],
        Cli=                modules[1],
        createTextCli=      modules[2],
        createInput=        modules[3]
    function createCliDiv(ui){
        return new CliDiv(ui)
    }
    function CliDiv(ui){
        this._ui=ui
        this._vim=this._ui._vim
        this._cli=new Cli
        this._cliView=this._cli.view
        this._ui._commandCli=createCommandCli(this._ui)
        this._cliView.fontSize=this._ui._fontSize
        this._textCli=createTextCli(this._ui)
        this.update()
        let n=this._cliView.node
        this._ui._inputTag=createInput(this._ui)
        n.appendChild(this._ui._inputTag)
        this.node=n
    }
    CliDiv.prototype.modeChange=function(){
        this._ui._commandCli.update()
    }
    CliDiv.prototype.update=function(){
        this._textCli.update()
        this._ui._commandCli.update()
        if(this._cliView.width!=this._ui._width)
            this._cliView.width=this._ui._width
        if(this._cliView.height!=this._ui._height)
            this._cliView.height=this._ui._height
        {let c;if(c=this._cliView.symbols[this._ui._cursorSymbol]){
            this._ui._inputTag.style.top=`${c.r*this._ui._fontSize}px`
            this._ui._inputTag.style.left=`${c.c*this._ui._fontWidth}px`
        }}
        let r=this._ui._height-1||this._vim._cursor._countOfRows||1
        if(
            this._currentR==r&&
            this._currentWelcomeText==this._vim._welcomeText
        )
            return
        this._cli.clear()
        this._cli.appendChild(this._textCli.cli)
        this._cli.appendChild({
            child:this._ui._commandCli.cli,
            r,
        })
        if(
            this._vim._welcomeText&&
            50<=this._ui.width&&
            16<=this._ui.height
        ){
            let
                r=Math.floor(
                    (
                        this._ui.height-
                        this._vim._welcomeText.split('\n').length-1
                    )/2
                ),
                c=Math.floor(
                    (this._ui.width-this._vim._welcomeText.split(
                        '\n'
                    ).map(
                        s=>s.length
                    ).reduce(
                        (a,b)=>Math.max(a,b)
                    ))/2
                )
            this._cli.appendChild({
                child:this._vim._welcomeText,
                r,
                c,
            })
        }
        this._cli.flush()
        this._currentR=r
        this._currentWelcomeText=this._vim._welcomeText
    }
    CliDiv.prototype.flush=function(){
        this._textCli.flush()
    }
    return createCliDiv
})
