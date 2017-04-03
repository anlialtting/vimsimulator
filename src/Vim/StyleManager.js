(async()=>{
    let[
        dom,
    ]=await Promise.all([
        module.repository.althea.dom,
    ])
    function StyleManager(){
        this.style=dom('style')
    }
    StyleManager.prototype.appendChild=function(n){
        dom(this.style,n)
    }
    return StyleManager
})()
