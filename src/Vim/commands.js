Promise.all([
    CryptoJS,
    module.shareImport('JsonFormatter.js'),
    module.shareImport('uppercaseCommands.js'),
    module.shareImport('lowercaseCommands.js'),
]).then(modules=>{
    let
        CryptoJS=modules[0],
        JsonFormatter=modules[1],
        uppercaseCommands=modules[2],
        lowercaseCommands=modules[3]
    return function(Vim){
        Vim.prototype.command_A=uppercaseCommands.A
        Vim.prototype.command_D=uppercaseCommands.D
        Vim.prototype.command_G=uppercaseCommands.G
        Vim.prototype.command_I=uppercaseCommands.I
        Vim.prototype.command_O=uppercaseCommands.O
        Vim.prototype.command_P=uppercaseCommands.P
        Vim.prototype.command_X=uppercaseCommands.X
        Vim.prototype.command_h=lowercaseCommands.h
        Vim.prototype.command_j=lowercaseCommands.j
        Vim.prototype.command_k=lowercaseCommands.k
        Vim.prototype.command_l=lowercaseCommands.l
        Vim.prototype.command_o=lowercaseCommands.o
        Vim.prototype.command_p=lowercaseCommands.p
        Vim.prototype.command_r=lowercaseCommands.r
        Vim.prototype.command_u=lowercaseCommands.u
        Vim.prototype.command_x=lowercaseCommands.x
        Vim.prototype.command_dot=lowercaseCommands.dot
        Vim.prototype.command_dd=lowercaseCommands.dd
        Vim.prototype.command_gg=lowercaseCommands.gg
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
