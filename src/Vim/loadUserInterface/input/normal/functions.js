import docs from'./docs.js'
import functions from'./functions/functions.js'
import motions from'./functions/motions.js'
function gotoLine(vim,n){
    vim._trueCursor.moveTo(vim._trueCursor.line(n))
}
function D(vim,doc){
    functions.deleteCharacterwise(
        vim,
        doc.register,
        vim._trueCursor.abs,
        vim._trueCursor.lineEnd-1
    )
    if(vim._trueCursor.abs)
        vim._trueCursor.moveTo(vim._trueCursor.abs)
    return docs.acc
}
function G(vim,doc){
    gotoLine(vim,Math.min(
        vim._trueCursor._countOfRows,
        doc.count||vim._trueCursor._countOfRows
    )-1)
    return docs.ac
}
function O(vim,doc){
    functions.putLinewise(vim,vim._trueCursor.lineStart,'\n')
    vim._mode='insert'
    return docs.acc
}
function P(vim,doc){
    let reg=vim._registers[doc.register]
    if(!reg)
        return docs.ac
    let s=reg.string.repeat(doc.count)
    if(reg.mode=='string')
        functions.putCharacterwise(vim,vim._trueCursor.abs,s)
    else if(reg.mode=='line')
        functions.putLinewise(vim,vim._trueCursor.lineStart,s)
    return docs.acc
}
function X(vim,doc){
    let
        abs=vim._trueCursor.abs,
        ls=vim._trueCursor.lineStart,
        count=Math.min(abs-ls,Math.max(0,doc.count))
    functions.deleteCharacterwise(vim,doc.register,abs-count,abs)
    return docs.acc
}
function a(vim,doc){
    vim._mode='insert'
    vim._trueCursor.moveRight()
    return docs.ac
}
function dd(vim,doc){
    let c=vim._cursor
    if(c.r<0)
        return docs.ac
    let count=Math.min(c._countOfRows-c.r,doc.count)
    functions.deleteLinewise(
        vim,
        doc.register,
        c.line(c.r),
        c.line(c.r+count)
    )
    c.moveTo(c.lineStart)
    return docs.acc
}
function gg(vim,doc){
    gotoLine(vim,Math.min(vim._trueCursor._countOfRows,doc.count||1)-1)
    return docs.ac
}
function o(vim,doc){
    functions.putLinewise(vim,vim._trueCursor.lineEnd,'\n')
    vim._mode='insert'
    return docs.acc
}
function p(vim,doc){
    let reg=vim._registers[doc.register]
    if(!reg)
        return docs.ac
    let s=reg.string.repeat(doc.count)
    if(reg.mode=='string')
        functions.putCharacterwise(vim,vim._trueCursor.abs+1,s)
    else if(reg.mode=='line')
        functions.putLinewise(vim,vim._trueCursor.lineEnd,s)
    return docs.acc
}
function yy(vim,doc){
    let c=vim._cursor
    if(c.r<0)
        return docs.ac
    let arg=doc.count
    arg=Math.min(c._countOfRows-c.r,arg)
    let
        a=c.line(c.r),
        b=c.line(c.r+arg)
    functions.yank(
        vim,
        doc.register,
        'line',
        vim._trueText.substring(a,b)
    )
    return docs.ac
}
function x(vim,doc){
    let
        abs=vim._trueCursor.abs,
        le=vim._trueCursor.lineEnd,
        count=Math.min(le-1-abs,Math.max(0,doc.count))
    functions.deleteCharacterwise(vim,doc.register,abs,abs+count)
    return docs.acc
}
export default{
    D,
    G,
    O,
    P,
    X,
    a,
    b:motions.b,
    B:motions.B,
    dd,
    e:motions.e,
    E:motions.E,
    gg,
    h:motions.h,
    j:motions.j,
    k:motions.k,
    l:motions.l,
    o,
    p,
    w:motions.w,
    W:motions.W,
    yy,
    x,
}
