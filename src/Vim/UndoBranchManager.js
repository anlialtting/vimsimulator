function UndoBranchManager(){
    this._undoBranches=[]
}
UndoBranchManager.prototype.clear=function(){
    this._undoBranches=[]
    delete this.current
}
UndoBranchManager.prototype.push=function(text){
    let b=new UndoBranch(text)
    this._undoBranches.push(b)
    if(this.current!=undefined){
        this.current.next=b
        b.previous=this.current
    }
    this.current=b
}
function UndoBranch(text){
    this.text=text
}
UndoBranchManager
