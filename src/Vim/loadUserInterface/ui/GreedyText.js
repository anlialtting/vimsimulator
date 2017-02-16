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
var wrapLine=module.shareImport('GreedyText/wrapLine.js')
;(async()=>{
    wrapLine=await wrapLine
    GreedyText.prototype.wrap=function(list,targetWidth){
        let
            charCount=0,
            rowsCount=0
        this.lines.map((l,j)=>{
            l=l.string+'\n'
            let rows=wrapLine(list,l,targetWidth||Infinity)
            let res={
                index:j,
                start:charCount,
                startRow:rowsCount,
                rows,
            }
            charCount+=l.length
            rowsCount+=rows.length
            this.lines[j].wrapped=res
        })
    }
    return GreedyText
})()
