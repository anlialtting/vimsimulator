import{dom}from 'https://gitcdn.link/cdn/anliting/simple.js/3b5e122ded93bb9a5a7d5099ac645f1e1614a89b/src/simple.static.js'
export default o=>{
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
        this.polluteStyle
        this.polluteCopy
    }})
    Object.defineProperty(o,'polluteStyle',{get(){
        document.head.appendChild(this.style)
        this.once('quit',()=>{
            document.head.removeChild(this.style)
        })
    }})
    Object.defineProperty(o,'polluteCopy',{get(){
        this.copy=s=>{
            let n=dom('textarea',{value:s})
            n.style.position='fixed'
            let e=document.activeElement
            dom(document.body,n)
            n.select()
            document.execCommand('copy',true,null)
            document.body.removeChild(n)
            if(e)
                e.focus()
        }
    }})
}
