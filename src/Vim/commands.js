Promise.all([
    CryptoJS,
    module.shareImport('JsonFormatter.js'),
]).then(modules=>{
    let
        CryptoJS=modules[0],
        JsonFormatter=modules[1]
    return function(Vim){
        Vim.prototype.command_vy=function(){
            var f=this.textarea.selectionStart,
                l=this.textarea.selectionEnd
            this.yank(
                0,
                this.textarea.value.substring(f,l)
            )
            this.mode='normal'
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
            this.mode='normal'
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
