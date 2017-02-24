{
    var moduleNode=`https://cdn.rawgit.com/anliting/module/${
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
}
var load=[
    module.shareImport('Vim/loadBase.js'),
    module.shareImport('Vim/loadUserInterface.js'),
    module.shareImport('Vim/loadSyntacticSugar.js')
]
;(async()=>{
    let[
        colors,
        createCursor,
        rc,
        defaultOptions,
        StyleManager,
        UndoBranchManager,
        style,
        EventEmmiter,
    ]=await Promise.all([
        module.get('Vim/colors.css'),
        module.shareImport('Vim/createCursor.js'),
        module.shareImport('Vim/rc.js'),
        module.shareImport('Vim/defaultOptions.js'),
        module.shareImport('Vim/StyleManager.js'),
        module.shareImport('Vim/UndoBranchManager.js'),
        module.get('Vim/style.css'),
        module.repository.npm.events
    ])
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
        {let a=createCursor(this)
            this._cursor=a[0]
            this._trueCursor=a[1]
        }
        this._undoBranchManager=new UndoBranchManager
        this._undoBranchManager.push(this._text)
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
    ;(await Promise.all(load)).map(f=>f(Vim.prototype))
    return Vim
})()
