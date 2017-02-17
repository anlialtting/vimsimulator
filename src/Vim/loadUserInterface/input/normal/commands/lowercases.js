function a(vim,cmd,arg){
    vim._mode='insert'
    vim._cursor.moveRight()
    return{
        acceptable:true,
        complete:true,
    }
}
function d(vim,cmd,arg){
    if(cmd=='')
        return{acceptable:true}
    if(cmd=='d'){
        return{
            function:'dd',
            count:arg||1,
            register:'"',
        }
    }
}
function g(vim,cmd,arg){
    if(cmd=='')
        return{acceptable:true}
    if(cmd=='g'){
        arg=arg||1
        arg=Math.min(vim._cursor._countOfRows,arg)
        vim._cursor.moveTo(vim._cursor.line(arg-1))
        return{
            acceptable:true,
            complete:true,
        }
    }
}
function h(vim,cmd,arg){
    arg=arg||1
    if(vim._text)
        while(arg--)
            vim._cursor.moveLeft()
    return{
        acceptable:true,
        complete:true,
    }
}
function i(vim,cmd,arg){
    vim._mode='insert'
    return{
        acceptable:true,
        complete:true,
    }
}
function j(vim,cmd,arg){
    arg=arg||1
    if(vim._text)
        while(arg--)
            vim._cursor.moveDown()
    return{
        acceptable:true,
        complete:true,
    }
}
function k(vim,cmd,arg){
    arg=arg||1
    if(vim._text)
        while(arg--)
            vim._cursor.moveUp()
    return{
        acceptable:true,
        complete:true,
    }
}
function l(vim,cmd,arg){
    arg=arg||1
    if(vim._text)
        while(arg--)
            vim._cursor.moveRight()
    return{
        acceptable:true,
        complete:true,
    }
}
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
    return{
        function:'p',
        count:arg||1,
        register:'"',
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
        return{
            function:'yy',
            count:arg||1,
            register:'"',
        }
    }
}
({a,d,g,h,i,j,k,l,n,o,p,r,u,v,x,y})
