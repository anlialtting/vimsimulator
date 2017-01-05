Promise.all([
    CryptoJS,
    module.shareImport('../JsonFormatter.js'),
]).then(modules=>{
    let
        CryptoJS=modules[0],
        JsonFormatter=modules[1]
    return {A,D,G,I,O,P,X}
    function A(count){
        let i=this.textarea.selectionStart
        while(
            i+1<=this.textarea.value.length&&
            this.textarea.value[i]!=='\n'
        )
            i++
        this.textarea.selectionStart=
            this.textarea.selectionEnd=i
        this.mode='insert'
    }
    function D(count){
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
    function G(count){
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
    function I(count){
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
        this.mode='insert'
    }
    function O(count){
        let
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
        this.mode='insert'
    }
    function P(count){
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
    function X(count){
        var selectionStart=this.textarea.selectionStart
        count=count||1
        this.textarea.value=this.textarea.value.substring(
            0,this.textarea.selectionStart-count
        )+this.textarea.value.substring(
            this.textarea.selectionStart
        )
        this.textarea.selectionStart=selectionStart-count
    }
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
})
