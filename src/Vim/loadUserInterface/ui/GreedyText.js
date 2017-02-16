function GreedyText(){
    this.lines=[]
}
Object.defineProperty(GreedyText.prototype,'update',{set(val){
    if(typeof val=='string'){
        val=val.split('\n')
        val.pop()
        this.lines=val.map(val=>new Line(val))
    }
}})
Object.defineProperty(GreedyText.prototype,'string',{get(){
    return this.lines.map(l=>l.string+'\n').join('')
}})
GreedyText.prototype.uiText=function(start,end){
    return []
}
GreedyText.prototype.row=function(pos){
    return 0
}
/*
    A line should not include EOL,
    since it has already been seperated from the others.
*/
function Line(val){
    this.string=val
}
GreedyText
