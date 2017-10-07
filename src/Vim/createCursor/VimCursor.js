function Cursor(vim){
    this._x=0
    this._y=0
}
// start 0
Object.defineProperty(Cursor.prototype,'_countOfRows',{get(){
    return this.text.split('\n').length-1
}})
Object.defineProperty(Cursor.prototype,'_countOfCols',{get(){
    return this.text?this.text.split('\n')[this.r].length:0
}})
Object.defineProperty(Cursor.prototype,'_exotic',{get(){
    let c=Object.create(this)
    Object.defineProperty(c,'_x',{set:val=>this._x=val,get:()=>this._x})
    Object.defineProperty(c,'_y',{set:val=>this._y=val,get:()=>this._y})
    return c
}})
Object.defineProperty(Cursor.prototype,'r',{set(val){
    this._y=val
},get(){
    return Math.min(this._countOfRows-1,Math.max(0,this._y))
}})
Object.defineProperty(Cursor.prototype,'c',{set(val){
    this._x=val
},get(){
    return Math.min(availableCols(this)-1,Math.max(0,this._x))
}})
function availableCols(c){
    if(
        c.mode=='normal'||
        c.mode=='cmdline'
    )
        return c._countOfCols
    if(
        c.mode=='visual'||
        c.mode=='insert'
    )
        return c._countOfCols+1
}
Cursor.prototype.line=function(n){
    return this.text.split('\n').slice(0,n).join('').length+n
}
// end 0
// start 1
Cursor.prototype.moveLeft=function(){
    this._x=Math.max(0,this.c-1)
}
Cursor.prototype.moveRight=function(){
    this._x=Math.min(availableCols(this)-1,this.c+1)
}
Cursor.prototype.moveUp=function(){
    this._y=Math.max(0,this._y-1)
}
Cursor.prototype.moveDown=function(){
    this._y=Math.min(this._countOfRows-1,this._y+1)
}
// end 1
// start 1a
Object.defineProperty(Cursor.prototype,'onChar',{get(){
    return 0<=this.c
}})
Object.defineProperty(Cursor.prototype,'abs',{get(){
    return(0<=this.r?this.line(this.r):0)+(0<=this.c?this.c:0)
}})
// end 1a
// start 1b
Cursor.prototype.moveTo=function(n){
    this._y=this.text.substring(0,n).split('\n').length-1
    this._x=n-(
        this.text.split('\n').slice(0,this.r).join('').length+this.r
    )
}
// end 1b
// start 1c
Object.defineProperty(Cursor.prototype,'lineStart',{get(){
    return this.text.substring(0,this.abs).lastIndexOf('\n')+1
}})
Object.defineProperty(Cursor.prototype,'lineEnd',{get(){
    let a=this.abs
    return a+this.text.substring(a).indexOf('\n')+1
}})
// end 1c
// start 2
Cursor.prototype.moveToEOL=function(){
    this.moveTo(this.lineEnd-1)
}
// end 2
export default Cursor
