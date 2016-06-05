Promise.all([
    CryptoJS,
    module.shareImport('JsonFormatter.js'),
]).then(modules=>{
let
    CryptoJS=modules[0],
    JsonFormatter=modules[1]
module.export={A,D,G,I,O,P,X}
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
})
