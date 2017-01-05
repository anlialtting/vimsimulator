function Cursor(vim){
    this._vim=vim
    this._x=0
    this._y=0
}
// start 0
Object.defineProperty(Cursor.prototype,'_countOfRows',{get(){
    return this._vim.text.split('\n').length-1
}})
Object.defineProperty(Cursor.prototype,'_countOfCols',{get(){
    return this._vim.text.split('\n')[this.r].length
}})
Object.defineProperty(Cursor.prototype,'r',{get(){
    return Math.min(this._countOfRows-1,Math.max(0,this._y))
}})
Object.defineProperty(Cursor.prototype,'c',{get(){
    return Math.min(availableCols(this)-1,Math.max(0,this._x))
}})
function availableCols(c){
    if(c._vim.mode=='normal')
        return Math.max(1,c._countOfCols)
    if(c._vim.mode=='insert')
        return c._countOfCols+1
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
Object.defineProperty(Cursor.prototype,'abs',{get(){
    return this._vim.text.split('\n').slice(0,this.r).join('').length+
        this.r+
        this.c
}})
// end 1a
// start 1b
Cursor.prototype.moveTo=function(n){
    this._y=this._vim.text.substring(0,n).split('\n').length-1
    this._x=n-(
        this._vim.text.split('\n').slice(0,this.r).join('').length+this.r
    )
}
// end 1b
// start 1c
Object.defineProperty(Cursor.prototype,'lineStart',{get(){
    return this._vim.text.substring(0,this.abs).lastIndexOf('\n')+1
}})
Object.defineProperty(Cursor.prototype,'lineEnd',{get(){
    return this.abs+this._vim.text.substring(this.abs).indexOf('\n')+1
}})
// end 1c
// start 2
Cursor.prototype.moveToEOL=function(){
    this.moveTo(this.lineEnd-1)
}
// end 2
Cursor
