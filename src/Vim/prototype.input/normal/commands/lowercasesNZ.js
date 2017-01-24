function n(vim,cmd,arg){
    //vim.gotoNextMatch()
    return{
        acceptable:true,
        complete:true,
    }
}
function o(vim,cmd,arg){
    vim._text||(vim._text='\n')
    vim._mode='insert'
    vim._cursor.moveTo(vim._cursor.lineEnd)
    let c=vim._cursor.abs
    vim._text=vim._text.substring(0,c)+'\n'+vim._text.substring(c)
    return{
        acceptable:true,
        complete:true,
        changed:true,
    }
}
function p(vim,cmd,arg){
    if(!vim._registers['"'])
        return{
            acceptable:true,
            complete:true,
        }
    vim._text||(vim._text='\n')
    if(vim._registers['"'].mode=='string'){
        let c=vim._cursor.abs
        vim._text=
            vim._text.substring(0,c+1)+
            vim._registers['"'].string+
            vim._text.substring(c+1)
        vim._cursor.moveTo(c+vim._registers['"'].string.length)
    }else if(vim._registers['"'].mode=='line'){
        let c=vim._cursor.lineEnd
        vim._text=
            vim._text.substring(0,c)+
            vim._registers['"'].string+
            vim._text.substring(c)
        vim._cursor.moveTo(vim._cursor.lineEnd)
    }
    return{
        acceptable:true,
        complete:true,
        changed:true,
    }
}
function r(vim,cmd,arg){
    if(cmd=='')
        return{acceptable:true}
    if(vim._text){
        let c=vim._cursor.abs
        vim._text=vim._text.substring(0,c)+cmd+vim._text.substring(c+1)
    }
    return{
        acceptable:true,
        complete:true,
        changed:true,
    }
}
function u(vim,cmd,arg){
    if(vim._undoBranchManager.current.previous!=undefined){
        vim._undoBranchManager.current=
            vim._undoBranchManager.current.previous
        vim._text=vim._undoBranchManager.current.text
    }
    return{
        acceptable:true,
        complete:true,
    }
}
function v(vim,cmd,arg){
    let c=vim._cursor.abs
    vim._mode='visual'
    vim._cursor.moveTo(c)
    return{
        acceptable:true,
        complete:true,
    }
}
function x(vim,cmd,arg){
    let
        abs=vim._cursor.abs
        le=vim._cursor.lineEnd,
        txt=vim._trueText
    arg=Math.min(le-1-abs,Math.max(0,arg||1))
    let
        a=abs,
        b=abs+arg
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
function y(vim,cmd,arg){
    if(cmd=='')
        return{acceptable:true}
    if(cmd=='y'){
        if(vim._text){
            arg=arg||1
            arg=Math.min(vim._cursor._countOfRows-vim._cursor.r,arg)
            let
                a=vim._cursor.line(vim._cursor.r),
                b=vim._cursor.line(vim._cursor.r+arg)
            vim._registers['"']={
                mode:'line',
                string:vim._text.substring(a,b),
            }
        }
        return{
            acceptable:true,
            complete:true,
        }
    }
}
({n,o,p,r,u,v,x,y})
