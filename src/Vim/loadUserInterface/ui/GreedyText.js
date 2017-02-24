function GreedyText(){
    this._options={}
    this.lines=[]
}
GreedyText.prototype._char=function(n){
    return this.lines.slice(0,n).map(v=>v.string.length+1).reduce(
        (a,b)=>a+b,0
    )
}
GreedyText.prototype._line=function(n){
    let i=0,s=0
    while(i<this.lines.length&&s+this.lines[i].string.length+1<=n)
        s+=this.lines[i++].string.length+1
    return i
}
Object.defineProperty(GreedyText.prototype,'countOfRows',{get(){
    this.wrap()
    return this.lines.map(l=>l.wrapped.rows.length).reduce((a,b)=>a+b,0)
}})
Object.defineProperty(GreedyText.prototype,'string',{get(){
    return this.lines.map(l=>l.string+'\n').join('')
}})
Object.defineProperty(GreedyText.prototype,'update',{set(val){
    if(typeof val=='string'){
        val=val.split('\n')
        val.pop()
        this.lines=val.map(val=>new Line(val))
    }else if(typeof val=='object'){
        let removeAdd=(s,e,a)=>{
            a=a.split('\n')
            a.pop()
            a=a.map(v=>new Line(v))
            a.unshift(s,e-s)
            ;[].splice.apply(this.lines,a)
        }
        if(val.function=='insert'){
            let l=this._line(val.position)
            let p=val.position-this._char(l)
            let s=(this.lines[l]?this.lines[l].string+'\n':'')
            s=s.substring(0,p)+val.string+s.substring(p)
            removeAdd(l,l+1,s)
        }else if(val.function=='delete'){
            let sl=this._line(val.start),el=this._line(val.end)+2
            let lc=this._char(sl)
            let start=val.start-lc,end=val.end-lc
            let s=this.lines.slice(sl,el).map(v=>v.string).join('\n')+'\n'
            s=s.substring(0,start)+s.substring(end)
            removeAdd(sl,el,s)
        }
    }
}})
Object.defineProperty(GreedyText.prototype,'width',{set(val){
    if(this._width!=val)
        this.lines.map(l=>{
            delete l.rows
        })
    this._width=val
},get(){
    return this._width
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
GreedyText.prototype.setOption=function(key,val){
    this._options[key]=val
    if(key=='list')
        this.lines.map(l=>{
            delete l.rows
        })
}
/*
    A line should not include EOL, since it has already been seperated
    from the others.
*/
function Line(val){
    this.string=val
}
;(async()=>{
    let wrapLine=await module.shareImport('GreedyText/wrapLine.js')
    GreedyText.prototype.wrap=function(){
        let
            charCount=0,
            rowsCount=0
        this.lines.map((l,j)=>{
            let s=l.string+'\n'
            if(!l.rows)
                l.rows=wrapLine(this._options.list,s,this.width||Infinity)
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
