Promise.all([
    module.shareImport('lowercaseCommands.js'),
    module.shareImport('uppercaseCommands.js'),
]).then(modules=>{
    let
        lowercaseCommands=modules[0],
        uppercaseCommands=modules[1]
    return{
        A,D,G,I,O,P,X,a,d,g,h,i,j,k,l,n,o,p,r,u,v,x,y,
        '<':lt,
        '>':gt,
        '.':dot,
    }
    function A(vim){
        vim._cursor.moveToEOL()
        vim.mode='insert'
        return{
            acceptable:true,
            complete:true,
        }
    }
    function D(vim,cmd,arg){
        uppercaseCommands.D.call(vim,arg)
        return{
            acceptable:true,
            complete:true,
        }
    }
    function G(vim,cmd,arg){
        uppercaseCommands.G.call(vim,arg)
        return{
            acceptable:true,
            complete:true,
        }
    }
    function I(vim,cmd,arg){
        vim._cursor.moveTo(vim._cursor.lineStart)
        vim.mode='insert'
        return{
            acceptable:true,
            complete:true,
        }
    }
    function O(vim,cmd,arg){
        vim.mode='insert'
        vim._cursor.moveTo(vim._cursor.lineStart)
        vim.text=
            vim.text.substring(0,vim._cursor.abs)+
            '\n'+
            vim.text.substring(vim._cursor.abs)
        return{
            acceptable:true,
            complete:true,
            changed:true,
        }
    }
    function P(vim,cmd,arg){
        uppercaseCommands.P.call(vim,arg)
        return{
            acceptable:true,
            complete:true,
            changed:true,
        }
    }
    function X(vim,cmd,arg){
        uppercaseCommands.X.call(vim,arg)
        return{
            acceptable:true,
            complete:true,
            changed:true,
        }
    }
    function a(vim,cmd,arg){
        vim.mode='insert'
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
            lowercaseCommands.dd.call(vim,arg)
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
            lowercaseCommands.gg.call(vim,arg)
            return{
                acceptable:true,
                complete:true,
            }
        }
    }
    function h(vim,cmd,arg){
        lowercaseCommands.h.call(vim,arg)
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
        lowercaseCommands.j.call(vim,arg)
        return{
            acceptable:true,
            complete:true,
        }
    }
    function k(vim,cmd,arg){
        lowercaseCommands.k.call(vim,arg)
        return{
            acceptable:true,
            complete:true,
        }
    }
    function l(vim,cmd,arg){
        lowercaseCommands.l.call(vim,arg)
        return{
            acceptable:true,
            complete:true,
        }
    }
    function n(vim,cmd,arg){
        vim.gotoNextMatch()
        return{
            acceptable:true,
            complete:true,
        }
    }
    function o(vim,cmd,arg){
        vim.mode='insert'
        vim._cursor.moveTo(vim._cursor.lineEnd)
        vim.text=
            vim.text.substring(0,vim._cursor.abs)+
            '\n'+
            vim.text.substring(vim._cursor.abs)
        return{
            acceptable:true,
            complete:true,
            changed:true,
        }
    }
    function p(vim,cmd,arg){
        lowercaseCommands.p.call(vim,arg)
        return{
            acceptable:true,
            complete:true,
            changed:true,
        }
    }
    function r(vim,cmd,arg){
        lowercaseCommands.r.call(vim,arg)
        return{
            acceptable:true,
            complete:true,
            changed:true,
        }
    }
    function u(vim,cmd,arg){
        lowercaseCommands.u.call(vim,arg)
        return{
            acceptable:true,
            complete:true,
            changed:true,
        }
    }
    function v(vim,cmd,arg){
        vim.mode='visual'
        vim.visualmode.fixedCursor=vim.selectionStart
        return{
            acceptable:true,
            complete:true,
        }
    }
    function x(vim,cmd,arg){
        lowercaseCommands.x.call(vim,arg)
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
            lowercaseCommands.yy.call(vim,arg)
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
            vim.command_ltlt(arg)
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
            vim.command_gtgt(arg)
            return{
                acceptable:true,
                complete:true,
                changed:true,
            }
        }
    }
    function dot(vim,cmd,arg){
        if(vim.lastChangingCommand)
            vim.command=vim.lastChangingCommand
        return{
            acceptable:true,
            complete:true,
        }
    }
})
