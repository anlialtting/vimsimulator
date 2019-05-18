import docs from'../docs.js'
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
        vim._trueCursor.moveWordRight()
    return docs.ac
}
function W(vim,doc){
    let count=doc.count||1
    while(count--)
        vim._trueCursor.moveGeneralWordRight()
    return docs.ac
}
export default{h,j,k,l,w,W}
