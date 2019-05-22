import docs from'../docs.js'
function B(vim,doc){
    let count=doc.count||1
    while(count--)
        vim._trueCursor.moveToPreviousGeneralWordBegin()
    return docs.ac
}
function E(vim,doc){
    let count=doc.count||1
    while(count--)
        vim._trueCursor.moveToNextGeneralWordEnd()
    return docs.ac
}
function W(vim,doc){
    let count=doc.count||1
    while(count--)
        vim._trueCursor.moveToNextGeneralWordBegin()
    return docs.ac
}
function b(vim,doc){
    let count=doc.count||1
    while(count--)
        vim._trueCursor.moveToPreviousWordBegin()
    return docs.ac
}
function e(vim,doc){
    let count=doc.count||1
    while(count--)
        vim._trueCursor.moveToNextWordEnd()
    return docs.ac
}
function h(vim,doc){
    let count=doc.count||1
    while(count--)
        vim._trueCursor.moveLeft()
    return docs.ac
}
function j(vim,doc){
    let count=doc.count||1
    while(count--)
        vim._trueCursor.moveDown()
    return docs.ac
}
function k(vim,doc){
    let count=doc.count||1
    while(count--)
        vim._trueCursor.moveUp()
    return docs.ac
}
function l(vim,doc){
    let count=doc.count||1
    while(count--)
        vim._trueCursor.moveRight()
    return docs.ac
}
function w(vim,doc){
    let count=doc.count||1
    while(count--)
        vim._trueCursor.moveToNextWordBegin()
    return docs.ac
}
export default{B,E,W,b,e,h,j,k,l,w,}
