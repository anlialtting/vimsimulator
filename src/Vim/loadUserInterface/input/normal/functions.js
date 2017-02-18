var
    functions=  module.shareImport('functions/functions.js'),
    motions=    module.shareImport('functions/motions.js')
;(async()=>{
    let docs=await module.repository.docs
    functions=  await functions
    motions=    await motions
    function gotoLine(vim,n){
        vim._cursor.moveTo(vim._cursor.line(n))
    }
    function D(vim,doc){
        functions.deleteCharacterwise(
            vim,
            doc.register,
            vim._cursor.abs,
            vim._cursor.lineEnd-1
        )
        vim._cursor.moveTo(vim._cursor.abs)
        return docs.acc
    }
    function G(vim,doc){
        gotoLine(vim,Math.min(
            vim._cursor._countOfRows,
            doc.count||vim._cursor._countOfRows
        )-1)
        return docs.ac
    }
    function O(vim,doc){
        functions.putLinewise(vim,vim._cursor.lineStart,'\n')
        vim._mode='insert'
        return docs.acc
    }
    function P(vim,doc){
        let reg=vim._registers[doc.register]
        if(!reg)
            return docs.ac
        let s=reg.string.repeat(doc.count)
        if(reg.mode=='string')
            functions.putCharacterwise(vim,vim._cursor.abs,s)
        else if(reg.mode=='line')
            functions.putLinewise(vim,vim._cursor.lineStart,s)
        return docs.acc
    }
    function X(vim,doc){
        let
            abs=vim._cursor.abs
            ls=vim._cursor.lineStart,
            count=Math.min(abs-ls,Math.max(0,doc.count))
        functions.deleteCharacterwise(vim,doc.register,abs-count,abs)
        return docs.acc
    }
    function a(vim,doc){
        vim._mode='insert'
        vim._cursor.moveRight()
        return docs.ac
    }
    function dd(vim,doc){
        if(!vim._text)
            return docs.ac
        let count=Math.min(
            vim._cursor._countOfRows-vim._cursor.r,
            doc.count
        )
        functions.deleteLinewise(
            vim,
            doc.register,
            vim._cursor.line(vim._cursor.r),
            vim._cursor.line(vim._cursor.r+count)
        )
        vim._cursor.moveTo(vim._cursor.lineStart)
        return docs.acc
    }
    function gg(vim,doc){
        gotoLine(vim,Math.min(vim._cursor._countOfRows,doc.count||1)-1)
        return docs.ac
    }
    function o(vim,doc){
        functions.putLinewise(vim,vim._cursor.lineEnd,'\n')
        vim._mode='insert'
        return docs.acc
    }
    function p(vim,doc){
        let reg=vim._registers[doc.register]
        if(!reg)
            return docs.ac
        let s=reg.string.repeat(doc.count)
        if(reg.mode=='string')
            functions.putCharacterwise(vim,vim._cursor.abs+1,s)
        else if(reg.mode=='line')
            functions.putLinewise(vim,vim._cursor.lineEnd,s)
        return docs.acc
    }
    function yy(vim,doc){
        if(!vim._text)
            return docs.ac
        let arg=doc.count
        arg=Math.min(vim._cursor._countOfRows-vim._cursor.r,arg)
        let
            a=vim._cursor.line(vim._cursor.r),
            b=vim._cursor.line(vim._cursor.r+arg)
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
            abs=vim._cursor.abs
            le=vim._cursor.lineEnd,
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
