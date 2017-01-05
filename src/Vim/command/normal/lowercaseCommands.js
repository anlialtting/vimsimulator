Promise.all([
    CryptoJS,
    module.shareImport('../../JsonFormatter.js'),
]).then(modules=>{
    let
        CryptoJS=modules[0],
        JsonFormatter=modules[1]
    return {p,r,u,x,dot}
    function p(count){
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
    function r(count,string){
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
    function u(){
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
    function x(count){
        var selectionStart=this.textarea.selectionStart
        count=count||1
        this.textarea.value=this.textarea.value.substring(
            0,this.textarea.selectionStart
        )+this.textarea.value.substring(
            this.textarea.selectionStart+count
        )
        this.textarea.selectionStart=selectionStart
    }
    function dot(count){
    }
    function getLineStartByCursor(text,cursor){
        return text.substring(0,cursor).lastIndexOf('\n')+1
    }
    function getLineEndByCursor(text,cursor){
        return text.indexOf('\n',cursor)+1
    }
})
