/*
http://www.truth.sk/vim/vimbook-OPL.pdf
*/
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
};
cppstl.upper_bound=function(array,key){
    var first=0,last=array.length
    while(first!=last){
        var median=Math.floor((first+last)/2)
        if(array[median]<=key)
            first=median+1
        else
            last=median
    }
    return first
}
cppstl.partial_sum=function(input){
    var output=input.slice(0)
    for(var i=1;i<output.length;i++)
        output[i]+=output[i-1]
    return output
}
String.prototype.repeat=function(num){
    return new Array(num+1).join(this)
}
var start_currentLine=function(p,textarea){
    while(0<=p-1&&textarea.value[p-1]!='\n')
        p--
    return p
}
var end_currentLine=function(p,textarea){
    while(p+1<textarea.value.length&&textarea.value[p]!='\n')
        p++
    return p+1
}
var lineNumber=function(position,string){
    return string.substring(0,position).split('\n').length-1
}
function count_rows_string(string){
    var row_currentLine=0,col_currentRow=0
    for(var i=0;i<string.length;i++){
        if(string[i]=='\t'){
            width=8-col_currentRow%8
        }else if(string.charCodeAt(i)<0xff){
            width=1
        }else
            width=2
        if(col_currentRow+width>80){
            row_currentLine++
            col_currentRow=0
        }
        col_currentRow+=width
    }
    return row_currentLine+1
}
function Vimsimulator(
    textarea,
    count_rows_toshow,
    count_cols_toshow
){
    this.textarea=textarea
    this.textfile=''
    this.count_rows_toshow=count_rows_toshow
    this.count_cols_toshow=count_cols_toshow
    this.mode=0
    /*
     * http://en.wikibooks.org/wiki/Learning_the_vi_Editor/Vim/Modes
     * 0: normal
     * 1: insert
     * 2: visual
     * 3: select
     */
    this.command=''
    this.actived=false
    this.lineCursor=0
    this.pasteBoard={}
    this.pasteBoard.type=0
    /*
     * 0: string
     * 1: lines
     */
    this.pasteBoard.content=''
    this.environment={}
    this.environment.list=true
    this.environment.number=true
    this.histories=[]
    this.highlighter=true
    this.visualmode={}
    this.visualmode.fixedCursor
    this.style={}
    this.style.backgroundColor='rgba(0%,0%,0%,0.8)'
    this.style.color='white'
    this.stylesheet_eol='color:blue;'
    this.afterinput_textarea=function(){}
    this.afterkeydown_textarea=function(){}
    this.afterkeyup_textarea=function(){}
    this.write=function(){}
    this.command_G=function(count){
        if(typeof count==='undefined')
            count=this.textarea.value.split('\n').length-1-1
        else
            count--
        var c=0
        for(var i=0;i<count;i++)
            c=end_currentLine(c,this.textarea)
        this.textarea.selectionStart=this.textarea.selectionEnd=c
    };
    this.command_P=function(count){
        count=count||1
        if(this.pasteBoard.type===0){
            var c=this.textarea.selectionStart
            this.textarea.value=
                this.textarea.value.substring(0,c)
                +this.pasteBoard.content
                +this.textarea.value.substring(c,this.textarea.value.length)
            this.textarea.selectionStart=c+this.pasteBoard.content.length-1
        }else if(this.pasteBoard.type==1){
            var c=this.textarea.selectionStart
            c=start_currentLine(c,this.textarea)
            var s=this.textarea.value.substring(0,c)
            for(var i=0;i<count;i++)
                s+=this.pasteBoard.content;
            s+=this.textarea.value.substring(c,this.textarea.value.length);
            this.textarea.value=s;
            this.textarea.selectionStart=this.textarea.selectionEnd=c;
        }
    };
    this.command_dd=function(count){
        count=count||1
        var
            f=this.textarea.selectionStart,
            l=this.textarea.selectionStart
        f=start_currentLine(f,this.textarea)
        for(var i=0;i<count;i++)
            l=end_currentLine(l,this.textarea)
        this.yank(1,this.textarea.value.substring(f,l))
        this.textarea.value
    }
    this.command_h=function(count){
        count=count||1
        for(var i=0;i<count;i++)
            this.cursorMovesLeft()
    };
    this.command_j=function(count){
        count=count||1
        for(var i=0;i<count;i++)
            this.cursorMovesDown()
    };
    this.command_k=function(count){
        count=count||1
        for(var i=0;i<count;i++)
            this.cursorMovesUp()
    };
    this.command_l=function(count){
        count=count||1
        for(var i=0;i<count;i++)
            this.cursorMovesRight()
    };
    this.command_p=function(count){
        count=count||1
        if(this.pasteBoard.type===0){
            var c=this.textarea.selectionStart+1
            this.textarea.value=
                this.textarea.value.substring(0,c)
                +this.pasteBoard.content
                +this.textarea.value.substring(c,this.textarea.value.length)
            this.textarea.selectionStart=c+this.pasteBoard.content.length-1;
        }else if(this.pasteBoard.type===1){
            var first_nextLine=end_currentLine(this.textarea.selectionStart,this.textarea);
            var s=this.textarea.value.substring(0,first_nextLine);
            for(var i=0;i<count;i++)
                s+=this.pasteBoard.content;
            s+=this.textarea.value.substring(first_nextLine,this.textarea.value.length);
            this.textarea.value=s;
            this.textarea.selectionStart=this.textarea.selectionEnd=first_nextLine;
        }
    };
    this.command_r=function(count,string){
        count=count||1;
        var c=this.textarea.selectionStart;
        this.textarea.value=
            this.textarea.value.substring(0,c)
            +string.repeat(count)
            +this.textarea.value.substring(c+count,this.textarea.value.length);
        this.textarea.selectionStart=c+count-1;
    };
    this.command_u=function(){
        var c=this.textarea.selectionStart;
        this.textarea.value=this.histories[this.histories.length-1];
        while(0<=this.histories.length-1
                &&this.histories[this.histories.length-1]===this.textarea.value)
            this.histories.pop();
        if(0<=this.histories.length-1)
            this.textarea.value=this.histories[this.histories.length-1];
        this.textarea.selectionStart=c;
    };
    this.command_dd=function(count){
        count=count||1;
        var f=this.textarea.selectionStart
            ,l=this.textarea.selectionStart;
        f=start_currentLine(f,this.textarea);
        for(var i=0;i<count;i++)
            l=end_currentLine(l,this.textarea);
        this.yank(1,this.textarea.value.substring(f,l));
        this.textarea.value
            =this.textarea.value.substring(0,f)
            +this.textarea.value.substring(l,this.textarea.value.length);
        if(f<this.textarea.value.length)
            this.textarea.selectionStart=this.textarea.selectionEnd=f;
        else{
            this.textarea.selectionStart=this.textarea.selectionEnd=
                start_currentLine(this.textarea.value.length-1,this.textarea);
        }
    };
    this.command_gg=function(count){
        if(count===undefined)
            count=0;
        else
            count--;
        var c=0;
        for(var i=0;i<count;i++)
            c=end_currentLine(c,this.textarea);
        this.textarea.selectionStart=this.textarea.selectionEnd=c;
    };
    this.command_vy=function(){
        var f=this.textarea.selectionStart
            ,l=this.textarea.selectionEnd;
        this.yank(0,this.textarea.value.substring(f,l));
        this.mode=0;
    };
    this.command_vd=function(){
        var f=this.textarea.selectionStart
            ,l=this.textarea.selectionEnd;
        this.yank(0,this.textarea.value.substring(f,l));
        this.textarea.value=
            this.textarea.value.substring(0,f)
            +this.textarea.value.substring(l,this.textarea.length);
        this.textarea.selectionStart=f;
        this.mode=0;
    };
    this.command_yy=function(count){
        count=count||1;
        var f=this.textarea.selectionStart
            ,l=this.textarea.selectionStart;
        f=start_currentLine(f,this.textarea);
        for(var i=0;i<count;i++)
            l=end_currentLine(l,this.textarea);
        this.yank(1,this.textarea.value.substring(f,l));
    };
    this.command_ltlt=function(count){
        count=count||1;
        var f=this.textarea.selectionStart;
        f=start_currentLine(f,this.textarea);
        var nextSelection=f;
        this.textarea.value=this.textarea.value.substring(0,f)+this.textarea.value.substring(f+4,this.textarea.value.length);
        this.textarea.selectionStart=nextSelection;
    };
    this.command_gtgt=function(count){
        count=count||1;
        var f=this.textarea.selectionStart;
        f=start_currentLine(f,this.textarea);
        var nextSelection=f;
        this.textarea.value=this.textarea.value.substring(0,f)+'    '+this.textarea.value.substring(f,this.textarea.value.length);
        this.textarea.selectionStart=nextSelection;
    };
    this.command_vlt=function(count){
        count=count||1;
        var f=this.textarea.selectionStart,
            l=this.textarea.selectionEnd;
        f=start_currentLine(f,this.textarea);
        l=end_currentLine(l,this.textarea);
        var nextSelection=f;
        var output=this.textarea.value.substring(0,f);
        while(f!=l){
            var p=end_currentLine(f,this.textarea);
            output+=this.textarea.value.substring(f+4,p);
            f=p;
        }
        output+=this.textarea.value.substring(f,this.textarea.value.length);
        this.textarea.value=output;
        this.textarea.selectionStart=nextSelection;
        this.textarea.selectionEnd=nextSelection+1;
    };
    this.command_vgt=function(count){
        count=count||1;
        var f=this.textarea.selectionStart,
            l=this.textarea.selectionEnd;
        f=start_currentLine(f,this.textarea);
        l=end_currentLine(l,this.textarea);
        var nextSelection=f;
        var output=this.textarea.value.substring(0,f);
        while(f!=l){
            var p=end_currentLine(f,this.textarea);
            output+='    '+this.textarea.value.substring(f,p);
            f=p;
        }
        output+=this.textarea.value.substring(f,this.textarea.value.length);
        this.textarea.value=output;
        this.textarea.selectionStart=nextSelection;
        this.textarea.selectionEnd=nextSelection+1;
    };
    this.yank=function(type,content){
        this.pasteBoard.type=type;
        this.pasteBoard.content=content;
    };
    this.col_cursor=this.textarea.selectionStart-start_currentLine(
        this.textarea.selectionStart,
        this.textarea
    );
    this.cursorMovesLeft=function(){
        if(this.mode===0||this.mode===1){
            var p=this.textarea.selectionStart;
            var start=start_currentLine(p,this.textarea);
            if(0<=p-1&&this.textarea.value[p-1]!='\n')
                this.textarea.selectionStart=this.textarea.selectionEnd=p-1;
            this.col_cursor=this.textarea.selectionStart-start;
        }else if(this.mode===2){
            if(this.visualmode.fixedCursor+1<this.textarea.selectionEnd){
                var p=this.textarea.selectionEnd;
                p--;
                this.textarea.selectionEnd=p;
            }else{
                var p=this.textarea.selectionStart;
                p--;
                this.textarea.selectionStart=p;
            }
        }
    };
    this.cursorMovesRight=function(){
        if(this.mode===0||this.mode===1){
            var p=this.textarea.selectionStart;
            var start=start_currentLine(p,this.textarea);
            if(p+1<this.textarea.value.length&&(this.mode===0
                        ?this.textarea.value[p+1]!=='\n'
                        :this.textarea.value[p]!=='\n'))
                this.textarea.selectionStart=this.textarea.selectionEnd=this.textarea.selectionStart+1;
            this.col_cursor=this.textarea.selectionStart-start;
        }else if(this.mode===2){
            if(this.textarea.selectionStart<this.visualmode.fixedCursor){
                var p=this.textarea.selectionStart;
                p++;
                this.textarea.selectionStart=p;
            }else{
                var p=this.textarea.selectionEnd;
                p++;
                this.textarea.selectionEnd=p;
            }
        }
    };
    this.cursorMovesUp=function(){
        // do nothing if current line is the first line
        if(this.textarea.value.substring(0,this.textarea.selectionStart).split('\n').length-1==0)
            return;
        if(this.mode===0||this.mode===1){
            var p=this.textarea.selectionStart;
            var start=start_currentLine(p,this.textarea);
            var end=end_currentLine(p,this.textarea);
            var preEnd=start;
            var preStart=start_currentLine(preEnd-1,this.textarea);
            this.textarea.selectionStart=this.textarea.selectionEnd=preStart+Math.min(
                    preEnd-1-preStart
                    ,this.col_cursor);
        }else if(this.mode===2){
            if(this.visualmode.fixedCursor!==this.textarea.selectionStart)
                var p=this.textarea.selectionStart;
            else
                var p=this.textarea.selectionEnd;
            var preEnd=start_currentLine(p,this.textarea);
            var preStart=start_currentLine(preEnd-1,this.textarea);
            p=preStart+Math.min(
                preEnd-1-preStart,
                this.col_cursor
            );
            if(p<this.visualmode.fixedCursor+1){
                this.textarea.selectionStart=p;
                this.textarea.selectionEnd=this.visualmode.fixedCursor+1;
            }else{
                this.textarea.selectionStart=this.visualmode.fixedCursor;
                this.textarea.selectionEnd=p;
            }
        }
    };
    this.cursorMovesDown=function(){
        // do nothing if current line is the last line
        if(this.textarea.value.substring(0,this.textarea.selectionStart).split('\n').length-1
                ==this.textarea.value.split('\n').length-1-1)
            return;
        if(this.mode===0||this.mode===1){
            var p=this.textarea.selectionStart;
            var start=start_currentLine(p,this.textarea);
            var end=end_currentLine(p,this.textarea);
            var nxtStart=end;
            var nxtEnd=end_currentLine(nxtStart,this.textarea);
            this.textarea.selectionStart=this.textarea.selectionEnd=nxtStart+Math.min(
                    nxtEnd-1-nxtStart
                    ,this.col_cursor);
        }else if(this.mode===2){
            if(this.visualmode.fixedCursor!==this.textarea.selectionStart)
                var p=this.textarea.selectionStart;
            else
                var p=this.textarea.selectionEnd;
            var nxtStart=end_currentLine(p,this.textarea);
            var nxtEnd=end_currentLine(nxtStart,this.textarea);
            p=nxtStart+Math.min(
                nxtEnd-1-nxtStart,
                this.col_cursor
            );
            if(p<this.visualmode.fixedCursor+1){
                this.textarea.selectionStart=p;
                this.textarea.selectionEnd=this.visualmode.fixedCursor+1;
            }else{
                this.textarea.selectionStart=this.visualmode.fixedCursor;
                this.textarea.selectionEnd=p;
            }
        }
    };
    this.runCommandIfPossible=function(){
        if(this.mode===2){
            if(this.command==='d'){
                this.command_vd();
                this.command='';
            }else if(this.command==='y'){
                this.command_vy();
                this.command='';
            }else if(this.command==='<'){
                this.command_vlt();
                this.command='';
            }else if(this.command==='>'){
                this.command_vgt();
                this.command='';
            }
        }
        //
        var cmd=this.command;
        var argument;
        if(48<=cmd.charCodeAt(0)&&cmd.charCodeAt(0)<58){
            argument=0;
            var i=0;
            while(48<=cmd.charCodeAt(i)&&cmd.charCodeAt(i)<58){
                argument=10*argument+(cmd.charCodeAt(i)-48);
                i++;
            }
            cmd=cmd.substring(i,cmd.length);
        }
        if(cmd==='G'){
            this.command_G(argument);
            this.command='';
        }
        if(cmd==='P'){
            this.command_P(argument);
            this.command='';
        }
        if(cmd==='h'){
            this.command_h(argument);
            this.command='';
        }
        if(cmd==='j'){
            this.command_j(argument);
            this.command='';
        }
        if(cmd==='k'){
            this.command_k(argument);
            this.command='';
        }
        if(cmd==='l'){
            this.command_l(argument);
            this.command='';
        }
        if(cmd==='p'){
            this.command_p(argument);
            this.command='';
        }
        if(cmd[0]==='r'&&cmd.length===2){
            this.command_r(argument,cmd[1]);
            this.command='';
        }
        if(cmd==='u'){
            this.command_u(argument);
            this.command='';
        }
        if(cmd==='dd'){
            this.command_dd(argument);
            this.command='';
        }
        if(cmd==='gg'){
            this.command_gg(argument);
            this.command='';
        }
        if(cmd==='yy'){
            this.command_yy(argument);
            this.command='';
        }
        if(cmd==='<<'){
            this.command_ltlt(argument);
            this.command='';
        }
        if(cmd==='>>'){
            this.command_gtgt(argument);
            this.command='';
        }
        //
        if(this.command==='A'){
            var i=this.textarea.selectionStart;
            while(i+1<=this.textarea.value.length&&this.textarea.value[i]!=='\n')
                i++;
            this.textarea.selectionStart=this.textarea.selectionEnd=i;
            this.mode=1;
            this.command='';
        }
        if(this.command==='I'){
            var i=this.textarea.selectionEnd;
            while(0<=i-1&&this.textarea.value[i-1]!='\n')
                i--;
            this.textarea.selectionStart=this.textarea.selectionEnd=i;
            this.mode=1;
            this.command='';
        }
        if(this.command==='O'){
            this.mode=1;
            var p=start_currentLine(this.textarea.selectionStart,this.textarea);
            this.textarea.value=this.textarea.value.substring(0,p)
                +'\n'+this.textarea.value.substring(p,this.textarea.value.length);
            this.textarea.selectionStart=this.textarea.selectionEnd=p;
            this.command='';
        }
        if(this.command==='a'){ // a
            var i=this.textarea.selectionStart;
            if(i+1<this.textarea.value.length)
                i++;
            this.textarea.selectionStart=this.textarea.selectionEnd=i;
            this.mode=1;
            this.command='';
        }
        if(this.command==='i'){
            this.mode=1;
            this.textarea.selectionEnd=this.textarea.selectionStart;
            this.command='';
        }
        if(this.command==='v'){
            this.mode=2;
            this.visualmode.fixedCursor=this.textarea.selectionStart;
            this.command='';
        }
        if(this.command==='o'){
            this.mode=1;
            var p=end_currentLine(this.textarea.selectionStart,this.textarea);
            this.textarea.value=this.textarea.value.substring(0,p)
                +'\n'+this.textarea.value.substring(p,this.textarea.value.length);
            this.textarea.selectionStart=this.textarea.selectionEnd=p;
            this.command='';
        }
        if(this.command[0]===':'){
            for(var i=1;i<this.command.length;i++){
                if(this.command[i]==='q')
                    this.actived=false;
                if(this.command[i]==='w'){
                    this.write();
                }
            }
            this.command='';
        }
    };
    this.update=function(){
        if(this.histories.length===0
                ||this.histories[this.histories.length-1]!==this.textarea.value){
            this.histories.push(this.textarea.value);
            if(100<this.histories.length)
                this.histories.shift();
        }
        if(!this.actived){
            this.div_editor.style.display='none';
            this.pre_editor.style.display='none';
            var a=this.textarea.value.split('\n');
            return;
        }
        this.div_editor.style.display='block';
        this.pre_editor.style.display='block';
        // eol correction
        if(this.textarea.value[this.textarea.value.length-1]!=='\n')
            this.textarea.value+='\n';
        // end eol correction
        // selection correction
        if(this.mode===0){ // edit mode
            var t=this.textarea;
            if(0<=t.selectionStart-1
                    &&(t.selectionStart==t.value.length
                        ||t.value[t.selectionStart]==='\n'
                        &&t.value[t.selectionStart-1]!=='\n')){
                t.selectionStart--;
            }
            if(t.selectionEnd!=t.selectionStart+1)
                t.selectionEnd=t.selectionStart+1;
        }else if(this.mode===1){ // insert mode
        }
        // end correction
        var lineNumber_select=this.textarea.value.substring(
            0,this.textarea.selectionStart).split('\n').length-1;
        // line cursor catching up
        {
            var partialSum_rowsCount_lines;{
                partialSum_rowsCount_lines=this.textarea.value.split('\n');
                for(i in partialSum_rowsCount_lines)
                    partialSum_rowsCount_lines[i]=count_rows_string(partialSum_rowsCount_lines[i]);
                for(var i=1;i<partialSum_rowsCount_lines.length;i++)
                    partialSum_rowsCount_lines[i]+=partialSum_rowsCount_lines[i-1];
                partialSum_rowsCount_lines.unshift(0);
            }
            var lower=lineNumber_select,upper=lineNumber_select;
            while(0<=lower-1&&partialSum_rowsCount_lines[lineNumber_select+1]-partialSum_rowsCount_lines[lower-1]
                    <=this.count_rows_toshow-1)
                lower--;
            this.lineCursor=Math.max(this.lineCursor,lower);
            this.lineCursor=Math.min(this.lineCursor,upper);
        }
        // end line cursor catching up
        var output='';
        var text=this.textarea.value;
        var cursor=textarea.selectionStart,cursor_end=textarea.selectionEnd;
        var lines=text.split('\n');
        for(var i in lines)
            lines[i]+='\n';
        lines.pop();
        var length_lines=new Array(lines.length);
        for(var i in lines)
            length_lines[i]=lines[i].length;
        var partialsum_length_lines=[0];
        partialsum_length_lines.push.apply(partialsum_length_lines,cppstl.partial_sum(length_lines));
        var lineNumber_cursor=cppstl.upper_bound(partialsum_length_lines,cursor)-1;
        var lineNumber_cursor_end=cppstl.upper_bound(partialsum_length_lines,cursor_end)-1;
        var charNumber_cursor=cursor-partialsum_length_lines[lineNumber_cursor];
        var charNumber_cursor_end=cursor_end-partialsum_length_lines[lineNumber_cursor_end];
        // above perfect
        var count_rows_showed=0;
        var currentLine='',row_currentLine=0,col_currentRow=0;
        var toEndCursorSpan=false;
        var isActiveElement=this.textarea===document.activeElement;
        for(var lineNumber=this.lineCursor,charNumber=0;lineNumber<lines.length;){
            var i=partialsum_length_lines[lineNumber]+charNumber;
            var string_toshow_currentCharacter=
                text[i]==='\n'
                    ?(this.mode===1||0<=i-1&&text[i-1]==='\n'?' ':'')
                    :text[i];
            var width_string_toshow_currentCharacter=
                string_toshow_currentCharacter===''?0:
                string_toshow_currentCharacter.charCodeAt(0)<0xff?1:2;
            if(this.count_cols_toshow
                    <(this.environment.number?8:0)+col_currentRow
                    +width_string_toshow_currentCharacter){
                currentLine+='\n';
                row_currentLine++;
                col_currentRow=0;
            }
            if(this.environment.number){
                if(col_currentRow===0){
                    var count_cols_lineNumber=8;
                    if(row_currentLine===0){
                        var s=(lineNumber+1).toString();
                        for(var j=0;j<count_cols_lineNumber-s.length-1;j++)
                            currentLine+=' ';
                        currentLine+='<span style="color:green;">'+s+'</span>';
                        currentLine+=' ';
                    }else{
                        for(var j=0;j<count_cols_lineNumber;j++)
                            currentLine+=' ';
                    }
                }
            }
            if(isActiveElement){
                if(i==cursor){
                    currentLine+='<span style="background-color:'+this.style.color+';color:'+this.style.backgroundColor+';">';
                    toEndCursorSpan=true;
                }
            }
            if(text[i]==='\n'){
                if(this.environment.list
                        ||this.mode===1
                        ||0<=i-1&&text[i-1]){ // eol showing
                    currentLine+='<span style="'+this.stylesheet_eol+'">';
                    if(this.environment.list)
                        currentLine+='$';
                    else
                        currentLine+=' ';
                    currentLine+='</span>';
                }
                currentLine+='\n';
                row_currentLine++;
                col_currentRow=0;
            }else if(text[i]==='\t'){
                currentLine+=text[i];
                charNumber++;
                col_currentRow=Math.floor((col_currentRow+8)/8)*8;
            }else{
                var html_toshow;
                if(text[i]==='<'){
                    html_toshow='&lt;';
                }else if(text[i]==='>'){
                    html_toshow='&gt;';
                }else if(text[i]==='&'){
                    html_toshow='&amp;';
                }else{
                    html_toshow=text[i];
                }
                if(!this.highlighter||'!@#$%^&*()-=[]{},.;<>?:\'"\\/'.indexOf(text[i])==-1)
                    currentLine+=html_toshow;
                else
                    currentLine+='<span style="color:red;">'+html_toshow+'</span>';
                charNumber++;
                col_currentRow+=width_string_toshow_currentCharacter;
            }
            if(isActiveElement){
                if(this.mode===0){ // normal mode
                    if(i+1===cursor_end){
                        toEndCursorSpan=false;
                        currentLine+='</span>';
                    }
                }else if(this.mode===1||this.mode===2){ // insert mode or visual mode
                    if(cursor===cursor_end
                            ?i+1==cursor_end+1
                            :i+1==cursor_end){
                        toEndCursorSpan=false;
                        currentLine+='</span>';
                    }
                }
            }
            if(text[i]==='\n'){
                if(this.lineCursor<=lineNumber){
                    if(this.count_rows_toshow-1
                            <count_rows_showed+row_currentLine){
                        break;
                    }
                    output+=currentLine;
                    count_rows_showed+=row_currentLine;
                }
                currentLine='';
                charNumber=0;
                row_currentLine=0;
                col_currentRow=0;
                lineNumber++;
            }
        } // for(var lineNumber=this.lineCursor,charNumber=0;lineNumber<lines.length;)
        if(toEndCursorSpan){
            toEndCursorSpan=false;
            output+='</span>';
        }
        while(count_rows_showed<this.count_rows_toshow-1){
            output+='~\n';
            count_rows_showed++;
        }
        if(this.mode==0){
            var s=this.command;
            if(50<s.length)
                s=s.substring(s.length-50,s.length);
            if(this.command[0]===':'||this.command[0]==='/'){
                output+=s;
            }else{
                output+='<span style="color:gray;">'+s+'</span>';
            }
            col_currentRow+=s.length;
        }else if(this.mode==1){
            output+='-- INSERT --';
            col_currentRow+='-- INSERT --'.length;
        }else if(this.mode==2){
            output+='-- VISUAL --';
            col_currentRow+='-- VISUAL --'.length;
        }
        var s;
        while(col_currentRow<60){
            output+=' ';
            col_currentRow++;
        }
        s=(lineNumber_cursor+1)+','+(charNumber_cursor+1);
        output+=s;
        col_currentRow+=s.length;
        while(col_currentRow<72){
            output+=' ';
            col_currentRow++;
        }
        s=Math.floor(100*lineNumber_cursor/lines.length)+'%';
        output+=s;
        col_currentRow+=s.length;
        this.pre_editor.innerHTML=output;
    };
    this.update_pre_editor=function(){
        this.pre_editor.style.backgroundColor=this.style.backgroundColor;
        this.pre_editor.style.color=this.style.color;
    }
    this.textarea.onclick=function(){
        this.vimsimulator.update();
    };
    this.textarea.vimsimulator=this;
    var textarea_onkeydown_mode_0=function(e){
        var value_toreturn;
        if(0<this.vimsimulator.command.length
                &&(this.vimsimulator.command[0]===':'
                    ||this.vimsimulator.command[0]==='/')){
            if(e.shiftKey){
                if(e.keyCode===49){ // !
                    value_toreturn=false;
                    this.vimsimulator.command+='!';
                }else if(e.keyCode===188){ // <
                    value_toreturn=false;
                    this.vimsimulator.command+='<';
                }
            }else{
                if(e.keyCode===8){ // backspace
                    value_toreturn=false;
                    this.vimsimulator.command
                        =this.vimsimulator.command.substring
                        (0
                         ,this.vimsimulator.command.length-1);
                }else if(e.keyCode===13){ // enter
                    value_toreturn=false;
                    this.vimsimulator.runCommandIfPossible();
                }else if(65<=e.keyCode&&e.keyCode<91){ // a-z
                    value_toreturn=false;
                    this.vimsimulator.command+=String.fromCharCode(e.keyCode+32);
                }else{
                    value_toreturn=false;
                }
            }
        }else if(e.shiftKey){
            if(e.keyCode===49){ // !
                value_toreturn=false;
                this.vimsimulator.command+='!';
            }else if(e.keyCode===59||e.keyCode===186){
                /*
                 * 59: ':' for firefox and opera
                 * 186: ':' for chrome and safari
                 */
                value_toreturn=false;
                this.vimsimulator.command+=':';
            }else if(65<=e.keyCode&&e.keyCode<91){ // A-Z
                value_toreturn=false;
                this.vimsimulator.command+=String.fromCharCode(e.keyCode);
            }else if(e.keyCode===188){ // <
                value_toreturn=false;
                this.vimsimulator.command+='<';
            }else if(e.keyCode===190){ // >
                value_toreturn=false;
                this.vimsimulator.command+='>';
            }else{
                value_toreturn=true;
            }
        }else{
            if(e.keyCode===8){ // backspace
                value_toreturn=false;
                this.selectionStart=this.selectionEnd
                    =this.selectionStart
                    ?this.selectionStart-1
                    :this.selectionStart
                    ;
            }else if(e.keyCode===13){ // enter
                value_toreturn=false;
                if(this.value.substring(0,this.selectionStart).split('\n').length-1
                        !=this.value.split('\n').length-1-1){
                    this.selectionStart=this.selectionEnd
                        =end_currentLine(this.selectionStart,this);
                }
            }else if(e.keyCode===32){ // space for chrome and safari
                value_toreturn=false;
                this.vimsimulator.command+=' ';
            }else if(e.keyCode===35){ // end
                value_toreturn=false;
                this.selectionStart
                    =end_currentLine(this.selectionStart,this)-1;
                this.selectionEnd=this.selectionStart+1;
            }else if(e.keyCode===36){ // home
                value_toreturn=false;
                this.selectionStart
                    =start_currentLine(this.selectionStart,this);
                this.selectionEnd=this.selectionStart+1;
            }else if(e.keyCode===37){ // left arrow
                value_toreturn=false;
                this.vimsimulator.cursorMovesLeft();
            }else if(e.keyCode===38){ // up arrow
                value_toreturn=false;
                this.vimsimulator.cursorMovesUp();
            }else if(e.keyCode===39){ // right arrow
                value_toreturn=false;
                this.vimsimulator.cursorMovesRight();
            }else if(e.keyCode===40){ // down arrow
                value_toreturn=false;
                this.vimsimulator.cursorMovesDown();
            }else if(e.keyCode===46){ // delete
                value_toreturn=false;
                var p=this.selectionStart;
                this.value=this.value.substring(0,p)
                    +this.value.substring(p+1,this.value.length);
                this.selectionStart=p;
                this.selectionEnd=p+1;
            }else if(48<=e.keyCode&&e.keyCode<58){
                value_toreturn=false;
                this.vimsimulator.command+=String.fromCharCode(e.keyCode);
            }else if(e.keyCode===59||e.keyCode===186){
                /*
                 * 59: ';' for firefox and opera
                 * 186: ';' for chrome and safari
                 */
                value_toreturn=false;
                this.vimsimulator.command+=';';
            }else if(65<=e.keyCode&&e.keyCode<91){ // a-z
                value_toreturn=false;
                this.vimsimulator.command+=String.fromCharCode(e.keyCode+32);
            }else{
                value_toreturn=true;
            }
        }
        if(0<this.vimsimulator.command.length
                &&(this.vimsimulator.command[0]===':'
                    ||this.vimsimulator.command[0]==='/')){
        }else
            this.vimsimulator.runCommandIfPossible();
        return value_toreturn;
    }.bind(this.textarea)
    var textarea_onkeydown_mode_1=function(e){
        var value_toreturn;
        if(e.keyCode===9){ // tab
            var f=this.selectionStart,l=this.selectionEnd;
            this.value
                =this.value.substring(0,f)
                +'\t'+this.value.substring(l,this.value.length);
            this.selectionStart=this.selectionEnd=f+1;
            value_toreturn=false;
        }else if(e.keyCode===37){ // left arrow
            value_toreturn=false;
            this.vimsimulator.cursorMovesLeft();
        }else if(e.keyCode===38){ // up arrow
            value_toreturn=false;
            this.vimsimulator.cursorMovesUp();
        }else if(e.keyCode===39){ // right arrow
            value_toreturn=false;
            this.vimsimulator.cursorMovesRight();
        }else if(e.keyCode===40){ // down arrow
            value_toreturn=false;
            this.vimsimulator.cursorMovesDown();
        }
        return value_toreturn;
    }.bind(this.textarea);
    var textarea_onkeydown_mode_2=function(e){
        var value_toreturn;
        if(e.keyCode===37){ // left arrow
            value_toreturn=false;
            this.vimsimulator.cursorMovesLeft();
        }else if(e.keyCode===38){ // up arrow
            value_toreturn=false;
            this.vimsimulator.cursorMovesUp();
        }else if(e.keyCode===39){ // right arrow
            value_toreturn=false;
            this.vimsimulator.cursorMovesRight();
        }else if(e.keyCode===40){ // down arrow
            value_toreturn=false;
            this.vimsimulator.cursorMovesDown();
        }else if(65<=e.keyCode&&e.keyCode<91){ // a-z
            value_toreturn=false;
            this.vimsimulator.command+=String.fromCharCode(e.keyCode+32);
        }else if(e.keyCode===188){ // <
            value_toreturn=false;
            this.vimsimulator.command+='<';
        }else if(e.keyCode===190){ // >
            value_toreturn=false;
            this.vimsimulator.command+='>';
        }
        this.vimsimulator.runCommandIfPossible();
        return value_toreturn;
    };
    this.textarea.onkeydown=function(e){
        var value_toreturn;
        if(e.ctrlKey&&e.shiftKey&&e.keyCode===86){ // ctrl+shift+v
            var t=this.vimsimulator;
            t.actived=!t.actived;
            this.vimsimulator.col_cursor=this.selectionStart-start_currentLine(
                    this.selectionStart
                    ,this);
            value_toreturn=false;
        }else if(!this.vimsimulator.actived){
            value_toreturn=true;
        }else if(e.keyCode===27||e.ctrlKey&&e.keyCode===67){ // esc or ctrl+c
            this.vimsimulator.mode=0;
            this.vimsimulator.command='';
            this.vimsimulator.update();
            value_toreturn=false;
        }else if(this.vimsimulator.mode===0){
            value_toreturn=textarea_onkeydown_mode_0(e);
        }else if(this.vimsimulator.mode===1){
            value_toreturn=textarea_onkeydown_mode_1(e);
        }else if(this.vimsimulator.mode==2){
            value_toreturn=textarea_onkeydown_mode_2(e);
        }
        this.vimsimulator.afterkeydown_textarea();
        this.vimsimulator.update();
        return value_toreturn
    }
    this.textarea.onkeyup=function(){
        this.vimsimulator.afterkeyup_textarea()
    }
    this.textarea.oninput=function(){
        this.vimsimulator.afterinput_textarea();
        this.vimsimulator.update();
    };
    this.textarea.onblur=function(){
        this.vimsimulator.update();
    }
    this.textarea.onfocus=function(){
        this.vimsimulator.update()
    }
    this.div_editor=document.createElement('pre')
    this.div_editor.vimsimulator=this
    // centering
    this.div_editor.style.position='fixed';
    this.div_editor.style.left='50%';
    this.div_editor.style.marginLeft=''+-(this.count_cols_toshow*6)/2+'pt';
    this.div_editor.style.top='50%';
    this.div_editor.style.marginTop=''+-(this.count_rows_toshow*12)/2+'pt';
    // end centering
    this.div_editor.style.display='none';
    this.div_editor.style.background=this.style.backgroundColor;
    this.div_editor.style.height=''+this.count_rows_toshow*12+'pt';
    this.div_editor.style.width=''+this.count_cols_toshow*6+'pt';
    document.body.appendChild(this.div_editor);
    this.pre_editor=document.createElement('pre');
    this.pre_editor.vimsimulator=this;
    this.pre_editor.onclick=function(){
        this.vimsimulator.textarea.focus();
        this.vimsimulator.update();
    };
    // centering
    this.pre_editor.style.position='fixed';
    this.pre_editor.style.left='50%';
    this.pre_editor.style.marginLeft=''+-(this.count_cols_toshow*6)/2+'pt';
    this.pre_editor.style.top='50%';
    this.pre_editor.style.marginTop=''+-(this.count_rows_toshow*12)/2+'pt';
    // end centering
    this.pre_editor.style.display='none';
    this.pre_editor.style.border='0px';
    //this.pre_editor.style.backgroundColor=this.style.backgroundColor;
    this.pre_editor.style.color=this.style.color;
    this.pre_editor.style.height=''+this.count_rows_toshow*12+'pt';
    this.pre_editor.style.width=''+this.count_cols_toshow*6+'pt';
    this.pre_editor.style.lineHeight='12pt';
    this.pre_editor.style.letterSpacing='0pt';
    this.pre_editor.style.fontFamily='\'WenQuanYi Zen Hei Mono\',\'Consolas\',\'Courier New\',\'Courier\',monospace';
    document.body.appendChild(this.pre_editor);
}
