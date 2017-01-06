function X(count){
    var selectionStart=this.textarea.selectionStart
    count=count||1
    this.textarea.value=this.textarea.value.substring(
        0,this.textarea.selectionStart-count
    )+this.textarea.value.substring(
        this.textarea.selectionStart
    )
    this.textarea.selectionStart=selectionStart-count
}
function getLineStartByCursor(text,cursor){
    return text.substring(0,cursor).lastIndexOf('\n')+1
}
function getLineEndByCursor(text,cursor){
    return text.indexOf('\n',cursor)+1
}
function getLineHeadByCursor(text,cursor){
    var lineStart=getLineStartByCursor(text,cursor)
    return lineStart+text.substring(lineStart).search(/[^ ]/)
}
({X})
