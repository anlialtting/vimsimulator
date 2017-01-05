Promise.all([
    CryptoJS,
    module.shareImport('../../JsonFormatter.js'),
]).then(modules=>{
    let
        CryptoJS=modules[0],
        JsonFormatter=modules[1]
    return {dd,h,j,k,l,p,r,u,x,dot,gg}
    function dd(count){
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
    function h(count){
        count=count||1
        while(count--)
            this._cursor.moveLeft()
    }
    function j(count){
        count=count||1
        while(count--)
            this._cursor.moveDown()
    }
    function k(count){
        count=count||1
        while(count--)
            this._cursor.moveUp()
    }
    function l(count){
        count=count||1
        while(count--)
            this._cursor.moveRight()
    }
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
    function gg(count){
        let
            c=0
        count=count===undefined?0:count-1
        while(count--)
            c=getLineEndByCursor(this.textarea.value,c)
        this.textarea.selectionStart=
            this.textarea.selectionEnd=c
    }
    function getLineStartByCursor(text,cursor){
        return text.substring(0,cursor).lastIndexOf('\n')+1
    }
    function getLineEndByCursor(text,cursor){
        return text.indexOf('\n',cursor)+1
    }
})
