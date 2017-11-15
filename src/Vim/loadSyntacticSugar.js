import dom from 'https://cdn.rawgit.com/anliting/althea/ea16c0d91285a61063e9251ad1387b7cf4732a39/src/AltheaServer/HttpServer/files/lib/dom.js'
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
