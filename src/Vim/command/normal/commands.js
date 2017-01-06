function A(vim){
    if(vim.text){
        vim._cursor.moveToEOL()
    }
    vim.mode='insert'
    return{
        acceptable:true,
        complete:true,
    }
}
function D(vim,cmd,arg){
    if(vim.text){
        let
            a=vim._cursor.abs,
            b=vim._cursor.lineEnd-1
        vim.register={
            mode:'string',
            string:vim.text.substring(a,b),
        }
        vim.text=
            vim.text.substring(0,a)+
            vim.text.substring(b)
    }
    return{
        acceptable:true,
        complete:true,
    }
}
function G(vim,cmd,arg){
    if(vim.text){
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
    if(vim.text){
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
    vim.text||(vim.text='\n')
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
    if(!vim.register)
        return{
            acceptable:true,
            complete:true,
        }
    vim.text||(vim.text='\n')
    if(vim.register.mode=='string'){
        let c=vim._cursor.abs
        vim.text=
            vim.text.substring(0,c)+
            vim.register.string+
            vim.text.substring(c)
        vim._cursor.moveTo(c+vim.register.string.length-1)
    }else if(vim.register.mode=='line'){
        let c=vim._cursor.lineStart
        vim.text=
            vim.text.substring(0,c)+
            vim.register.string+
            vim.text.substring(c)
        vim._cursor.moveTo(vim._cursor.lineStart)
    }
    return{
        acceptable:true,
        complete:true,
        changed:true,
    }
}
function X(vim,cmd,arg){
    vim.text||(vim.text='\n')
    vim.text=
        vim.text.substring(0,vim._cursor.abs-1)+
        vim.text.substring(vim._cursor.abs)
    vim._cursor.moveTo(vim._cursor.abs-1)
    return{
        acceptable:true,
        complete:true,
        changed:true,
    }
}
function a(vim,cmd,arg){
    vim.mode='insert'
    if(vim.text)
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
        if(vim.text){
            arg=arg||1
            arg=Math.min(vim._cursor._countOfRows-vim._cursor.r,arg)
            let
                a=vim._cursor.line(vim._cursor.r),
                b=vim._cursor.line(vim._cursor.r+arg)
            vim.register={
                mode:'line',
                string:vim.text.substring(a,b),
            }
            vim.text=
                vim.text.substring(0,a)+
                vim.text.substring(b)
            if(vim.text)
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
        if(vim.text){
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
    if(vim.text)
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
    if(vim.text)
        while(arg--)
            vim._cursor.moveDown()
    return{
        acceptable:true,
        complete:true,
    }
}
function k(vim,cmd,arg){
    arg=arg||1
    if(vim.text)
        while(arg--)
            vim._cursor.moveUp()
    return{
        acceptable:true,
        complete:true,
    }
}
function l(vim,cmd,arg){
    arg=arg||1
    if(vim.text)
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
    vim.text||(vim.text='\n')
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
    if(!vim.register)
        return{
            acceptable:true,
            complete:true,
        }
    vim.text||(vim.text='\n')
    if(vim.register.mode=='string'){
        let c=vim._cursor.abs
        vim.text=
            vim.text.substring(0,c+1)+
            vim.register.string+
            vim.text.substring(c+1)
        vim._cursor.moveTo(c+vim.register.string.length)
    }else if(vim.register.mode=='line'){
        let c=vim._cursor.lineEnd
        vim.text=
            vim.text.substring(0,c)+
            vim.register.string+
            vim.text.substring(c)
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
    if(vim.text){
        vim.text=
            vim.text.substring(0,vim._cursor.abs)+
            cmd+
            vim.text.substring(vim._cursor.abs+1)
    }
    return{
        acceptable:true,
        complete:true,
        changed:true,
    }
}
function u(vim,cmd,arg){
    /*
    var c=this.textarea.selectionStart
    this.textarea.value=
        this.histories[this.histories.length-1]
    while(
        0<=this.histories.length-1&&
        this.histories[this.histories.length-1]===
        this.textarea.value
    )
        this.histories.pop()
    if(0<=this.histories.length-1)
        this.textarea.value=this.histories[this.histories.length-1]
    this.textarea.selectionStart=c
    */
    return{
        acceptable:true,
        complete:true,
        changed:true,
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
    if(vim.text){
        vim.text=
            vim.text.substring(0,vim._cursor.abs)+
            vim.text.substring(vim._cursor.abs+1)
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
function colon(vim){
    vim.mode='cmdline'
    return{
        acceptable:true,
    }
}
({
    A,D,G,I,O,P,X,a,d,g,h,i,j,k,l,n,o,p,r,u,v,x,y,
    '<':lt,
    '>':gt,
    '.':dot,
    ':':colon,
})
/*
Vim.prototype.command_yy=function(count){
    count=count||1
    let
        f=this.textarea.selectionStart,
        l=this.textarea.selectionStart
    f=getLineStartByCursor(this.textarea.value,f)
    for(var i=0;i<count;i++)
        l=getLineEndByCursor(this.textarea.value,l)
    this.yank(1,this.textarea.value.substring(f,l))
}
Vim.prototype.command_ltlt=function(count){
    count=count||1
    let lineNumber=
        lineNumberOf(
            this.textarea.value,
            this.textarea.selectionStart
        )
    this.unindent(lineNumber,lineNumber+count)
}
Vim.prototype.command_gtgt=function(count){
    count=count||1
    let start_currentLine_textarea=getLineStartByCursor(
        this.textarea.value,
        this.textarea.selectionStart
    )
    let lineNumber=
        lineNumberOf(this.textarea.value,this.textarea.selectionStart)
    let lines=linesOf(this.textarea.value)
    for(let i=0;i<count;i++)
        lines[lineNumber+i]=
            '    '+lines[lineNumber+i]
    this.textarea.value=lines.join('\n')
    this.textarea.selectionStart=
        start_currentLine_textarea+
        this.textarea.value.substring(
            start_currentLine_textarea
        ).search(/[^ ]/)
    function linesOf(text){
        let result=text.split('\n')
        result.pop()
        return result
    }
    function lineNumberOf(text,cursor){
        return text.substring(0,cursor).split('\n').length-1
    }
}
*/
