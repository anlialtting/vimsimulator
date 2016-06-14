module.export={
    getStartByCursor,
    getEndByCursor,
    getHeadByCursor,
}
function getStartByCursor(text,cursor){
    return text.substring(0,cursor).lastIndexOf('\n')+1
}
function getEndByCursor(text,cursor){
    return text.indexOf('\n',cursor)+1
}
function getHeadByCursor(text,cursor){
    let lineStart=getStartByCursor(text,cursor)
    return lineStart+text.substring(lineStart).search(/[^ ]/)
}
