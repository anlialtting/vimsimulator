import doe from'../../lib/doe.mjs'
function StyleManager(){
    this.style=doe.style()
}
StyleManager.prototype.appendChild=function(n){
    doe(this.style,n)
}
export default StyleManager
