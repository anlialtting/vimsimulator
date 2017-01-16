function A(vim){
    if(vim._text)
        vim._cursor.moveToEOL()
    vim._mode='insert'
    return{
        acceptable:true,
        complete:true,
    }
}
function D(vim,cmd,arg){
    if(vim._text){
        let
            a=vim._cursor.abs,
            b=vim._cursor.lineEnd-1
        vim.register={
            mode:'string',
            string:vim._text.substring(a,b),
        }
        vim._text=
            vim._text.substring(0,a)+
            vim._text.substring(b)
    }
    return{
        acceptable:true,
        complete:true,
    }
}
function G(vim,cmd,arg){
    if(vim._text){
        arg=arg||vim._cursor._countOfRows
        arg=Math.min(vim._cursor._countOfRows,arg)
        vim._cursor.moveTo(vim._cursor.line(arg-1))
    }
    return{
        acceptable:true,
        complete:true,
    }
}
function I(vim,cmd,arg){
    if(vim._text){
        vim._cursor.moveTo(vim._cursor.lineStart)
    }
    vim._mode='insert'
    return{
        acceptable:true,
        complete:true,
    }
}
function O(vim,cmd,arg){
    vim._mode='insert'
    vim._text||(vim._text='\n')
    vim._cursor.moveTo(vim._cursor.lineStart)
    let c=vim._cursor.abs
    vim._text=vim._text.substring(0,c)+'\n'+vim._text.substring(c)
    return{
        acceptable:true,
        complete:true,
        changed:true,
    }
}
function P(vim,cmd,arg){
    if(!vim.register)
        return{
            acceptable:true,
            complete:true,
        }
    vim._text||(vim._text='\n')
    if(vim.register.mode=='string'){
        let c=vim._cursor.abs
        vim._text=
            vim._text.substring(0,c)+
            vim.register.string+
            vim._text.substring(c)
        vim._cursor.moveTo(c+vim.register.string.length-1)
    }else if(vim.register.mode=='line'){
        let c=vim._cursor.lineStart
        vim._text=
            vim._text.substring(0,c)+
            vim.register.string+
            vim._text.substring(c)
        vim._cursor.moveTo(vim._cursor.lineStart)
    }
    return{
        acceptable:true,
        complete:true,
        changed:true,
    }
}
function X(vim,cmd,arg){
    vim._text||(vim._text='\n')
    vim._text=
        vim._text.substring(0,vim._cursor.abs-1)+
        vim._text.substring(vim._cursor.abs)
    vim._cursor.moveTo(vim._cursor.abs-1)
    return{
        acceptable:true,
        complete:true,
        changed:true,
    }
}
({A,D,G,I,O,P,X})
