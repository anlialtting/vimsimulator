function A(vim){
    if(vim._text)
        vim._cursor.moveToEOL()
    vim.mode='insert'
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
    vim.mode='insert'
    return{
        acceptable:true,
        complete:true,
    }
}
function O(vim,cmd,arg){
    vim.mode='insert'
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
function a(vim,cmd,arg){
    vim.mode='insert'
    if(vim._text)
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
        if(vim._text){
            arg=arg||1
            arg=Math.min(vim._cursor._countOfRows-vim._cursor.r,arg)
            let
                a=vim._cursor.line(vim._cursor.r),
                b=vim._cursor.line(vim._cursor.r+arg)
            vim.register={
                mode:'line',
                string:vim._text.substring(a,b),
            }
            vim._text=vim._text.substring(0,a)+vim._text.substring(b)
            if(vim._text)
                vim._cursor.moveTo(vim._cursor.lineStart)
        }
        return{
            acceptable:true,
            complete:true,
            changed:true,
        }
    }
}
function g(vim,cmd,arg){
    if(cmd=='')
        return{acceptable:true}
    if(cmd=='g'){
        if(vim._text){
            arg=arg||1
            arg=Math.min(vim._cursor._countOfRows,arg)
            vim._cursor.moveTo(vim._cursor.line(arg-1))
        }
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
    vim.mode='insert'
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
    vim.mode='insert'
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
    if(!vim.register)
        return{
            acceptable:true,
            complete:true,
        }
    vim._text||(vim._text='\n')
    if(vim.register.mode=='string'){
        let c=vim._cursor.abs
        vim._text=
            vim._text.substring(0,c+1)+
            vim.register.string+
            vim._text.substring(c+1)
        vim._cursor.moveTo(c+vim.register.string.length)
    }else if(vim.register.mode=='line'){
        let c=vim._cursor.lineEnd
        vim._text=
            vim._text.substring(0,c)+
            vim.register.string+
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
    vim.mode='visual'
    //vim.visualmode.fixedCursor=vim.selectionStart
    return{
        acceptable:true,
        complete:true,
    }
}
function x(vim,cmd,arg){
    if(vim._text){
        let c=vim._cursor.abs
        vim._text=vim._text.substring(0,c)+vim._text.substring(c+1)
    }
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
            vim.register={
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
function lt(vim,cmd,arg){
    if(cmd=='')
        return{acceptable:true}
    if(cmd=='<'){
        return{
            acceptable:true,
            complete:true,
            changed:true,
        }
    }
}
function gt(vim,cmd,arg){
    if(cmd=='')
        return{acceptable:true}
    if(cmd=='>'){
        let
            a=vim._cursor.lineStart,
            b=vim._cursor.lineEnd
        vim._text=
            vim._text.substring(0,a)+
            '\t'+
            vim._text.substring(a,b)+
            vim._text.substring(b)
        return{
            acceptable:true,
            complete:true,
            changed:true,
        }
    }
}
function dot(vim,cmd,arg){
    return{
        acceptable:true,
        complete:true,
    }
}
function colon(vim){
    vim.mode='cmdline'
    vim._modeData.inputBuffer=':'
    return{acceptable:true}
}
function slash(vim){
    vim.mode='cmdline'
    vim._modeData.inputBuffer='/'
    return{acceptable:true}
}
function ctrl(vim,cmd){
    if(cmd=='')
        return{
            acceptable:true,
        }
    if(cmd=='r'){
        if(vim._undoBranchManager.current.next!=undefined){
            vim._undoBranchManager.current=
                vim._undoBranchManager.current.next
            vim._text=vim._undoBranchManager.current.text
        }
        return{
            acceptable:true,
            complete:true,
        }
    }
}
let commands={
    A,D,G,I,O,P,X,
    a,d,g,h,i,j,k,l,n,o,p,r,u,v,x,y,
    '<':lt,
    '>':gt,
    '.':dot,
    ':':colon,
    '/':slash,
}
commands[String.fromCharCode(17)]=ctrl
commands
