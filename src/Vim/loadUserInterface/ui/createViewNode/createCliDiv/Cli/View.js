import update from './View/update.js'
import measureWidth from '../../../measureWidth.js'
import{dom}from 'https://gitcdn.link/cdn/anliting/simple.js/3b5e122ded93bb9a5a7d5099ac645f1e1614a89b/src/simple.static.js'
function View(cli){
    this._cli=cli
    this._fontSize=13
    this._children=[]
    this._divs={}
    this._listeners=[]
    this._previousArray={}
    this._fontWidth=measureWidth(this._fontSize)
    this.node=dom('div')
    this.node.className='cli'
    this.symbols={}
    update(this)
}
Object.defineProperty(View.prototype,'width',{set(val){
    this._width=val
    this.update
},get(){
    return this._width
}})
Object.defineProperty(View.prototype,'height',{set(val){
    this._height=val
    this.update
},get(){
    return this._height
}})
Object.defineProperty(View.prototype,'fontSize',{set(val){
    this._fontSize=val
    this._fontWidth=measureWidth(this._fontSize)
    this.node.style.fontSize=`${this._fontSize}px`
    this.update
}})
Object.defineProperty(View.prototype,'update',{set(val){
    update(this)
}})
View.prototype.free=function(){
}
export default View
