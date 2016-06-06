/*
http://www.truth.sk/vim/vimbook-OPL.pdf
*/
let CryptoJS=module.arguments.CryptoJS||module.extract('https://cdn.rawgit.com/sytelus/CryptoJS/7fbfbbee0d005b31746bc5858c70c359e98308e5/rollups/aes.js','CryptoJS',{lazy:true})
module=module.share({CryptoJS})
Promise.all([
    module.shareImport('cursorMoves.js'),
    module.shareImport('JsonFormatter.js'),
    module.shareImport('commands.js'),
    module.shareImport('Vim.prototype.update.js'),
    CryptoJS,
    module.shareImport('textarea_onkeydown.js'),
    module.shareImport('runCommandIfPossible.js'),
]).then(modules=>{
let
    cursorMoves=modules[0],
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
    this._text=''
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
Object.defineProperty(Vim.prototype,'text',{
    set(val){
        this._text=val
    },
    get(){
        return this._text
    }
})
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
    let lines=linesOf(this.textarea.value)
    for(
        let currentLine=beginLine;
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
Vim.prototype.cursorMovesLeft=cursorMoves.left
Vim.prototype.cursorMovesRight=cursorMoves.right
Vim.prototype.cursorMovesUp=cursorMoves.up
Vim.prototype.cursorMovesDown=cursorMoves.down
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
