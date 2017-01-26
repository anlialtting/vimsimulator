(o=>{
    Object.defineProperty(o,'node',{get(){
        return this._mainUi.node
    }})
    Object.defineProperty(o,'height',{set(val){
        this._mainUi.height=val
    }})
    Object.defineProperty(o,'width',{set(val){
        this._mainUi.width=val
    }})
    Object.defineProperty(o,'pollute',{get(){
        document.head.appendChild(this.style)
        this.once('quit',()=>{
            document.head.removeChild(this.style)
        })
    }})
})
