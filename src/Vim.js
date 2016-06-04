/*
http://www.truth.sk/vim/vimbook-OPL.pdf
*/
let CryptoJS=module.arguments.CryptoJS||module.extract('https://cdn.rawgit.com/sytelus/CryptoJS/7fbfbbee0d005b31746bc5858c70c359e98308e5/rollups/aes.js','CryptoJS',{lazy:true})
module=module.share({CryptoJS})
Promise.all([
    module.shareImport('cppstl.js'),
    module.shareImport('JsonFormatter.js'),
    module.shareImport('commands.js'),
    module.shareImport('Vim.prototype.update.js'),
    CryptoJS,
    module.shareImport('textarea_onkeydown.js'),
    module.shareImport('runCommandIfPossible.js'),
]).then(modules=>{
let
    cppstl=modules[0],
    JsonFormatter=modules[1],
    commands=modules[2],
    CryptoJS=modules[4],
    textarea_onkeydown=modules[5],
    runCommandIfPossible=modules[6]
commands(Vim)
function Vim(){
}
Vim.prototype.setup=function(
    textarea,
    count_rows_toshow,
    count_cols_toshow
){
    // begin input
    this.textarea=textarea
    this.count_rows_toshow=count_rows_toshow||24
    this.count_cols_toshow=count_cols_toshow||80
    // end input
    this.password=''
    this.textfile=''
/*
0: normal
1: insert
2: visual
3: select
References:
    http://en.wikibooks.org/wiki/Learning_the_vi_Editor/Vim/Modes
*/
    this.mode=0
    this.command=''
    this.activated=false
    this.col_cursor=
        this.textarea.selectionStart-getLineStartByCursor(
            this.textarea.value,
            this.textarea.selectionStart
        )
    this.lineCursor=0
    this.pasteBoard={
/*
0: string
1: lines
*/
        type:0,
        content:''
    }
    this.environment={
        list:true,
        number:true,
    }
    this.histories=[]
    this.highlighter=true
    this.visualmode={}
    this.visualmode.fixedCursor
    this.style={}
    this.style.backgroundColor='rgba(0%,0%,0%,0.8)'
    this.style.color='white'
    this.stylesheet_eol='color:dodgerblue;'
    this.afterinput_textarea=()=>{}
    this.afterkeydown_textarea=()=>{}
    this.afterkeyup_textarea=()=>{}
    this.write=()=>{}
    setupTextarea(this)
    function setupTextarea(vim){
        vim.textarea.onclick=()=>{
            vim.update()
        }
        vim.textarea.onkeydown=e=>{
            if(
                textarea_onkeydown(vim,e)===false
            ){
                e.preventDefault()
                e.stopPropagation()
            }
        }
        vim.textarea.onkeyup=()=>{
            vim.afterkeyup_textarea()
        }
        vim.textarea.oninput=()=>{
            vim.afterinput_textarea()
            vim.update()
        }
        vim.textarea.onblur=()=>{
            vim.update()
        }
        vim.textarea.onfocus=()=>{
            vim.update()
        }
    }
}
Vim.prototype.setupPassword=function(password){
    this.password=password
}
Vim.prototype.unindent=function(beginLine,endLine){
    let
        lines,
        currentLine
    lines=linesOf(this.textarea.value)
    for(
        currentLine=beginLine;
        currentLine!=endLine;
        currentLine++
    ){
        lines[currentLine]=
            unindent(lines[currentLine])
    }
    this.textarea.value=lines.join('\n')
    ;(vim=>{
        let sum=0
        for(let i=0;i<beginLine;i++)
            sum+=lines[i].length+1
        let lineHead=
            getLineHeadByCursor(vim.textarea.value,sum)
        vim.textarea.selectionStart=lineHead
        vim.textarea.selectionEnd=lineHead+1
    })(this)
    function unindent(s){
        return s.substring(
            Math.min(
                (s+'\n').search(/[^ ]/),
                4
            )
        )
    }
}
Vim.prototype.indent=function(beginLine,endLine){
    let
        lines,
        currentLine
    lines=linesOf(this.textarea.value)
    for(
        currentLine=beginLine;
        currentLine!=endLine;
        currentLine++
    ){
        lines[currentLine]=
            indent(lines[currentLine])
    }
    this.textarea.value=lines.join('\n')
    function indent(s){
        return'    '+s
    }
}
Vim.prototype.yank=function(type,content){
    this.pasteBoard.type=type
    this.pasteBoard.content=content
    localStorage.setItem(
        'pasteBoard_vimontheweb',
        CryptoJS.AES.encrypt(
            JSON.stringify(
                this.pasteBoard
            ),
            this.password,
            {format:JsonFormatter}
        )
    )
}
Vim.prototype.cursorMovesLeft=function(){
    if(this.mode===0||this.mode===1){
        let
            p=this.textarea.selectionStart,
            start=getLineStartByCursor(this.textarea.value,p)
        if(0<=p-1&&this.textarea.value[p-1]!='\n')
            this.textarea.selectionStart=
                this.textarea.selectionEnd=p-1
        this.col_cursor=this.textarea.selectionStart-start
    }else if(this.mode===2){
        if(this.visualmode.fixedCursor+1===this.textarea.selectionEnd){
            if(this.textarea.value[this.textarea.selectionStart-1]!=='\n')
                this.textarea.selectionStart=
                    this.textarea.selectionStart-1
        }else{
            if(this.textarea.value[this.textarea.selectionEnd-2]!=='\n')
                this.textarea.selectionEnd=this.textarea.selectionEnd-1
        }
    }
}
Vim.prototype.cursorMovesRight=function(){
    if(this.mode===0||this.mode===1){
        let
            p=this.textarea.selectionStart,
            start=getLineStartByCursor(this.textarea.value,p)
        if(
            p+1<this.textarea.value.length&&(
                this.mode===0?
                    this.textarea.value[p+1]!=='\n'
                :
                    this.textarea.value[p]!=='\n'
            )
        )
            this.textarea.selectionStart=
                this.textarea.selectionEnd=
                this.textarea.selectionStart+1
        this.col_cursor=this.textarea.selectionStart-start
    }else if(this.mode===2){
        if(this.textarea.selectionStart<this.visualmode.fixedCursor){
            if(this.textarea.value[this.textarea.selectionStart]!=='\n')
                this.textarea.selectionStart=
                    this.textarea.selectionStart+1
        }else{
            if(this.textarea.value[this.textarea.selectionEnd-1]!=='\n')
                this.textarea.selectionEnd=this.textarea.selectionEnd+1
        }
    }
}
Vim.prototype.cursorMovesUp=function(){
    if(
        this.mode===0||
        this.mode===1
    ){
        // do nothing if current line is the first line
        if(
            this.textarea.value.substring(
                0,this.textarea.selectionStart
            ).split('\n').length-1===0
        )
            return
        let
            p=this.textarea.selectionStart,
            start=getLineStartByCursor(this.textarea.value,p),
            end=getLineEndByCursor(this.textarea.value,p),
            preEnd=start,
            preStart=getLineStartByCursor(this.textarea.value,preEnd-1)
        this.textarea.selectionStart=
            this.textarea.selectionEnd=
                preStart+Math.min(
                    preEnd-1-preStart,
                    this.col_cursor
                )
    }else if(this.mode===2){
        let p
        if(
            this.visualmode.fixedCursor!==
            this.textarea.selectionStart
        )
            p=this.textarea.selectionStart
        else
            p=this.textarea.selectionEnd
        let
            preEnd=getLineStartByCursor(this.textarea.value,p),
            preStart=getLineStartByCursor(this.textarea.value,preEnd-1)
        p=preStart+Math.min(
            preEnd-1-preStart,
            this.col_cursor
        )
        if(p<this.visualmode.fixedCursor+1){
            this.textarea.selectionStart=p
            this.textarea.selectionEnd=this.visualmode.fixedCursor+1
        }else{
            this.textarea.selectionStart=this.visualmode.fixedCursor
            this.textarea.selectionEnd=p
        }
    }
}
Vim.prototype.cursorMovesDown=function(){
    if(this.mode===0||this.mode===1){
        // do nothing if current line is the last line
        if(
            this.textarea.value.substring(
                0,this.textarea.selectionStart
            ).split('\n').length-1==
            this.textarea.value.split(
                '\n'
            ).length-1-1
        )
            return
        let
            p=this.textarea.selectionStart,
            start=getLineStartByCursor(this.textarea.value,p),
            end=getLineEndByCursor(this.textarea.value,p),
            nxtStart=end,
            nxtEnd=getLineEndByCursor(this.textarea.value,nxtStart)
        this.textarea.selectionStart=
            this.textarea.selectionEnd=nxtStart+Math.min(
                nxtEnd-1-nxtStart,
                this.col_cursor
            )
    }else if(this.mode===2){
        if(
            this.visualmode.fixedCursor!==
            this.textarea.selectionStart
        )
            var p=this.textarea.selectionStart
        else
            var p=this.textarea.selectionEnd
        let
            nxtStart=getLineEndByCursor(this.textarea.value,p),
            nxtEnd=getLineEndByCursor(this.textarea.value,nxtStart)
        p=nxtStart+Math.min(
            nxtEnd-1-nxtStart,
            this.col_cursor
        )
        if(p<this.visualmode.fixedCursor+1){
            this.textarea.selectionStart=p
            this.textarea.selectionEnd=this.visualmode.fixedCursor+1
        }else{
            this.textarea.selectionStart=this.visualmode.fixedCursor
            this.textarea.selectionEnd=p
        }
    }
}
Vim.prototype.runCommandIfPossibleForMode2=
    runCommandIfPossible.runCommandIfPossibleForMode2
Vim.prototype.runCommandIfPossible=
    runCommandIfPossible.runCommandIfPossible
Vim.prototype.gotoNextMatch=function(){
    let selectionEnd=this.textarea.selectionEnd
    this.textarea.selectionStart=
    this.textarea.selectionEnd=
        this.textarea.value.substring(selectionEnd).search(
            new RegExp(this.searchPattern)
        )+selectionEnd
}
Vim.prototype.update=modules[3]
Vim.prototype.update_pre_editor=function(){
    this.pre_editor.style.backgroundColor=
        this.style.backgroundColor
    this.pre_editor.style.color=
        this.style.color
}
// begin 2015-09-07
function linesOf(text){
/*
    A line should not include EOL,
    since it has already been seperated from the others.
*/
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
    let lineStart=getLineStartByCursor(text,cursor)
    return lineStart+text.substring(lineStart).search(/[^ ]/)
}
// end 2015-09-06
module.export=Vim
})
