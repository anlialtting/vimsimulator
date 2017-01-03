function lines(text){
/*
    A line should not include EOL,
    since it has already been seperated from the others.
*/
    let result=text.split('\n')
    result.pop()
    return result
}
function lineNumber(text,cursor){
    return text.substring(0,cursor).split('\n').length-1
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
;({
    lines,
    lineNumber,
    getStartByCursor,
    getEndByCursor,
    getHeadByCursor,
})
