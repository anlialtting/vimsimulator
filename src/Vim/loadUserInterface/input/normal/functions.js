var
    docs={
        ac:{
            acceptable:true,
            complete:true,
        },
        acc:{
            acceptable:true,
            complete:true,
            changed:true,
        }
    }
;(async()=>{
    let insertAt=await module.shareImport('functions/insertAt.js')
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
    function D(vim,doc){
        let
            a=vim._cursor.abs,
            b=vim._cursor.lineEnd-1,
            txt=vim._trueText
        vim._registers['"']={
            mode:'string',
            string:txt.substring(a,b),
        }
        vim._text=txt.substring(0,a)+txt.substring(b)
        vim._cursor.moveTo(a)
        vim._cursor.moveTo(vim._cursor.abs)
        return docs.acc
    }
    function P(vim,doc){
        let reg=doc.register
        if(!reg)
            return docs.ac
        let s=reg.string.repeat(doc.count)
        if(reg.mode=='string')
            putString(vim,vim._cursor.abs,s)
        else if(reg.mode=='line')
            putLinewise(vim,vim._cursor.lineStart,s)
        return docs.acc
    }
    function dd(vim,doc){
        if(vim._text){
            let arg=doc.count
            arg=Math.min(vim._cursor._countOfRows-vim._cursor.r,arg)
            let
                txt=vim._trueText,
                a=vim._cursor.line(vim._cursor.r),
                b=vim._cursor.line(vim._cursor.r+arg)
            vim._registers[doc.register]={
                mode:'line',
                string:txt.substring(a,b),
            }
            vim._text=txt.substring(0,a)+txt.substring(b)
            vim._cursor.moveTo(vim._cursor.lineStart)
        }
        return docs.acc
    }
    function p(vim,doc){
        let reg=doc.register
        if(!reg)
            return docs.ac
        let s=reg.string.repeat(doc.count)
        if(reg.mode=='string')
            putString(vim,vim._cursor.abs+1,s)
        else if(reg.mode=='line')
            putLinewise(vim,vim._cursor.lineEnd,s)
        return docs.acc
    }
    return{
        D,
        P,
        dd,
        p,
    }
})()
