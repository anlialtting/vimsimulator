;(async()=>{
    let load=[
        module.module('Vim/loadBase.js'),
        module.module('Vim/loadUserInterface.js'),
        module.module('Vim/loadSyntacticSugar.js'),
    ]
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
        module.module('./Vim/colorsStyle.js'),
        module.module('./Vim/createCursor.js'),
        module.module('./Vim/rc.js'),
        module.module('./Vim/defaultOptions.js'),
        module.module('./Vim/StyleManager.js'),
        module.module('./Vim/UndoBranchManager.js'),
        module.module('./Vim/style.js'),
        module.module('./Vim/events.js'),
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
