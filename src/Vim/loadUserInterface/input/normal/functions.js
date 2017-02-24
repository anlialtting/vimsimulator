var
    functions=  module.shareImport('functions/functions.js'),
    motions=    module.shareImport('functions/motions.js')
;(async()=>{
    let docs=await module.repository.docs
    functions=  await functions
    motions=    await motions
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
            abs=vim._trueCursor.abs
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
        if(!vim._text)
            return docs.ac
        let count=Math.min(
            vim._trueCursor._countOfRows-vim._trueCursor.r,
            doc.count
        )
        functions.deleteLinewise(
            vim,
            doc.register,
            vim._trueCursor.line(vim._trueCursor.r),
            vim._trueCursor.line(vim._trueCursor.r+count)
        )
        vim._trueCursor.moveTo(vim._trueCursor.lineStart)
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
        if(!vim._text)
            return docs.ac
        let arg=doc.count
        arg=Math.min(vim._trueCursor._countOfRows-vim._trueCursor.r,arg)
        let
            a=vim._trueCursor.line(vim._trueCursor.r),
            b=vim._trueCursor.line(vim._trueCursor.r+arg)
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
            abs=vim._trueCursor.abs
            le=vim._trueCursor.lineEnd,
            count=Math.min(le-1-abs,Math.max(0,doc.count))
        functions.deleteCharacterwise(vim,doc.register,abs,abs+count)
        return docs.acc
    }
    return{
        D,
        G,
        O,
        P,
        X,
        a,
        dd,
        gg,
        h:motions.h,
        j:motions.j,
        k:motions.k,
        l:motions.l,
        o,
        p,
        yy,
        x,
    }
})()
