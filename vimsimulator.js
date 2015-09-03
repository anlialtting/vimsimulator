/*
http://www.truth.sk/vim/vimbook-OPL.pdf
*/
!function(){
var JsonFormatter
window.Vim=Vim
function Vim(){
}
Vim.prototype.setup=function(
    textarea,
    count_rows_toshow,
    count_cols_toshow
){
    // start input
    this.textarea=textarea
    this.count_rows_toshow=count_rows_toshow||24
    this.count_cols_toshow=count_cols_toshow||80
    // end input
    this.password=''
    this.textfile=''
/*
http://en.wikibooks.org/wiki/Learning_the_vi_Editor/Vim/Modes
0: normal
1: insert
2: visual
3: select
*/
    this.mode=0
    this.command=''
    this.activated=false
    this.col_cursor=
        this.textarea.selectionStart-start_currentLine(
            this.textarea.selectionStart,
            this.textarea
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
    this.afterinput_textarea=function(){}
    this.afterkeydown_textarea=function(){}
    this.afterkeyup_textarea=function(){}
    this.write=function(){}
    setupTextarea(this)
    function setupTextarea(vim){
        vim.textarea.onclick=function(){
            vim.update()
        }
        vim.textarea.onkeydown=function(e){
            var x
            x=textarea_onkeydown(vim,e)
            if(x===false)
                e.preventDefault()
            return x
        }
        vim.textarea.onkeyup=function(){
            vim.afterkeyup_textarea()
        }
        vim.textarea.oninput=function(){
            vim.afterinput_textarea()
            vim.update()
        }
        vim.textarea.onblur=function(){
            vim.update()
        }
        vim.textarea.onfocus=function(){
            vim.update()
        }
    }
}
Vim.prototype.setupPassword=function(password){
    this.password=password
}
Vim.prototype.command_A=function(count){
    var i=this.textarea.selectionStart
    while(
        i+1<=this.textarea.value.length&&
        this.textarea.value[i]!=='\n'
    )
    i++
    this.textarea.selectionStart=
    this.textarea.selectionEnd=i
    this.mode=1
}
Vim.prototype.command_D=function(count){
    var selectionStart
    selectionStart=
        this.textarea.selectionStart
    this.textarea.value=
        this.textarea.value.substring(
            0,
            this.textarea.selectionStart
        )+this.textarea.value.substring(
            this.textarea.selectionStart+
                this.textarea.value.substring(this.textarea.selectionStart).search('\n')
        )
    this.textarea.selectionStart=
        0<=selectionStart-1&&this.textarea.value[selectionStart-1]!=='\n'?
            selectionStart-1
        :
            selectionStart
}
Vim.prototype.command_G=function(count){
    var
        c,
        i
    if(count===undefined)
        count=
            this.textarea.value.split('\n').length-1-1
    else
        count--
    c=0
    for(i=0;i<count;i++)
        c=end_currentLine(c,this.textarea)
    this.textarea.selectionStart=
    this.textarea.selectionEnd=c
}
Vim.prototype.command_P=function(count){
    count=count||1
    this.pasteBoard=JSON.parse(
        CryptoJS.AES.decrypt(
            localStorage.getItem('pasteBoard_vimontheweb'),
            this.password,
            {format:JsonFormatter}
        ).toString(CryptoJS.enc.Utf8)
    )
    if(this.pasteBoard.type===0){
        var c=this.textarea.selectionStart
        this.textarea.value=
            this.textarea.value.substring(0,c)+
            this.pasteBoard.content+
            this.textarea.value.substring(
                c,this.textarea.value.length
            )
        this.textarea.selectionStart=
            c+this.pasteBoard.content.length-1
    }else if(this.pasteBoard.type==1){
        var c=this.textarea.selectionStart
        c=start_currentLine(c,this.textarea)
        var s=this.textarea.value.substring(0,c)
        for(var i=0;i<count;i++)
            s+=this.pasteBoard.content
        s+=
            this.textarea.value.substring(
                c,this.textarea.value.length
            )
        this.textarea.value=s
        this.textarea.selectionStart=
        this.textarea.selectionEnd=c
    }
}
Vim.prototype.command_dd=function(count){
    count=count||1
    var
        f=this.textarea.selectionStart,
        l=this.textarea.selectionStart,
        i
    f=start_currentLine(f,this.textarea)
    for(i=0;i<count;i++)
        l=end_currentLine(l,this.textarea)
    this.yank(1,this.textarea.value.substring(f,l))
    this.textarea.value
}
Vim.prototype.command_h=function(count){
    count=count||1
    while(count--)
        this.cursorMovesLeft()
}
Vim.prototype.command_j=function(count){
    count=count||1
    while(count--)
        this.cursorMovesDown()
}
Vim.prototype.command_k=function(count){
    count=count||1
    while(count--)
        this.cursorMovesUp()
}
Vim.prototype.command_l=function(count){
    count=count||1
    while(count--)
        this.cursorMovesRight()
}
Vim.prototype.command_p=function(count){
    count=count||1
    this.pasteBoard=JSON.parse(
        CryptoJS.AES.decrypt(
            localStorage.getItem('pasteBoard_vimontheweb'),
            this.password,
            {format:JsonFormatter}
        ).toString(CryptoJS.enc.Utf8)
    )
    if(this.pasteBoard.type===0){
        var c=this.textarea.selectionStart+1
        this.textarea.value=
            this.textarea.value.substring(0,c)
            +this.pasteBoard.content
            +this.textarea.value.substring(
                c,this.textarea.value.length
            )
        this.textarea.selectionStart=
            c+this.pasteBoard.content.length-1
    }else if(this.pasteBoard.type===1){
        var first_nextLine=end_currentLine(
            this.textarea.selectionStart,this.textarea
        )
        var s=this.textarea.value.substring(0,first_nextLine)
        while(count--)
            s+=this.pasteBoard.content
        s+=this.textarea.value.substring(
            first_nextLine,this.textarea.value.length
        )
        this.textarea.value=s
        this.textarea.selectionStart=
            this.textarea.selectionEnd=
            first_nextLine
    }
}
Vim.prototype.command_r=function(count,string){
    var c=this.textarea.selectionStart
    count=count||1
    this.textarea.value=
        this.textarea.value.substring(0,c)
        +string.repeat(count)
        +this.textarea.value.substring(
            c+count,this.textarea.value.length
        )
    this.textarea.selectionStart=c+count-1
}
Vim.prototype.command_u=function(){
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
}
Vim.prototype.command_dd=function(count){
    var
        f,
        l,
        i
    count=count||1
    f=this.textarea.selectionStart
    l=this.textarea.selectionStart
    f=start_currentLine(f,this.textarea)
    for(i=0;i<count;i++)
        l=end_currentLine(l,this.textarea)
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
            start_currentLine(
                this.textarea.value.length-1,
                this.textarea
            )
    }
}
Vim.prototype.command_gg=function(count){
    var
        c=0
    count=count===undefined?0:count-1
    while(count--)
        c=end_currentLine(c,this.textarea)
    this.textarea.selectionStart=
        this.textarea.selectionEnd=c
}
Vim.prototype.command_vy=function(){
    var f=this.textarea.selectionStart,
        l=this.textarea.selectionEnd
    this.yank(
        0,
        this.textarea.value.substring(f,l)
    )
    this.mode=0
}
Vim.prototype.command_vd=function(){
    var f=this.textarea.selectionStart,
        l=this.textarea.selectionEnd
    this.yank(0,this.textarea.value.substring(f,l))
    this.textarea.value=
        this.textarea.value.substring(0,f)
        +this.textarea.value.substring(l,this.textarea.length)
    this.textarea.selectionStart=f
    this.mode=0
}
Vim.prototype.command_yy=function(count){
    count=count||1
    var f=this.textarea.selectionStart,
        l=this.textarea.selectionStart
    f=start_currentLine(f,this.textarea)
    for(var i=0;i<count;i++)
        l=end_currentLine(l,this.textarea)
    this.yank(1,this.textarea.value.substring(f,l))
}
Vim.prototype.command_ltlt=function(count){
    var f
    count=count||1
    f=this.textarea.selectionStart
    f=start_currentLine(f,this.textarea)
    this.textarea.value=
        this.textarea.value.substring(0,f)+
        this.textarea.value.substring(
            f+4,this.textarea.value.length
        )
    this.textarea.selectionStart=
        f+this.textarea.value.substring(f).search(/[^ ]/)
}
Vim.prototype.command_gtgt=function(count){
    count=count||1
    var f=this.textarea.selectionStart
    f=start_currentLine(f,this.textarea)
    this.textarea.value=
        this.textarea.value.substring(0,f)+
        '    '+
        this.textarea.value.substring(
            f,this.textarea.value.length
        )
    this.textarea.selectionStart=
        f+this.textarea.value.substring(f).search(/[^ ]/)
}
Vim.prototype.command_vlt=function(count){
    count=count||1
    var f=this.textarea.selectionStart,
        l=this.textarea.selectionEnd
    f=start_currentLine(f,this.textarea)
    l=end_currentLine(l,this.textarea)
    var nextSelection=f
    var output=this.textarea.value.substring(0,f)
    while(f!=l){
        var p=end_currentLine(f,this.textarea)
        output+=this.textarea.value.substring(f+4,p)
        f=p
    }
    output+=
        this.textarea.value.substring(
            f,this.textarea.value.length
        )
    this.textarea.value=output
    this.textarea.selectionStart=nextSelection
    this.textarea.selectionEnd=nextSelection+1
}
Vim.prototype.command_vgt=function(count){
    count=count||1
    var f=this.textarea.selectionStart,
        l=this.textarea.selectionEnd
    f=start_currentLine(f,this.textarea)
    l=end_currentLine(l,this.textarea)
    var nextSelection=f
    var output=this.textarea.value.substring(0,f)
    while(f!=l){
        var p=end_currentLine(f,this.textarea)
        output+='    '+this.textarea.value.substring(f,p)
        f=p
    }
    output+=this.textarea.value.substring(
        f,this.textarea.value.length
    )
    this.textarea.value=output
    this.textarea.selectionStart=nextSelection
    this.textarea.selectionEnd=nextSelection+1
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
        var p=this.textarea.selectionStart
        var start=start_currentLine(p,this.textarea)
        if(0<=p-1&&this.textarea.value[p-1]!='\n')
            this.textarea.selectionStart=
                this.textarea.selectionEnd=p-1
        this.col_cursor=this.textarea.selectionStart-start
    }else if(this.mode===2){
        if(this.visualmode.fixedCursor+1<this.textarea.selectionEnd){
            var p=this.textarea.selectionEnd
            p--
            this.textarea.selectionEnd=p
        }else{
            var p=this.textarea.selectionStart
            p--
            this.textarea.selectionStart=p
        }
    }
}
Vim.prototype.cursorMovesRight=function(){
    if(this.mode===0||this.mode===1){
        var p=this.textarea.selectionStart
        var start=start_currentLine(p,this.textarea)
        if(
            p+1<this.textarea.value.length&&(this.mode===0
                ?this.textarea.value[p+1]!=='\n'
                :this.textarea.value[p]!=='\n')
        )
            this.textarea.selectionStart=
                this.textarea.selectionEnd=
                this.textarea.selectionStart+1
        this.col_cursor=this.textarea.selectionStart-start
    }else if(this.mode===2){
        if(this.textarea.selectionStart<this.visualmode.fixedCursor){
            var p=this.textarea.selectionStart
            p++
            this.textarea.selectionStart=p
        }else{
            var p=this.textarea.selectionEnd
            p++
            this.textarea.selectionEnd=p
        }
    }
}
Vim.prototype.cursorMovesUp=function(){
    // do nothing if current line is the first line
    if(
        this.textarea.value.substring(
            0,this.textarea.selectionStart
        ).split('\n').length-1==0
    )
        return
    if(
        this.mode===0||
        this.mode===1
    ){
        var p=this.textarea.selectionStart
        var start=start_currentLine(p,this.textarea)
        var end=end_currentLine(p,this.textarea)
        var preEnd=start
        var preStart=start_currentLine(preEnd-1,this.textarea)
        this.textarea.selectionStart=
            this.textarea.selectionEnd=
                preStart+Math.min(
                    preEnd-1-preStart,
                    this.col_cursor
                )
    }else if(this.mode===2){
        var p
        if(
            this.visualmode.fixedCursor!==
            this.textarea.selectionStart
        )
            p=this.textarea.selectionStart
        else
            p=this.textarea.selectionEnd
        var preEnd=start_currentLine(p,this.textarea)
        var preStart=start_currentLine(preEnd-1,this.textarea)
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
    if(this.mode===0||this.mode===1){
        var p=this.textarea.selectionStart
        var start=start_currentLine(p,this.textarea)
        var end=end_currentLine(p,this.textarea)
        var nxtStart=end
        var nxtEnd=end_currentLine(nxtStart,this.textarea)
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
        var nxtStart=end_currentLine(p,this.textarea)
        var nxtEnd=end_currentLine(nxtStart,this.textarea)
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
}
Vim.prototype.runCommandIfPossible=function(){
    if(this.mode===2){
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
    //
    var cmd=this.command
    var argument
    if(48<=cmd.charCodeAt(0)&&cmd.charCodeAt(0)<58){
        var i=0
        argument=0
        while(48<=cmd.charCodeAt(i)&&cmd.charCodeAt(i)<58){
            argument=10*argument+(cmd.charCodeAt(i)-48)
            i++
        }
        cmd=cmd.substring(i,cmd.length)
    }
    if(cmd==='A'){
        this.command_A(argument)
        this.command=''
    }
    if(cmd==='D'){
        this.command_D(argument)
        this.command=''
    }
    if(cmd==='G'){
        this.command_G(argument)
        this.command=''
    }
    if(cmd==='P'){
        this.command_P(argument)
        this.command=''
    }
    if(cmd==='h'){
        this.command_h(argument)
        this.command=''
    }
    if(cmd==='j'){
        this.command_j(argument)
        this.command=''
    }
    if(cmd==='k'){
        this.command_k(argument)
        this.command=''
    }
    if(cmd==='l'){
        this.command_l(argument)
        this.command=''
    }
    if(cmd==='p'){
        this.command_p(argument)
        this.command=''
    }
    if(cmd[0]==='r'&&cmd.length===2){
        this.command_r(argument,cmd[1])
        this.command=''
    }
    if(cmd==='u'){
        this.command_u(argument)
        this.command=''
    }
    if(cmd==='dd'){
        this.command_dd(argument)
        this.command=''
    }
    if(cmd==='gg'){
        this.command_gg(argument)
        this.command=''
    }
    if(cmd==='yy'){
        this.command_yy(argument)
        this.command=''
    }
    if(cmd==='<<'){
        this.command_ltlt(argument)
        this.command=''
    }
    if(cmd==='>>'){
        this.command_gtgt(argument)
        this.command=''
    }
    //
    if(this.command==='I'){
        var i=this.textarea.selectionEnd
        while(0<=i-1&&this.textarea.value[i-1]!='\n')
            i--
        this.textarea.selectionStart=
        this.textarea.selectionEnd=i
        this.mode=1
        this.command=''
    }
    if(this.command==='O'){
        this.mode=1
        var p=start_currentLine(this.textarea.selectionStart,this.textarea)
        this.textarea.value=this.textarea.value.substring(0,p)
            +'\n'+this.textarea.value.substring(p,this.textarea.value.length)
        this.textarea.selectionStart=this.textarea.selectionEnd=p
        this.command=''
    }
    if(this.command==='a'){ // a
        var i=this.textarea.selectionStart
        if(i+1<this.textarea.value.length)
            i++
        this.textarea.selectionStart=this.textarea.selectionEnd=i
        this.mode=1
        this.command=''
    }
    if(this.command==='i'){
        this.mode=1
        this.textarea.selectionEnd=this.textarea.selectionStart
        this.command=''
    }
    if(this.command==='v'){
        this.mode=2
        this.visualmode.fixedCursor=this.textarea.selectionStart
        this.command=''
    }
    if(this.command==='n'){
        this.gotoNextMatch()
        this.command=''
    }
    if(this.command==='o'){
        this.mode=1
        var p=end_currentLine(
            this.textarea.selectionStart,
            this.textarea
        )
        this.textarea.value=
            this.textarea.value.substring(0,p)+
            '\n'+
            this.textarea.value.substring(
                p,this.textarea.value.length
            )
        this.textarea.selectionStart=this.textarea.selectionEnd=p
        this.command=''
    }
    if(this.command[0]===':'){
        for(var i=1;i<this.command.length;i++){
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
}
Vim.prototype.gotoNextMatch=function(){
    var selectionEnd=this.textarea.selectionEnd
    this.textarea.selectionStart=
    this.textarea.selectionEnd=
        this.textarea.value.substring(selectionEnd).search(
            new RegExp(this.searchPattern)
        )+selectionEnd
}
Vim.prototype.update=function(){
    var
        countOfColsPerRow,
        countOfColsForPaddingForLineNumber
    countOfColsForPaddingForLineNumber=4
    countOfColsPerRow=
        this.count_cols_toshow-
        countOfColsForPaddingForLineNumber
    if(
        this.histories.length===0||
        this.histories[this.histories.length-1]!==this.textarea.value
    ){
        this.histories.push(this.textarea.value)
        if(100<this.histories.length)
            this.histories.shift()
    }
    if(this.activated){
        if(!this.div_editor){
            this.div_editor=create_div_editor(this)
            document.body.appendChild(this.div_editor)
        }
        if(!this.pre_editor){
            this.pre_editor=create_pre_editor(this)
            document.body.appendChild(this.pre_editor)
        }
    }
    if(!this.activated){
        if(this.div_editor&&this.pre_editor){
            this.div_editor.style.display='none'
            this.pre_editor.style.display='none'
        }
        return
    }
    this.div_editor.style.display='block'
    this.pre_editor.style.display='block'
    // eol correction
    if(this.textarea.value[this.textarea.value.length-1]!=='\n')
        !function(vim){
            var
                selectionStart,
                selectionEnd
            selectionStart=vim.textarea.selectionStart
            selectionEnd=vim.textarea.selectionEnd
            vim.textarea.value+='\n'
            vim.textarea.selectionStart=selectionStart
            vim.textarea.selectionEnd=selectionEnd
        }(this)
    // end eol correction
    // selection correction
    if(this.mode===0){
        if(
            0<=this.textarea.selectionStart-1&&(
                this.textarea.selectionStart===this.textarea.value.length||
                this.textarea.value[this.textarea.selectionStart]==='\n'&&
                this.textarea.value[this.textarea.selectionStart-1]!=='\n'
            )
        ){
            this.textarea.selectionStart--
        }
        //if(t.selectionEnd!==t.selectionStart+1)
        this.textarea.selectionEnd=
            this.textarea.selectionStart+1
    }else if(this.mode===1){ // insert mode
    }
    // end correction
    var lineNumber_select=calculate_lineNumber_select.bind(this)()
    lineCursorCatchingUp(this)
    var output=''
    var text=this.textarea.value
    var
        cursor=this.textarea.selectionStart,
        cursor_end=this.textarea.selectionEnd
    var lines=linesOf(text)
    var length_lines=calculate_length_lines()
    var partialsum_length_lines=calculate_partialsum_length_lines()
    var lineNumber_cursor=
        cppstl.upper_bound(partialsum_length_lines,cursor)-1
    var lineNumber_cursor_end=
        cppstl.upper_bound(partialsum_length_lines,cursor_end)-1
    var charNumber_cursor=
        cursor-partialsum_length_lines[lineNumber_cursor]
    var charNumber_cursor_end=
        cursor_end-partialsum_length_lines[lineNumber_cursor_end]
    var count_rows_showed=0
    var currentLine='',row_currentLine=0,col_currentRow=0
    do_outputAll.bind(this)()
    function calculate_lineNumber_select(){
        return this.textarea.value.substring(
            0,
            cursor(this)
        ).split('\n').length-1
        function cursor(vim){
            if(vim.mode===0||vim.mode===1)
                return vim.textarea.selectionStart
            return vim.textarea.selectionStart<vim.visualmode.fixedCursor?
                vim.textarea.selectionStart
            :
                vim.textarea.selectionEnd-1
        }
    }
    function do_outputAll(){
        output_contents.bind(this)()
        output_nullLines.bind(this)()
        output_commandLine(this)
        do_output(calculate_s())
        this.pre_editor.innerHTML=output
    }
    function output_contents(){
        var toEndCursorSpan=false
        var isActiveElement=this.textarea===document.activeElement
        var lineNumber=this.lineCursor,charNumber=0
        if(cursor<partialsum_length_lines[this.lineCursor]){
            currentLine+=
                '<span style="background-color:'+
                this.style.color+';color:'+
                this.style.backgroundColor+';">'
            toEndCursorSpan=true
        }
        while(lineNumber<lines.length){
            var i=partialsum_length_lines[lineNumber]+charNumber
            var string_toshow_currentCharacter=
                text[i]==='\n'
                    ?(this.mode===1||0<=i-1&&text[i-1]==='\n'?' ':'')
                    :text[i]
            var width_string_toshow_currentCharacter=
                string_toshow_currentCharacter===''?0:
                string_toshow_currentCharacter.charCodeAt(0)<0xff?1:2
            if(
                this.count_cols_toshow<(
                    this.environment.number?
                        countOfColsForPaddingForLineNumber
                    :
                        0
                )+
                col_currentRow+
                width_string_toshow_currentCharacter
            ){
                currentLine+='\n'
                row_currentLine++
                col_currentRow=0
            }
            if(this.environment.number){
                if(col_currentRow===0){
                    var count_cols_lineNumber=countOfColsForPaddingForLineNumber
                    if(row_currentLine===0){
                        var s=(lineNumber+1).toString()
                        for(var j=0;j<count_cols_lineNumber-s.length-1;j++)
                            currentLine+=' '
                        currentLine+=
                            '<span style="color:lawngreen;">'+
                                s+
                            '</span>';
                        currentLine+=' '
                    }else{
                        for(var j=0;j<count_cols_lineNumber;j++)
                            currentLine+=' '
                    }
                }
            }
            if(isActiveElement){
                if(i===cursor){
                    currentLine+=
                        '<span style="background-color:'+
                        this.style.color+';color:'+
                        this.style.backgroundColor+';">'
                    toEndCursorSpan=true
                }
            }
            if(text[i]==='\n'){
                if(
                    this.environment.list||
                    this.mode===1||
                    0<=i-1&&text[i-1]
                ){ // eol showing
                    currentLine+='<span style="'+this.stylesheet_eol+'">'
                    if(this.environment.list)
                        currentLine+='$'
                    else
                        currentLine+=' '
                    currentLine+='</span>'
                }
                currentLine+='\n'
                row_currentLine++
                col_currentRow=0
            }else if(text[i]==='\t'){
                currentLine+=text[i]
                charNumber++
                col_currentRow=
                    Math.floor((col_currentRow+8)/8)*8
            }else{
                var html_toshow
                if(text[i]==='<'){
                    html_toshow='&lt;'
                }else if(text[i]==='>'){
                    html_toshow='&gt;'
                }else if(text[i]==='&'){
                    html_toshow='&amp;'
                }else{
                    html_toshow=text[i]
                }
                if(
                    !this.highlighter||
                    '!@#$%^&*()-=[]{},.;<>?:\'"\\/'.indexOf(text[i])==-1
                )
                    currentLine+=html_toshow
                else
                    currentLine+=
                        '<span style="color:deeppink;">'+
                            html_toshow+
                        '</span>'
                charNumber++
                col_currentRow+=width_string_toshow_currentCharacter
            }
            if(isActiveElement){
                if(this.mode===0){
                    // normal mode
                    if(i+1===cursor_end){
                        toEndCursorSpan=false
                        currentLine+='</span>'
                    }
                }else if(this.mode===1||this.mode===2){
                    // insert mode or visual mode
                    if(cursor===cursor_end
                            ?i+1==cursor_end+1
                            :i+1==cursor_end){
                        toEndCursorSpan=false
                        currentLine+='</span>'
                    }
                }else if(this.mode===2){
                    if(i+1===cursor_end){
                        toEndCursorSpan=false
                        currentLine+='</span>'
                    }
                }
            }
            if(text[i]==='\n'){
                if(this.lineCursor<=lineNumber){
                    if(this.count_rows_toshow-1
                            <count_rows_showed+row_currentLine){
                        break
                    }
                    output+=currentLine
                    count_rows_showed+=row_currentLine
                }
                currentLine=''
                charNumber=0
                row_currentLine=0
                col_currentRow=0
                lineNumber++
            }
        } // for(var lineNumber=this.lineCursor,charNumber=0;lineNumber<lines.length
        if(toEndCursorSpan){
            toEndCursorSpan=false
            output+='</span>'
        }
    }
    function output_nullLines(){
        while(count_rows_showed<this.count_rows_toshow-1){
            output+='~\n'
            count_rows_showed++
        }
    }
    function output_commandLine(vim){
        if(vim.mode==0){
            var s=vim.command
            if(50<s.length)
                s=s.substring(s.length-50,s.length)
            if(vim.command[0]===':'||vim.command[0]==='/'){
                output+=s
            }else{
                output+='<span style="color:gray;">'+s+'</span>'
            }
            col_currentRow+=s.length
        }else if(vim.mode==1){
            output+='-- INSERT --'
            col_currentRow+='-- INSERT --'.length
        }else if(vim.mode==2){
            output+='-- VISUAL --'
            col_currentRow+='-- VISUAL --'.length
        }
    }
    function do_output(s){
        output+=s
        col_currentRow+=s.length
    }
    function calculate_s(){
        var s
        while(col_currentRow<60){
            output+=' '
            col_currentRow++
        }
        s=(lineNumber_cursor+1)+','+(charNumber_cursor+1)
        output+=s
        col_currentRow+=s.length
        while(col_currentRow<countOfColsPerRow){
            output+=' '
            col_currentRow++
        }
        s=Math.floor(100*lineNumber_cursor/lines.length)+'%'
        return s
    }
    function lineCursorCatchingUp(vim){
        var partialSum_rowsCount_lines
        !function(){
            var i
            partialSum_rowsCount_lines=
                vim.textarea.value.split('\n')
            for(i in partialSum_rowsCount_lines)
                partialSum_rowsCount_lines[i]=
                    count_rows_string(
                        countOfColsPerRow,partialSum_rowsCount_lines[i]
                    )
            for(i=1;i<partialSum_rowsCount_lines.length;i++)
                partialSum_rowsCount_lines[i]+=partialSum_rowsCount_lines[i-1]
            partialSum_rowsCount_lines.unshift(0)
        }()
        var lower=lineNumber_select,upper=lineNumber_select
        while(
            0<=lower-1&&
                partialSum_rowsCount_lines[lineNumber_select+1]-
                    partialSum_rowsCount_lines[lower-1]
                <=
                vim.count_rows_toshow-1
        )
            lower--
        vim.lineCursor=Math.max(vim.lineCursor,lower)
        vim.lineCursor=Math.min(vim.lineCursor,upper)
    }
    function linesOf(text){
        var lines=text.split('\n')
        lines.pop()
        lines.forEach(function(e,i){
            lines[i]+='\n'
        })
        return lines
    }
    function calculate_length_lines(){
        var length_lines=new Array(lines.length)
        lines.forEach(function(e,i){
            length_lines[i]=lines[i].length
        })
        return length_lines
    }
    function calculate_partialsum_length_lines(){
        var partialsum_length_lines=[0]
        partialsum_length_lines.push.apply(
            partialsum_length_lines,
            cppstl.partial_sum(length_lines)
        )
        return partialsum_length_lines
    }
}
Vim.prototype.update_pre_editor=function(){
    this.pre_editor.style.backgroundColor=this.style.backgroundColor
    this.pre_editor.style.color=this.style.color
}
var cppstl={}
cppstl.lower_bound=function(array,key){
    var first=0,last=array.length
    while(first!=last){
        var median=Math.floor((first+last)/2)
        if(array[median]<key)
            first=median+1
        else
            last=median
    }
    return first
}
cppstl.upper_bound=function(array,key){
    var first=0,last=array.length,median
    while(first!=last){
        median=Math.floor((first+last)/2)
        if(array[median]<=key)
            first=median+1
        else
            last=median
    }
    return first
}
cppstl.partial_sum=function(input){
    var output,i
    output=input.slice(0)
    for(i=1;i<output.length;i++)
        output[i]+=output[i-1]
    return output
}
String.prototype.repeat=function(num){
    return new Array(num+1).join(this)
}
JsonFormatter={
    stringify:function(cipherParams){
        var jsonObj={
            ct:cipherParams.ciphertext.toString(CryptoJS.enc.Base64)
        }
        if(cipherParams.iv){
            jsonObj.iv = cipherParams.iv.toString()
        }
        if(cipherParams.salt) {
            jsonObj.s = cipherParams.salt.toString()
        }
        return JSON.stringify(jsonObj)
    },
    parse:function(jsonStr){
        var jsonObj=JSON.parse(jsonStr)
        var cipherParams=CryptoJS.lib.CipherParams.create({
            ciphertext:CryptoJS.enc.Base64.parse(jsonObj.ct)
        })
        if(jsonObj.iv){
            cipherParams.iv=CryptoJS.enc.Hex.parse(jsonObj.iv)
        }
        if(jsonObj.s) {
            cipherParams.salt=CryptoJS.enc.Hex.parse(jsonObj.s)
        }
        return cipherParams
    }
}
function start_currentLine(p,textarea){
    while(0<=p-1&&textarea.value[p-1]!='\n')
        p--
    return p
}
function end_currentLine(p,textarea){
    while(p+1<textarea.value.length&&textarea.value[p]!='\n')
        p++
    return p+1
}
function lineNumber(position,string){
    return string.substring(0,position).split('\n').length-1
}
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
            vim.textarea.selectionStart-start_currentLine(
                vim.textarea.selectionStart,
                vim.textarea
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
    }else if(vim.mode==2){
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
    var value_toreturn
    if(
        0<vim.command.length&&(
            vim.command[0]===':'||
            vim.command[0]==='/'
        )
    ){
        if(e.shiftKey){
            if(e.keyCode==48){ // )
                value_toreturn=false
                vim.command+=')'
            }else if(e.keyCode==49){ // !
                value_toreturn=false
                vim.command+='!'
            }else if(e.keyCode==50){ // @
                value_toreturn=false
                vim.command+='@'
            }else if(e.keyCode==51){ // #
                value_toreturn=false
                vim.command+='#'
            }else if(e.keyCode==52){ // $
                value_toreturn=false
                vim.command+='$'
            }else if(e.keyCode==53){ // %
                value_toreturn=false
                vim.command+='%'
            }else if(e.keyCode==54){ // ^
                value_toreturn=false
                vim.command+='^'
            }else if(e.keyCode==55){ // &
                value_toreturn=false
                vim.command+='&'
            }else if(e.keyCode==56){ // *
                value_toreturn=false
                vim.command+='*'
            }else if(e.keyCode==57){ // (
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
        }else{
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
            }else if(48<=e.keyCode&&e.keyCode<58){ // 0-9
                value_toreturn=false
                vim.command+=
                    String.fromCharCode(e.keyCode)
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
            }else if(e.keyCode===220){ // \
                value_toreturn=false
                vim.command+='\\'
            }else{
                value_toreturn=false
            }
        }
    }else if(e.shiftKey){
        if(e.keyCode===49){ // !
            value_toreturn=false
            vim.command+='!'
        }else if(e.keyCode===52){ // $
            value_toreturn=false
            vim.textarea.selectionStart=
                end_currentLine(
                    vim.textarea.selectionStart,vim.textarea
                )-1
            vim.textarea.selectionEnd=vim.textarea.selectionStart+1
        }else if(e.keyCode===54){ // ^
            value_toreturn=false
            vim.textarea.selectionStart=start_currentLine(
                vim.textarea.selectionStart,vim.textarea
            )
            vim.textarea.selectionEnd=vim.textarea.selectionStart+1
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
    }else{
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
                vim.textarea.selectionEnd=end_currentLine(
                    vim.textarea.selectionStart,vim.textarea
                )
            }
        }else if(e.keyCode===32){ // space for chrome and safari
            value_toreturn=false
            vim.command+=' '
        }else if(e.keyCode===35){ // end
            value_toreturn=false
            vim.textarea.selectionStart=
                end_currentLine(
                    vim.textarea.selectionStart,vim.textarea
                )-1
            vim.textarea.selectionEnd=vim.textarea.selectionStart+1
        }else if(e.keyCode===36){ // home
            value_toreturn=false
            vim.textarea.selectionStart=start_currentLine(
                vim.textarea.selectionStart,vim.textarea
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
        }else if(48<=e.keyCode&&e.keyCode<58){
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
        }else if(e.keyCode===191){ // /
            value_toreturn=false
            vim.command+='/'
        }else{
            value_toreturn=true
        }
    }
    if(0<vim.command.length&&(
            vim.command[0]===':'||
            vim.command[0]==='/'
        )
    ){
    }else{
        vim.runCommandIfPossible()
    }
    return value_toreturn
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
            end_currentLine(
                vim.textarea.selectionStart,vim.textarea
            )-1
        vim.textarea.selectionEnd=vim.textarea.selectionStart
    }else if(e.keyCode===36){ // home
        value_toreturn=false
        vim.textarea.selectionStart=start_currentLine(
            vim.textarea.selectionStart,
            vim.textarea
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
function create_div_editor(vim){
    var div_editor
    div_editor=document.createElement('pre')
    div_editor.vim=vim
    // centering
    div_editor.style.position='fixed'
    div_editor.style.left='50%'
    div_editor.style.marginLeft=
        ''+-(vim.count_cols_toshow*6)/2+'pt'
    div_editor.style.top='50%'
    div_editor.style.marginTop=
        ''+-(vim.count_rows_toshow*12)/2+'pt'
    // end centering
    div_editor.style.display='none'
    div_editor.style.background=vim.style.backgroundColor
    div_editor.style.height=''+vim.count_rows_toshow*12+'pt'
    div_editor.style.width=''+vim.count_cols_toshow*6+'pt'
    return div_editor
}
function create_pre_editor(vim){
    var pre_editor
    pre_editor=document.createElement('pre')
    pre_editor.vim=vim
    pre_editor.onmousedown=function(e){
        e.preventDefault()
        e.stopPropagation()
    }
    pre_editor.onmouseup=function(e){
        e.preventDefault()
        e.stopPropagation()
    }
    pre_editor.onclick=function(e){
        if(
            vim.textarea!==document.activeElement
        )
            focusWithoutChangingSelection(vim.textarea)
        vim.update()
        e.preventDefault()
        e.stopPropagation()
        function focusWithoutChangingSelection(e){
            var
                selectionStart,
                selectionEnd
            selectionStart=e.selectionStart
            selectionEnd=e.selectionEnd
            e.focus()
            e.selectionStart=selectionStart
            e.selectionEnd=selectionEnd
        }
    }
    pre_editor.style.cursor='default'
    // centering
    pre_editor.style.position='fixed'
    pre_editor.style.left='50%'
    pre_editor.style.marginLeft=
        ''+-(vim.count_cols_toshow*6)/2+'pt'
    pre_editor.style.top='50%'
    pre_editor.style.marginTop=
        ''+-(vim.count_rows_toshow*12)/2+'pt'
    // end centering
    pre_editor.style.display='none'
    pre_editor.style.border='0px'
    //pre_editor.style.backgroundColor=style.backgroundColor
    pre_editor.style.color=vim.style.color
    pre_editor.style.height=vim.count_rows_toshow*12+'pt'
    pre_editor.style.width=vim.count_cols_toshow*6+'pt'
    pre_editor.style.lineHeight='12pt'
    pre_editor.style.letterSpacing='0pt'
    pre_editor.style.fontFamily=
        '\'WenQuanYi Zen Hei Mono\','+
        '\'Consolas\','+
        '\'Courier New\','+
        '\'Courier\','+
        'monospace'
    return pre_editor
}
function create_input_commandline(){
    var input
    input=document.createElement('input')
    return input
}
}()
