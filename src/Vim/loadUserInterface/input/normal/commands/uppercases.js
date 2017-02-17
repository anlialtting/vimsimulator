function A(vim){
    vim._mode='insert'
    vim._cursor.moveToEOL()
    return{
        acceptable:true,
        complete:true,
    }
}
function D(vim,cmd,arg){
    return{function:'D'}
}
function G(vim,cmd,arg){
    arg=arg||vim._cursor._countOfRows
    arg=Math.min(vim._cursor._countOfRows,arg)
    vim._cursor.moveTo(vim._cursor.line(arg-1))
    return{
        acceptable:true,
        complete:true,
    }
}
function I(vim,cmd,arg){
    vim._mode='insert'
    vim._cursor.moveTo(vim._cursor.lineStart)
    return{
        acceptable:true,
        complete:true,
    }
}
function O(vim,cmd,arg){
    let
        c=vim._cursor.lineStart,
        txt=vim._trueText
    vim._mode='insert'
    vim._text=txt.substring(0,c)+'\n'+txt.substring(c)
    vim._cursor.moveTo(vim._cursor.lineStart)
    return{
        acceptable:true,
        complete:true,
        changed:true,
    }
}
function P(vim,cmd,arg){
    return{
        function:'P',
        count:arg||1,
        register:vim._registers['"'],
    }
}
function X(vim,cmd,arg){
    let
        abs=vim._cursor.abs
        ls=vim._cursor.lineStart,
        txt=vim._trueText
    arg=Math.min(abs-ls,Math.max(0,arg||1))
    let
        a=abs-arg,
        b=abs
    vim._text=txt.substring(0,a)+txt.substring(b)
    vim._registers['"']={
        mode:'string',
        string:txt.substring(a,b)
    }
    vim._cursor.moveTo(a)
    return{
        acceptable:true,
        complete:true,
        changed:true,
    }
}
({A,D,G,I,O,P,X})
