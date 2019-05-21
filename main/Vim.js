import loadBase from './Vim/loadBase.js'
import loadUserInterface from './Vim/loadUserInterface.js'
import loadSyntacticSugar from './Vim/loadSyntacticSugar.js'
import colorsStyle from './Vim/colorsStyle.js'
import createCursor from './Vim/createCursor.js'
import rc from './Vim/rc.js'
import defaultOptions from './Vim/defaultOptions.js'
import StyleManager from './Vim/StyleManager.js'
import UndoBranchManager from './Vim/UndoBranchManager.js'
import style from './Vim/style.js'
import EventEmmiter from'../lib/EventEmmiter.js'
let load=[
    loadBase,
    loadUserInterface,
    loadSyntacticSugar,
]
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
    this._styleManager.appendChild(document.createTextNode(colorsStyle))
    this.read=read
    this.write=write
    this._uis=new Set
    rc(this)
}
Object.setPrototypeOf(Vim.prototype,EventEmmiter.prototype)
load.map(f=>f(Vim.prototype))
export default Vim
