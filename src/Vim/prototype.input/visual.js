Promise.all([
    module.shareImport('../visualRange.js'),
    module.shareImport('shift.js'),
]).then(modules=>{
    let
        visualRange=modules[0],
        shift=modules[1]
    function main(vim,val){
        if(typeof val=='string'){
            if(val=='d'){
                let
                    r=visualRange(vim),
                    a=vim._text.substring(0,r.s),
                    b=vim._text.substring(r.s,r.e),
                    c=vim._text.substring(r.e)
                vim._text=a+c
                vim.register={mode:'string',string:b}
                vim.mode='normal'
                return
            }
            if(val=='h')
                return vim._cursor.moveLeft()
            if(val=='j')
                return vim._cursor.moveDown()
            if(val=='k')
                return vim._cursor.moveUp()
            if(val=='l')
                return vim._cursor.moveRight()
            if(val=='y'){
                let r=visualRange(vim)
                vim.register={
                    mode:'string',
                    string:vim._text.substring(r.s,r.e),
                }
                vim.mode='normal'
                return
            }
            if(val=='<'){
                let r=visualRange(vim)
                let cursor=vim._cursor.clone
                cursor.moveTo(r.s)
                let s=cursor.r
                cursor.moveTo(r.e)
                let e=cursor.r
                shift.left(vim,s,e+1)
                vim.mode='normal'
                return
            }
            if(val=='>'){
                let r=visualRange(vim)
                let cursor=vim._cursor.clone
                cursor.moveTo(r.s)
                let s=cursor.r
                cursor.moveTo(r.e)
                let e=cursor.r
                shift.right(vim,s,e+1)
                vim.mode='normal'
                return
            }
        }else if(typeof val=='object'){
            if(
                val.key=='Escape'||
                val.ctrlKey&&val.key=='c'||
                val.ctrlKey&&val.key=='['
            )
                return vim.mode='normal'
        }
        /*if(vim.command==='<'){
            vim.command_vlt()
            vim.command=''
        }else if(vim.command==='>'){
            vim.command_vgt()
            vim.command=''
        }*/
    }
    return(vim,val)=>{
        main(vim,val)
        vim._view()
    }
})
/*
Vim.prototype.command_vlt=function(){
    this.mode='normal'
    this.unindent(
        lineNumberOf(
            this.textarea.value,
            this.textarea.selectionStart
        ),
        lineNumberOf(
            this.textarea.value,
            this.textarea.selectionEnd-1
        )+1
    )
}
Vim.prototype.command_vgt=function(count){
    let selectionStart=this.textarea.selectionStart
    this.mode='normal'
    this.indent(
        lineNumberOf(
            this.textarea.value,
            this.textarea.selectionStart
        ),
        lineNumberOf(
            this.textarea.value,
            this.textarea.selectionEnd-1
        )+1
    )
    let lineHead=
        getLineHeadByCursor(this.textarea.value,selectionStart)
    this.textarea.selectionStart=lineHead
    this.textarea.selectionEnd=lineHead+1
}
// begin 2015-09-07
function linesOf(text){
*/
/*
    A line should not include EOL,
    since it has already been seperated from the others.
*/
/*
    let result=text.split('\n')
    result.pop()
    return result
}
function lineNumberOf(text,cursor){
    return text.substring(0,cursor).split('\n').length-1
}
// end 2015-09-07
// begin 2015-09-06
function getLineStartByCursor(text,cursor){
    return text.substring(0,cursor).lastIndexOf('\n')+1
}
function getLineEndByCursor(text,cursor){
    return text.indexOf('\n',cursor)+1
}
function getLineHeadByCursor(text,cursor){
    var lineStart=getLineStartByCursor(text,cursor)
    return lineStart+text.substring(lineStart).search(/[^ ]/)
}
// end 2015-09-06
*/
