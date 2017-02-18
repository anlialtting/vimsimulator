function GreedyText(){
    this.lines=[]
}
Object.defineProperty(GreedyText.prototype,'countOfRows',{get(){
    this.wrap()
    return this.lines.map(l=>l.wrapped.rows.length).reduce((a,b)=>a+b)
}})
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
    let res=this.lines.map(l=>l.wrapped)
    return start==undefined?res:cut(res)
    function cut(res){
        return res.map(l=>{
            if(l.startRow+l.rows.length<=start||end<=l.startRow)
                return
            l.rows=l.rows.map((r,i)=>
                inRange(l.startRow+i)&&r
            ).filter(r=>r)
            return l
        }).filter(l=>l!=undefined)
    }
    function inRange(i){
        return start<=i&&i<end
    }
}
GreedyText.prototype.row=function(pos){
    let res
    this.wrap()
    this.lines.map(l=>l.wrapped).map(l=>l.rows.map((r,i)=>{
        if(l.start+r.start<=pos&&pos<l.start+r.end)
            res=l.startRow+i
    }))
    return res
}
/*
    A line should not include EOL, since it has already been seperated
    from the others.
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
            let s=l.string+'\n'
            if(!l.rows)
                l.rows=wrapLine(list,s,targetWidth||Infinity)
            l.wrapped={
                index:j,
                start:charCount,
                startRow:rowsCount,
                rows:l.rows,
            }
            charCount+=s.length
            rowsCount+=l.rows.length
        })
    }
    return GreedyText
})()
