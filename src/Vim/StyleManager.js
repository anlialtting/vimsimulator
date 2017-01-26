function StyleManager(){
    this.style=document.createElement('style')
}
StyleManager.prototype.appendChild=function(n){
    this.style.appendChild(n)
}
StyleManager
