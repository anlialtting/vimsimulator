{
    let moduleNode=`https://cdn.rawgit.com/anliting/module/${
        '0e94e04505484aaf3b367423b36cf426a4242006'
    }/node`
    if(!module.repository.npm)
        module.repository.npm={}
    if(!module.repository.npm.stringWidth)
        module.repository.npm.stringWidth=module.importByPath(
            `${moduleNode}/string-width.js`
        )
    if(!module.repository.npm.events)
        module.repository.npm.events=module.importByPath(
            `${moduleNode}/events.js`
        )
    if(!module.repository.EventEmmiter)
        module.repository.EventEmmiter=module.repository.npm.events
}
var
    loadUserInterface=  module.shareImport('Vim/loadUserInterface.js'),
    loadSyntacticSugar= module.shareImport('Vim/loadSyntacticSugar.js'),
    colors=             module.get('Vim/colors.css'),
    createCursor=       module.shareImport('Vim/createCursor.js'),
    rc=                 module.shareImport('Vim/rc.js'),
    defaultOptions=     module.shareImport('Vim/defaultOptions.js'),
    StyleManager=       module.shareImport('Vim/StyleManager.js'),
    UndoBranchManager=  module.shareImport('Vim/UndoBranchManager.js'),
    style=              module.get('Vim/style.css'),
    EventEmmiter=       module.repository.npm.events,
    proto=Promise.all([
        module.shareImport('Vim/prototype._welcomeText.js'),
        module.shareImport('Vim/prototype._write.js'),
        module.shareImport('Vim/prototype._edit.js'),
        module.shareImport('Vim/prototype._mode.js'),
        module.shareImport('Vim/prototype._text.js'),
    ])
;(async()=>{
    EventEmmiter=       await EventEmmiter
    StyleManager=       await StyleManager
    UndoBranchManager=  await UndoBranchManager
    style=              await style
    colors=             await colors
    createCursor=       await createCursor
    rc=                 await rc
    defaultOptions=     await defaultOptions
    proto=              await proto
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
        this._uis=new Set
        rc(this)
    }
    Object.setPrototypeOf(Vim.prototype,EventEmmiter.prototype)
    Object.defineProperty(Vim.prototype,'_mode',proto[3])
    Vim.prototype._quit=function(){
        this.emit('quit')
    }
    Object.defineProperty(Vim.prototype,'_text',proto[4])
    Object.defineProperty(Vim.prototype,'_trueText',{get(){
        return this._values.text||'\n'
    }})
    Vim.prototype._ui=function(){
        this._uis.forEach(ui=>
            ui._updateByVim(this._viewChanged)
        )
        this._viewChanged={}
    }
    Vim.prototype._read=function(path){
        return this.read&&this.read(path)
    }
    Vim.prototype._write=proto[1]
    Vim.prototype._edit=proto[2]
    Vim.prototype._welcomeText=proto[0]
    Vim.prototype._setOption=function(key,value){
        this._options[key]=value
        this._viewChanged.options=this._viewChanged.options||{}
        this._viewChanged.options[key]=null
    }
    Object.defineProperty(Vim.prototype,'_mainUi',{get(){
        if(!this._values._mainUi){
            this._values._mainUi=this.ui
            this._values._mainUi.width=80
            this._values._mainUi.height=24
        }
        return this._values._mainUi
    }})
    ;(await loadUserInterface)(Vim.prototype)
    ;(await loadSyntacticSugar)(Vim.prototype)
    return Vim
})()
