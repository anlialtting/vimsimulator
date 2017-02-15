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
    return{
        start:null,
        rows:null,
    }
}
GreedyText.prototype.row=function(pos){
    return 0
}
function Line(val){
    this.string=val
}
GreedyText
