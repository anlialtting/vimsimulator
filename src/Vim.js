{
    let moduleNode=`https://cdn.rawgit.com/anliting/module/${
        '0e94e04505484aaf3b367423b36cf426a4242006'
    }/node`
    if(!module.repository.EventEmmiter)
        module.repository.EventEmmiter=module.importByPath(
            `${moduleNode}/events.js`
        )
    if(!module.repository.npm)
        module.repository.npm={}
    if(!module.repository.npm.stringWidth)
        module.repository.npm.stringWidth=module.importByPath(
            `${moduleNode}/string-width.js`
        )
}
Promise.all([
    module.repository.EventEmmiter,
    module.get('Vim/colors.css'),
    module.shareImport('Vim/createCursor.js'),
    module.shareImport('Vim/rc.js'),
    module.shareImport('Vim/loadSyntacticSugar.js'),
    module.shareImport('Vim/UndoBranchManager.js'),
    module.get('Vim/style.css'),
    module.shareImport('Vim/prototype._mode.js'),
    module.shareImport('Vim/defaultOptions.js'),
    module.shareImport('Vim/StyleManager.js'),
    module.shareImport('Vim/prototype._welcomeText.js'),
    module.shareImport('Vim/prototype._write.js'),
    module.shareImport('Vim/loadUserInterface.js'),
    module.shareImport('Vim/prototype._edit.js'),
]).then(modules=>{
    let
        EventEmmiter=           modules[0],
        colors=                 modules[1],
        createCursor=           modules[2],
        rc=                     modules[3],
        loadSyntacticSugar=     modules[4],
        UndoBranchManager=      modules[5],
        style=                  modules[6],
        defaultOptions=         modules[8],
        StyleManager=           modules[9],
        loadUserInterface=      modules[12]
    function Vim(read,write){
        EventEmmiter.call(this)
        this._values={
            mode:'normal'
        }
        this._options=Object.create(defaultOptions)
        this._viewChanged=[]
        this._text=''
        this._registers={}
        this._modeData={}
        this._cursor=createCursor(this)
        this._undoBranchManager=new UndoBranchManager
        this._undoBranchManager.push('')
        this._styleManager=new StyleManager
        this.style=this._styleManager.style
        this._styleManager.appendChild(document.createTextNode(style))
        this._styleManager.appendChild(document.createTextNode(colors))
        this.read=read
        this.write=write
        this._uis=[]
        rc(this)
    }
    Object.setPrototypeOf(Vim.prototype,EventEmmiter.prototype)
    Object.defineProperty(Vim.prototype,'_mode',modules[7])
    Vim.prototype._quit=function(){
        this.emit('quit')
    }
    Object.defineProperty(Vim.prototype,'_text',{
        set(val){
            if(/[^\n]$/.test(val))
                val+='\n'
            this._values.text=val
            this._viewChanged.text=true
        },get(){
            return this._values.text
        }
    })
    Object.defineProperty(Vim.prototype,'_trueText',{get(){
        return this._values.text||'\n'
    }})
    Vim.prototype._view=function(){
        this.emit('view',Object.keys(this._viewChanged))
        this._viewChanged={}
    }
    Vim.prototype._read=function(path){
        return this.read&&this.read(path)
    }
    Vim.prototype._write=modules[11]
    Vim.prototype._edit=modules[13]
    Vim.prototype._welcomeText=modules[10]
    loadUserInterface(Vim.prototype)
    loadSyntacticSugar(Vim.prototype)
    return Vim
})
