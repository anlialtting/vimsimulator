/*
    Table of Contents
        * _pureFunctions
*/
/*
http://www.truth.sk/vim/vimbook-OPL.pdf
*/
Promise.all([
    module.import('cppstl.js'),
    module.import('JsonFormatter.js',{CryptoJS}),
    module.import('commands.js',{CryptoJS}),
    module.import('Vim.prototype.update.js'),
]).then(modules=>{
let
    cppstl=modules[0],
    JsonFormatter=modules[1],
    commands=modules[2]
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
        var nxtStart=getLineEndByCursor(this.textarea.value,p)
        var nxtEnd=getLineEndByCursor(this.textarea.value,nxtStart)
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
Vim.prototype.runCommandIfPossibleForMode2=function(){
    if(this.command==='d'){
        this.command_vd()
        this.command=''
    }else if(this.command==='y'){
        this.command_vy()
        this.command=''
    }else if(this.command==='<'){
        this.command_vlt()
        this.command=''
    }else if(this.command==='>'){
        this.command_vgt()
        this.command=''
    }
}
Vim.prototype.runCommandIfPossible=function(){
    if(this.mode===2){
        this.runCommandIfPossibleForMode2()
    }
    //
    var cmd=this.command
    var argument
    if(48<=cmd.charCodeAt(0)&&cmd.charCodeAt(0)<58)
        (()=>{
            var i
            i=0
            argument=0
            while(48<=cmd.charCodeAt(i)&&cmd.charCodeAt(i)<58){
                argument=10*argument+(cmd.charCodeAt(i)-48)
                i++
            }
            cmd=cmd.substring(i,cmd.length)
        })()
    ;(vim=>{
        let result=tryCommand(vim)
        if(result.matched){
            if(result.changed)
                vim.lastChangingCommand=
                    vim.command
            vim.command=''
        }
    })(this)
    //
    if(this.command[0]===':'){
        for(let i=1;i<this.command.length;i++){
            if(this.command[i]==='q')
                this.activated=false
            if(this.command[i]==='w'){
                this.write()
            }
        }
        this.command=''
    }
    if(this.command[0]==='/'){
        this.searchPattern=this.command.substring(1)
        this.gotoNextMatch()
        this.command=''
    }
    function tryCommand(vim){
        var result={}
        if(cmd==='A'){
            vim.command_A(argument)
            result.matched=true
        }
        if(cmd==='D'){
            vim.command_D(argument)
            result.matched=true
        }
        if(cmd==='G'){
            vim.command_G(argument)
            result.matched=true
        }
        if(cmd==='I'){
            vim.command_I(argument)
            result.matched=true
        }
        if(cmd==='O'){
            vim.command_O(argument)
            result.matched=true
            result.changed=true
        }
        if(cmd==='P'){
            vim.command_P(argument)
            result.matched=true
            result.changed=true
        }
        if(cmd==='X'){
            vim.command_X(argument)
            result.matched=true
            result.changed=true
        }
        if(cmd==='a'){
            var i=vim.textarea.selectionStart
            if(i+1<vim.textarea.value.length)
                i++
            vim.textarea.selectionStart=
            vim.textarea.selectionEnd=i
            vim.mode=1
            result.matched=true
        }
        if(cmd==='h'){
            vim.command_h(argument)
            result.matched=true
        }
        if(cmd==='i'){
            vim.mode=1
            vim.textarea.selectionEnd=vim.textarea.selectionStart
            result.matched=true
        }
        if(cmd==='j'){
            vim.command_j(argument)
            result.matched=true
        }
        if(cmd==='k'){
            vim.command_k(argument)
            result.matched=true
        }
        if(cmd==='l'){
            vim.command_l(argument)
            result.matched=true
        }
        if(cmd==='n'){
            vim.gotoNextMatch()
            result.matched=true
        }
        if(cmd==='o'){
            vim.command_o(argument)
            result.matched=true
            result.changed=true
        }
        if(cmd==='p'){
            vim.command_p(argument)
            result.matched=true
            result.changed=true
        }
        if(cmd[0]==='r'&&cmd.length===2){
            vim.command_r(argument,cmd[1])
            result.matched=true
            result.changed=true
        }
        if(cmd==='u'){
            vim.command_u(argument)
            result.matched=true
        }
        if(cmd==='v'){
            vim.mode=2
            vim.visualmode.fixedCursor=vim.textarea.selectionStart
            result.matched=true
        }
        if(cmd==='x'){
            vim.command_x(argument)
            result.matched=true
            result.changed=true
        }
        if(cmd==='dd'){
            vim.command_dd(argument)
            result.matched=true
            result.changed=true
        }
        if(cmd==='gg'){
            vim.command_gg(argument)
            result.matched=true
        }
        if(cmd==='yy'){
            vim.command_yy(argument)
            result.matched=true
        }
        if(cmd==='<<'){
            vim.command_ltlt(argument)
            result.matched=true
            result.changed=true
        }
        if(cmd==='>>'){
            vim.command_gtgt(argument)
            result.matched=true
            result.changed=true
        }
        if(cmd==='.'){
            if(vim.lastChangingCommand){
                vim.command=vim.lastChangingCommand
                vim.runCommandIfPossible()
            }
            result.matched=true
        }
        return result
    }
}
Vim.prototype.gotoNextMatch=function(){
    var selectionEnd
    selectionEnd=this.textarea.selectionEnd
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
// begin _pureFunctions
function count_rows_string(countOfColsPerRow,string){
    var
        width,
        row_currentLine=0,
        col_currentRow=0,
        i
    for(i=0;i<string.length;i++){
        if(string[i]==='\t'){
            width=8-col_currentRow%8
        }else if(string.charCodeAt(i)<0xff){
            width=1
        }else
            width=2
        if(col_currentRow+width>countOfColsPerRow){
            row_currentLine++
            col_currentRow=0
        }
        col_currentRow+=width
    }
    return row_currentLine+1
}
function textarea_onkeydown(vim,e){
    var value_toreturn
    if(
        e.ctrlKey&&e.shiftKey&&e.keyCode===86
    ){ // ctrl+shift+v
        vim.activated=!vim.activated
        vim.col_cursor=
            vim.textarea.selectionStart-getLineStartByCursor(
                vim.textarea.value,
                vim.textarea.selectionStart
            )
        value_toreturn=false
    }else if(!vim.activated){
        value_toreturn=true
    }else if(
        e.keyCode===27||e.ctrlKey&&e.keyCode===67
    ){ // esc or ctrl+c
        vim.mode=0
        vim.command=''
        vim.update()
        value_toreturn=false
    }else if(
        e.ctrlKey&&e.keyCode===86
    ){ // ctrl+v
        value_toreturn=true
    }else if(vim.mode===0){
        value_toreturn=textarea_onkeydown_mode_0(vim,e)
    }else if(vim.mode===1){
        value_toreturn=textarea_onkeydown_mode_1(vim,e)
    }else if(vim.mode===2){
        value_toreturn=textarea_onkeydown_mode_2(vim,e)
    }else{
        value_toreturn=true
    }
    if(value_toreturn)
        return value_toreturn
    vim.afterkeydown_textarea()
    vim.update()
    return value_toreturn
}
function textarea_onkeydown_mode_0(vim,e){
    var
        value_toreturn
    if(isLongCommand())
        if(!e.shiftKey)
            longCommand()
        else
            longCommandShift()
    else
        if(!e.shiftKey)
            shortCommand()
        else
            shortCommandShift()
    if(isLongCommand()){
        // testing funciton 2015-09-06
        /*setTimeout(function(){
            vim.input_commandline.focus()
        },0)*/
    }else
        vim.runCommandIfPossible()
    if(value_toreturn===false){
        e.preventDefault()
        e.stopPropagation()
    }
    return value_toreturn
    function isLongCommand(){
        return 0<vim.command.length&&(
            vim.command[0]===':'||
            vim.command[0]==='/'||
            vim.command[0]==='!'
        )
    }
    function shortCommand(){
        if(e.keyCode===8){ // backspace
            value_toreturn=false
            vim.textarea.selectionStart=vim.textarea.selectionEnd=
                vim.textarea.selectionStart?
                    vim.textarea.selectionStart-1
                :
                    vim.textarea.selectionStart
        }else if(e.keyCode===13){ // enter
            value_toreturn=false
            if(
                vim.textarea.value.substring(
                    0,vim.textarea.selectionStart
                ).split('\n').length-1
                    !=vim.textarea.value.split('\n').length-1-1
            ){
                vim.textarea.selectionStart=
                vim.textarea.selectionEnd=getLineEndByCursor(
                    vim.textarea.value,
                    vim.textarea.selectionStart
                )
            }
        }else if(e.keyCode===32){ // space for chrome and safari
            value_toreturn=false
            vim.command+=' '
        }else if(e.keyCode===35){ // end
            value_toreturn=false
            vim.textarea.selectionStart=
                getLineEndByCursor(
                    vim.textarea.value,
                    vim.textarea.selectionStart
                )-1
            vim.textarea.selectionEnd=vim.textarea.selectionStart+1
        }else if(e.keyCode===36){ // home
            value_toreturn=false
            vim.textarea.selectionStart=getLineStartByCursor(
                vim.textarea.value,
                vim.textarea.selectionStart
            )
            vim.textarea.selectionEnd=vim.textarea.selectionStart+1
        }else if(e.keyCode===37){ // left arrow
            value_toreturn=false
            vim.cursorMovesLeft()
        }else if(e.keyCode===38){ // up arrow
            value_toreturn=false
            vim.cursorMovesUp()
        }else if(e.keyCode===39){ // right arrow
            value_toreturn=false
            vim.cursorMovesRight()
        }else if(e.keyCode===40){ // down arrow
            value_toreturn=false
            vim.cursorMovesDown()
        }else if(e.keyCode===46){ // delete
            value_toreturn=false
            var p=vim.textarea.selectionStart
            vim.textarea.value=vim.textarea.value.substring(0,p)+
                vim.textarea.value.substring(
                    p+1,vim.textarea.value.length
                )
            vim.textarea.selectionStart=p
            vim.textarea.selectionEnd=p+1
        }else if(48<=e.keyCode&&e.keyCode<58){ // 0-9
            value_toreturn=false
            vim.command+=
                String.fromCharCode(e.keyCode)
        }else if(e.keyCode===59||e.keyCode===186){
            /*
             * 59: ';' for firefox and opera
             * 186: ';' for chrome and safari
             */
            value_toreturn=false
            vim.command+=';'
        }else if(65<=e.keyCode&&e.keyCode<91){ // a-z
            value_toreturn=false
            vim.command+=
                String.fromCharCode(e.keyCode+32)
        }else if(e.keyCode===190){ // .
            value_toreturn=false
            vim.command+='.'
        }else if(e.keyCode===191){ // /
            value_toreturn=false
            vim.command+='/'
        }else{
            value_toreturn=true
        }
    }
    function shortCommandShift(){
        if(e.keyCode===49){ // !
            value_toreturn=false
            vim.command+='!'
        }else if(e.keyCode===52){ // $
            value_toreturn=false
            vim.textarea.selectionStart=
                getLineEndByCursor(
                    vim.textarea.value,
                    vim.textarea.selectionStart
                )-1
            vim.textarea.selectionEnd=vim.textarea.selectionStart+1
        }else if(e.keyCode===54){ // ^
            value_toreturn=false
            !function(){
                var lineHead
                lineHead=getLineHeadByCursor(
                    vim.textarea.value,
                    vim.textarea.selectionStart
                )
                vim.textarea.selectionStart=lineHead
                vim.textarea.selectionEnd=lineHead+1
            }()
        }else if(e.keyCode===59||e.keyCode===186){
            /*
             * 59: ':' for firefox and opera
             * 186: ':' for chrome and safari
             */
            value_toreturn=false
            vim.command+=':'
        }else if(65<=e.keyCode&&e.keyCode<91){ // A-Z
            value_toreturn=false
            vim.command+=
                String.fromCharCode(e.keyCode)
        }else if(e.keyCode===188){ // <
            value_toreturn=false
            vim.command+='<'
        }else if(e.keyCode===190){ // >
            value_toreturn=false
            vim.command+='>'
        }else{
            value_toreturn=true
        }
    }
    function longCommand(){
        if(e.keyCode===8){ // backspace
            value_toreturn=false
            vim.command
                =vim.command.substring(
                    0,
                    vim.command.length-1
                )
        }else if(e.keyCode===13){ // enter
            value_toreturn=false
            vim.runCommandIfPossible()
        }else if(e.keyCode===32){ // space
            value_toreturn=false
            vim.command+=' '
        }else if(48<=e.keyCode&&e.keyCode<58){ // 0-9
            value_toreturn=false
            vim.command+=
                String.fromCharCode(e.keyCode)
        }else if(65<=e.keyCode&&e.keyCode<91){ // a-z
            value_toreturn=false
            vim.command+=
                String.fromCharCode(e.keyCode+32)
        }else if(96<=e.keyCode&&e.keyCode<106){ // 0-9
            value_toreturn=false
            vim.command+=
                String.fromCharCode(e.keyCode-48)
        }else if(e.keyCode===186){ // ;
            value_toreturn=false
            vim.command+=';'
        }else if(e.keyCode===187){ // =
            value_toreturn=false
            vim.command+='='
        }else if(e.keyCode===188){ // ,
            value_toreturn=false
            vim.command+=','
        }else if(e.keyCode===189){ // -
            value_toreturn=false
            vim.command+='-'
        }else if(e.keyCode===190){ // .
            value_toreturn=false
            vim.command+='.'
        }else if(e.keyCode===191){ // /
            value_toreturn=false
            vim.command+='/'
        }else if(e.keyCode===220){ // \
            value_toreturn=false
            vim.command+='\\'
        }else{
            value_toreturn=false
        }
    }
    function longCommandShift(){
        if(e.keyCode===48){ // )
            value_toreturn=false
            vim.command+=')'
        }else if(e.keyCode===49){ // !
            value_toreturn=false
            vim.command+='!'
        }else if(e.keyCode===50){ // @
            value_toreturn=false
            vim.command+='@'
        }else if(e.keyCode===51){ // #
            value_toreturn=false
            vim.command+='#'
        }else if(e.keyCode===52){ // $
            value_toreturn=false
            vim.command+='$'
        }else if(e.keyCode===53){ // %
            value_toreturn=false
            vim.command+='%'
        }else if(e.keyCode===54){ // ^
            value_toreturn=false
            vim.command+='^'
        }else if(e.keyCode===55){ // &
            value_toreturn=false
            vim.command+='&'
        }else if(e.keyCode===56){ // *
            value_toreturn=false
            vim.command+='*'
        }else if(e.keyCode===57){ // (
            value_toreturn=false
            vim.command+='('
        }else if(65<=e.keyCode&&e.keyCode<91){ // A-Z
            value_toreturn=false
            vim.command+=
                String.fromCharCode(e.keyCode)
        }else if(e.keyCode===188){ // <
            value_toreturn=false
            vim.command+='<'
        }
    }
}
function textarea_onkeydown_mode_1(vim,e){
    var value_toreturn
    if(e.keyCode===9){ // tab
        var
            f=vim.textarea.selectionStart,
            l=vim.textarea.selectionEnd,
            stringToInsert
        stringToInsert=
// It should be tab '\t' by Vim default.
                '    '
        vim.textarea.value=
            vim.textarea.value.substring(0,f)+
            stringToInsert+
            vim.textarea.value.substring(l,vim.textarea.value.length)
        vim.textarea.selectionStart=
        vim.textarea.selectionEnd=
            f+stringToInsert.length
        value_toreturn=false
    }else if(e.keyCode===35){ // end
        value_toreturn=false
        vim.textarea.selectionStart=
            getLineEndByCursor(
                vim.textarea.value,
                vim.textarea.selectionStart
            )-1
        vim.textarea.selectionEnd=vim.textarea.selectionStart
    }else if(e.keyCode===36){ // home
        value_toreturn=false
        vim.textarea.selectionStart=getLineStartByCursor(
            vim.textarea.value,
            vim.textarea.selectionStart
        )
        vim.textarea.selectionEnd=vim.textarea.selectionStart
    }else if(e.keyCode===37){ // left arrow
        value_toreturn=false
        vim.cursorMovesLeft()
    }else if(e.keyCode===38){ // up arrow
        value_toreturn=false
        vim.cursorMovesUp()
    }else if(e.keyCode===39){ // right arrow
        value_toreturn=false
        vim.cursorMovesRight()
    }else if(e.keyCode===40){ // down arrow
        value_toreturn=false
        vim.cursorMovesDown()
    }
    return value_toreturn
}
function textarea_onkeydown_mode_2(vim,e){
    var value_toreturn
    if(e.keyCode===37){ // left arrow
        value_toreturn=false
        vim.cursorMovesLeft()
    }else if(e.keyCode===38){ // up arrow
        value_toreturn=false
        vim.cursorMovesUp()
    }else if(e.keyCode===39){ // right arrow
        value_toreturn=false
        vim.cursorMovesRight()
    }else if(e.keyCode===40){ // down arrow
        value_toreturn=false
        vim.cursorMovesDown()
    }else if(65<=e.keyCode&&e.keyCode<91){ // a-z
        value_toreturn=false
        vim.command+=
            String.fromCharCode(e.keyCode+32)
    }else if(e.keyCode===188){ // <
        value_toreturn=false
        vim.command+='<'
    }else if(e.keyCode===190){ // >
        value_toreturn=false
        vim.command+='>'
    }
    vim.runCommandIfPossible()
    return value_toreturn
}
// end _pureFunctions
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
