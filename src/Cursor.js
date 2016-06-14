module.export=Cursor
function Cursor(vim){
    this._vim=vim
    this._x=0
    this._y=0
}
Cursor.prototype.moveLeft=function(){
    this._x=Math.max(0,this.c-1)
}
Cursor.prototype.moveRight=function(){
    this._x=Math.min(this._countOfCols-1,this.c+1)
}
Cursor.prototype.moveUp=function(){
    this._y=Math.max(0,this._y-1)
}
Cursor.prototype.moveDown=function(){
    this._y=Math.min(this._countOfRows-1,this._y+1)
}
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
    return Math.min(this._countOfCols-1,Math.max(0,this._x))
}})
