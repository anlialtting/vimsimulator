module.export={
    left,
    right,
    up,
    down,
}
function left(){
    if(this.mode==0){
        if(
            0<=this.selectionStart-1&&
            this.text[this.selectionStart-1]!='\n'
        )
            this.selectionStart--
    }else if(this.mode==1){
        let
            p=this.selectionStart,
            start=getLineStartByCursor(this.text,p)
        if(0<=p-1&&this.text[p-1]!='\n')
            this.selectionStart=
                this.selectionEnd=p-1
        this.col_cursor=this.selectionStart-start
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
function right(){
    if(this.mode==0||this.mode==1){
        let
            p=this.selectionStart,
            start=getLineStartByCursor(this.text,p)
        if(
            p+1<this.text.length&&(
                this.mode===0?
                    this.text[p+1]!=='\n'
                :
                    this.text[p]!=='\n'
            )
        )
            this.selectionStart=
                this.selectionEnd=
                this.selectionStart+1
        //this.col_cursor=this.selectionStart-start
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
function up(){
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
            p=this.selectionStart,
            start=getLineStartByCursor(this.text,p),
            end=getLineEndByCursor(this.text,p),
            preEnd=start,
            preStart=getLineStartByCursor(this.text,preEnd-1)
        this.selectionStart=
            this.selectionEnd=
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
function down(){
    if(this.mode===0||this.mode===1){
        // do nothing if current line is the last line
        if(
            this.text.substring(
                0,this.selectionStart
            ).split('\n').length-1==
            this.text.split(
                '\n'
            ).length-1-1
        )
            return
        let
            p=this.selectionStart,
            start=getLineStartByCursor(this.text,p),
            end=getLineEndByCursor(this.text,p),
            nxtStart=end,
            nxtEnd=getLineEndByCursor(this.text,nxtStart)
        this.selectionStart=
            this.selectionEnd=nxtStart+Math.min(
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
