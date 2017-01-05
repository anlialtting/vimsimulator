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
        arg=arg||vim._cursor._countOfRows
        arg=Math.min(vim._cursor._countOfRows,arg)
        vim._cursor.moveTo(vim._cursor.line(arg-1))
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
        let c=vim._cursor.abs
        vim.text=vim.text.substring(0,c)+'\n'+vim.text.substring(c)
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
            vim.text=
                vim.text.substring(0,vim._cursor.line(vim._cursor.r))+
                vim.text.substring(vim._cursor.line(vim._cursor.r+1))
            vim._cursor.moveTo(vim._cursor.lineStart)
            return{
                acceptable:true,
                complete:true,
                changed:true,
            }
        }
    }
/*
    function dd(count){
        count=count||1
        let f=this.textarea.selectionStart
        let l=this.textarea.selectionStart
        f=getLineStartByCursor(this.textarea.value,f)
        for(let i=0;i<count;i++)
            l=getLineEndByCursor(this.textarea.value,l)
        this.yank(1,this.textarea.value.substring(f,l))
        this.textarea.value
            =this.textarea.value.substring(0,f)
            +this.textarea.value.substring(
                l,this.textarea.value.length
            )
        if(f<this.textarea.value.length)
            this.textarea.selectionStart=this.textarea.selectionEnd=f
        else{
            this.textarea.selectionStart=this.textarea.selectionEnd=
                getLineStartByCursor(
                    this.textarea.value,
                    this.textarea.value.length-1
                )
        }
    }
*/
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
        while(arg--)
            vim._cursor.moveDown()
        return{
            acceptable:true,
            complete:true,
        }
    }
    function k(vim,cmd,arg){
        arg=arg||1
        while(arg--)
            vim._cursor.moveUp()
        return{
            acceptable:true,
            complete:true,
        }
    }
    function l(vim,cmd,arg){
        arg=arg||1
        while(arg--)
            vim._cursor.moveRight()
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
        let c=vim._cursor.abs
        vim.text=vim.text.substring(0,c)+'\n'+vim.text.substring(c)
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
