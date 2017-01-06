function r(count,string){
    var c=this.textarea.selectionStart
    count=count||1
    this.textarea.value=
        this.textarea.value.substring(0,c)+
        Array(count+1).join(string)+
        this.textarea.value.substring(
            c+count,this.textarea.value.length
        )
    this.textarea.selectionStart=c+count-1
}
function u(){
    var c=this.textarea.selectionStart
    this.textarea.value=
        this.histories[this.histories.length-1]
    while(
        0<=this.histories.length-1&&
        this.histories[this.histories.length-1]===
        this.textarea.value
    )
        this.histories.pop()
    if(0<=this.histories.length-1)
        this.textarea.value=this.histories[this.histories.length-1]
    this.textarea.selectionStart=c
}
function x(count){
    var selectionStart=this.textarea.selectionStart
    count=count||1
    this.textarea.value=this.textarea.value.substring(
        0,this.textarea.selectionStart
    )+this.textarea.value.substring(
        this.textarea.selectionStart+count
    )
    this.textarea.selectionStart=selectionStart
}
function dot(count){
}
function getLineStartByCursor(text,cursor){
    return text.substring(0,cursor).lastIndexOf('\n')+1
}
function getLineEndByCursor(text,cursor){
    return text.indexOf('\n',cursor)+1
}
({r,u,x,dot})
