(async()=>{
    let
        insertAt=   await module.shareImport('functions/insertAt.js'),
        docs=       await module.repository.docs
    function put(vim,c,s){
        vim._text=insertAt(s,vim._trueText,c)
    }
    function putString(vim,c,s){
        put(vim,c,s)
        vim._cursor.moveTo(c+s.length-1)
    }
    function putLinewise(vim,c,s){
        put(vim,c,s)
        vim._cursor.moveTo(c)
    }
    function yank(vim,r,m,s){
        vim._setRegister(r,{mode:m,string:s})
    }
    function deleteCharacterwise(vim,r,a,b){
        let txt=vim._trueText
        vim._text=txt.substring(0,a)+txt.substring(b)
        yank(vim,r,'string',txt.substring(a,b))
        vim._cursor.moveTo(a)
    }
    function D(vim,doc){
        let
            a=vim._cursor.abs,
            b=vim._cursor.lineEnd-1,
            txt=vim._trueText
        yank(vim,doc.register,'string',txt.substring(a,b))
        vim._text=txt.substring(0,a)+txt.substring(b)
        vim._cursor.moveTo(a)
        vim._cursor.moveTo(vim._cursor.abs)
        return docs.acc
    }
    function O(vim,doc){
        let
            c=vim._cursor.lineStart,
            txt=vim._trueText
        vim._mode='insert'
        vim._text=txt.substring(0,c)+'\n'+txt.substring(c)
        vim._cursor.moveTo(vim._cursor.lineStart)
        return docs.acc
    }
    function P(vim,doc){
        let reg=vim._registers[doc.register]
        if(!reg)
            return docs.ac
        let s=reg.string.repeat(doc.count)
        if(reg.mode=='string')
            putString(vim,vim._cursor.abs,s)
        else if(reg.mode=='line')
            putLinewise(vim,vim._cursor.lineStart,s)
        return docs.acc
    }
    function X(vim,doc){
        let
            abs=vim._cursor.abs
            ls=vim._cursor.lineStart,
            count=Math.min(abs-ls,Math.max(0,doc.count))
        deleteCharacterwise(vim,doc.register,abs-count,abs)
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
        let arg=doc.count
        arg=Math.min(vim._cursor._countOfRows-vim._cursor.r,arg)
        let
            txt=vim._trueText,
            a=vim._cursor.line(vim._cursor.r),
            b=vim._cursor.line(vim._cursor.r+arg)
        yank(vim,doc.register,'line',txt.substring(a,b))
        vim._text=txt.substring(0,a)+txt.substring(b)
        vim._cursor.moveTo(vim._cursor.lineStart)
        return docs.acc
    }
    function o(vim,doc){
        vim._text||(vim._text='\n')
        vim._mode='insert'
        vim._cursor.moveTo(vim._cursor.lineEnd)
        let c=vim._cursor.abs
        vim._text=vim._text.substring(0,c)+'\n'+vim._text.substring(c)
        return docs.acc
    }
    function p(vim,doc){
        let reg=vim._registers[doc.register]
        if(!reg)
            return docs.ac
        let s=reg.string.repeat(doc.count)
        if(reg.mode=='string')
            putString(vim,vim._cursor.abs+1,s)
        else if(reg.mode=='line')
            putLinewise(vim,vim._cursor.lineEnd,s)
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
        yank(vim,doc.register,'line',vim._trueText.substring(a,b))
        return docs.ac
    }
    function x(vim,doc){
        let
            abs=vim._cursor.abs
            le=vim._cursor.lineEnd,
            count=Math.min(le-1-abs,Math.max(0,doc.count))
        deleteCharacterwise(vim,doc.register,abs,abs+count)
        return docs.acc
    }
    return{
        D,
        O,
        P,
        X,
        a,
        dd,
        o,
        p,
        yy,
        x,
    }
})()
