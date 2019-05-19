import{dom}from 'https://gitcdn.link/cdn/anliting/simple.js/3b5e122ded93bb9a5a7d5099ac645f1e1614a89b/src/simple.static.js'
function StyleManager(){
    this.style=dom.style()
}
StyleManager.prototype.appendChild=function(n){
    dom(this.style,n)
}
export default StyleManager
