Promise.all([
    CryptoJS,
    module.shareImport('JsonFormatter.js'),
    module.shareImport('capitalCommands.js'),
]).then(modules=>{
let
    CryptoJS=modules[0],
    JsonFormatter=modules[1],
    capitalCommands=modules[2]
module.export=function(Vim){
    Vim.prototype.command_A=capitalCommands.A
    Vim.prototype.command_D=capitalCommands.D
    Vim.prototype.command_G=capitalCommands.G
    Vim.prototype.command_I=capitalCommands.I
    Vim.prototype.command_O=capitalCommands.O
    Vim.prototype.command_P=capitalCommands.P
    Vim.prototype.command_X=capitalCommands.X
    Vim.prototype.command_dd=function(count){
        count=count||1
        let
            f=this.textarea.selectionStart,
            l=this.textarea.selectionStart
        f=getLineStartByCursor(this.textarea.value,f)
        for(let i=0;i<count;i++)
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
    Vim.prototype.command_gg=function(count){
        let
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
        let
            f=this.textarea.selectionStart,
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
        let selectionStart=this.textarea.selectionStart
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
        let lineHead=
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
}
})
