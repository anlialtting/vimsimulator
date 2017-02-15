function GreedyText(){
    this.lines=[]
}
Object.defineProperty(GreedyText.prototype,'update',{set(val){
    if(typeof val=='string'){
        val=val.split('\n')
        val.pop()
        this.lines=val
    }
}})
Object.defineProperty(GreedyText.prototype,'string',{get(){
    let a=this.lines.slice()
    a.push('')
    return a.join('\n')
}})
GreedyText
