Promise.all([
    CryptoJS(),
    module.import('JsonFormatter.js'),
]).then(modules=>{
let
    CryptoJS=modules[0],
    JsonFormatter=modules[1]
module.export=function(Vim){
    Vim.prototype.command_A=function(count){
        let i=this.textarea.selectionStart
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
        let selectionStart=
            this.textarea.selectionStart
        this.textarea.value=
            this.textarea.value.substring(
                0,
                this.textarea.selectionStart
            )+this.textarea.value.substring(
                this.textarea.selectionStart+
                    this.textarea.value.
                    substring(
                        this.textarea.selectionStart
                    ).
                    search('\n')
            )
        this.textarea.selectionStart=
            0<=selectionStart-1&&
                this.textarea.value[selectionStart-1]!=='\n'?
                selectionStart-1
            :
                selectionStart
    }
    Vim.prototype.command_G=function(count){
        if(count===undefined)
            count=
                this.textarea.value.split('\n').length-1-1
        else
            count--
        let c=0
        for(let i=0;i<count;i++)
            c=getLineEndByCursor(this.textarea.value,c)
        this.textarea.selectionStart=
        this.textarea.selectionEnd=c
    }
    Vim.prototype.command_I=function(count){
        var start_currentLine_textarea
        start_currentLine_textarea=
            getLineStartByCursor(
                this.textarea.value,
                this.textarea.selectionStart
            )
        this.textarea.selectionStart=
        this.textarea.selectionEnd=
            getLineHeadByCursor(
                this.textarea.value,
                this.textarea.selectionStart
            )
        this.mode=1
    }
    Vim.prototype.command_O=function(count){
        var
            prefixingWhitespaces,
            startOfCurrentLine
        startOfCurrentLine=getLineStartByCursor(
            this.textarea.value,
            this.textarea.selectionStart
        )
        prefixingWhitespaces=
            function(result){
                result=result.substring(startOfCurrentLine)
                result=result.substring(0,result.search(/[^ ]/))
                return result
            }(this.textarea.value)
        this.textarea.value=
            this.textarea.value.substring(0,startOfCurrentLine)+
            prefixingWhitespaces+'\n'+
            this.textarea.value.substring(startOfCurrentLine)
        this.textarea.selectionStart=
        this.textarea.selectionEnd=
            startOfCurrentLine+prefixingWhitespaces.length
        this.mode=1
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
        }else if(this.pasteBoard.type===1){
            var c=this.textarea.selectionStart
            c=getLineStartByCursor(this.textarea.value,c)
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
    Vim.prototype.command_X=function(count){
        var selectionStart=this.textarea.selectionStart
        count=count||1
        this.textarea.value=this.textarea.value.substring(
            0,this.textarea.selectionStart-count
        )+this.textarea.value.substring(
            this.textarea.selectionStart
        )
        this.textarea.selectionStart=selectionStart-count
    }
    Vim.prototype.command_dd=function(count){
        count=count||1
        var
            f=this.textarea.selectionStart,
            l=this.textarea.selectionStart,
            i
        f=getLineStartByCursor(this.textarea.value,f)
        for(i=0;i<count;i++)
            l=getLineEndByCursor(this.textarea.value,l)
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
    Vim.prototype.command_o=function(count){
        var
            prefixingWhitespaces,
            endOfCurrentLine
        prefixingWhitespaces=
            function(vim){
                var result
                result=vim.textarea.value.substring(
                    getLineStartByCursor(
                        vim.textarea.value,
                        vim.textarea.selectionStart
                    )
                )
                result=result.substring(0,result.search(/[^ ]/))
                return result
            }(this)
        endOfCurrentLine=getLineEndByCursor(
            this.textarea.value,
            this.textarea.selectionStart
        )
        this.textarea.value=
            this.textarea.value.substring(0,endOfCurrentLine)+
            prefixingWhitespaces+'\n'+
            this.textarea.value.substring(
                endOfCurrentLine
            )
        this.textarea.selectionStart=
        this.textarea.selectionEnd=
            endOfCurrentLine+prefixingWhitespaces.length
        this.mode=1
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
            var first_nextLine=getLineEndByCursor(
                this.textarea.value,
                this.textarea.selectionStart
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
            this.textarea.value.substring(0,c)+
            Array(count+1).join(string)+
            this.textarea.value.substring(
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
    Vim.prototype.command_x=function(count){
        var selectionStart=this.textarea.selectionStart
        count=count||1
        this.textarea.value=this.textarea.value.substring(
            0,this.textarea.selectionStart
        )+this.textarea.value.substring(
            this.textarea.selectionStart+count
        )
        this.textarea.selectionStart=selectionStart
    }
    Vim.prototype.command_dot=function(count){
    }
    Vim.prototype.command_dd=function(count){
        var
            f,
            l,
            i
        count=count||1
        f=this.textarea.selectionStart
        l=this.textarea.selectionStart
        f=getLineStartByCursor(this.textarea.value,f)
        for(i=0;i<count;i++)
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
    Vim.prototype.command_gg=function(count){
        var
            c=0
        count=count===undefined?0:count-1
        while(count--)
            c=getLineEndByCursor(this.textarea.value,c)
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
        f=getLineStartByCursor(this.textarea.value,f)
        for(var i=0;i<count;i++)
            l=getLineEndByCursor(this.textarea.value,l)
        this.yank(1,this.textarea.value.substring(f,l))
    }
    Vim.prototype.command_ltlt=function(count){
        var
            lineNumber
        count=count||1
        lineNumber=
            lineNumberOf(
                this.textarea.value,
                this.textarea.selectionStart
            )
        this.unindent(lineNumber,lineNumber+count)
    }
    Vim.prototype.command_gtgt=function(count){
        var
            start_currentLine_textarea,
            lineNumber,
            lines
        count=count||1
        start_currentLine_textarea=getLineStartByCursor(
            this.textarea.value,
            this.textarea.selectionStart
        )
        lineNumber=
            lineNumberOf(this.textarea.value,this.textarea.selectionStart)
        lines=linesOf(this.textarea.value)
        !function(){
            var i
            for(i=0;i<count;i++)
                lines[lineNumber+i]=
                    '    '+lines[lineNumber+i]
        }()
        this.textarea.value=lines.join('\n')
        this.textarea.selectionStart=
            start_currentLine_textarea+
            this.textarea.value.substring(
                start_currentLine_textarea
            ).search(/[^ ]/)
        function linesOf(text){
            var result
            result=text.split('\n')
            result.pop()
            return result
        }
        function lineNumberOf(text,cursor){
            return text.substring(0,cursor).split('\n').length-1
        }
    }
    Vim.prototype.command_vlt=function(){
        this.mode=0
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
        var
            selectionStart,
            lineHead
        selectionStart=this.textarea.selectionStart
        this.mode=0
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
        lineHead=
            getLineHeadByCursor(this.textarea.value,selectionStart)
        this.textarea.selectionStart=lineHead
        this.textarea.selectionEnd=lineHead+1
    }
    // begin 2015-09-07
    function linesOf(text){
    /*
        A line should not include EOL,
        since it has already been seperated from the others.
    */
        var result
        result=text.split('\n')
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
}
})
