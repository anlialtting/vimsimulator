(async()=>{
    let insertAt=await module.shareImport('functions/insertAt.js')
    function P(vim,cmd,arg){
        let reg=vim._registers['"']
        if(!reg)
            return{
                acceptable:true,
                complete:true,
            }
        let s=reg.string.repeat(arg||1)
        if(reg.mode=='string'){
            let c=vim._cursor.abs
            vim._text=insertAt(s,vim._trueText,c)
            vim._cursor.moveTo(c-1+s.length)
        }else if(reg.mode=='line'){
            let c=vim._cursor.lineStart
            vim._text=insertAt(s,vim._trueText,c)
            vim._cursor.moveTo(vim._cursor.lineStart)
        }
        return{
            acceptable:true,
            complete:true,
            changed:true,
        }
    }
    function p(vim,cmd,arg){
        let reg=vim._registers['"']
        if(!reg)
            return{
                acceptable:true,
                complete:true,
            }
        let s=reg.string.repeat(arg||1)
        if(reg.mode=='string'){
            let c=vim._cursor.abs
            vim._text=insertAt(s,vim._trueText,c+1)
            vim._cursor.moveTo(c+s.length)
        }else if(reg.mode=='line'){
            let c=vim._cursor.lineEnd
            vim._text=insertAt(s,vim._trueText,c)
            vim._cursor.moveTo(vim._cursor.lineEnd)
        }
        return{
            acceptable:true,
            complete:true,
            changed:true,
        }
    }
    return{
        P,
        p,
    }
})()
