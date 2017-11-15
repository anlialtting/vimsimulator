import dom from 'https://cdn.rawgit.com/anliting/althea/ea16c0d91285a61063e9251ad1387b7cf4732a39/src/AltheaServer/HttpServer/files/lib/dom.js'
function StyleManager(){
    this.style=dom('style')
}
StyleManager.prototype.appendChild=function(n){
    dom(this.style,n)
}
export default StyleManager
