import doe from'../../lib/doe.mjs'
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
        doe.head(this.style)
        this.once('quit',()=>{
            doe.head(1,this.style)
        })
    }})
    Object.defineProperty(o,'polluteCopy',{get(){
        this.copy=s=>{
            let e=document.activeElement,n
            doe.body(n=doe.textarea({value:s},n=>{
                n.style.position='fixed'
            }))
            n.select()
            document.execCommand('copy',true,null)
            doe.body(1,n)
            if(e)
                e.focus()
        }
    }})
}
