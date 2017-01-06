/*
http://www.truth.sk/vim/vimbook-OPL.pdf
*/
let
    CryptoJS=module.arguments.CryptoJS||module.extractByPath('https://cdn.rawgit.com/sytelus/CryptoJS/7fbfbbee0d005b31746bc5858c70c359e98308e5/rollups/aes.js','CryptoJS',{lazy:true}),
    EventEmmiter=module.arguments.events||module.importByPath('https://cdn.rawgit.com/anliting/module/5ddc4f02188066d00a698eea63f983ab1e5b7d4f/node/events.js')
module=module.share({CryptoJS})
Promise.all([
    module.shareImport('Vim/createViewDiv.js'),
    module.shareImport('Vim/JsonFormatter.js'),
    module.shareImport('Vim/commands.js'),
    module.shareImport('Vim/createInput.js'),
    CryptoJS,
    module.shareImport('Vim/Cursor.js'),
    module.shareImport('Vim/command.js'),
    EventEmmiter,
]).then(modules=>{
    let
        createViewDiv=          modules[0],
        JsonFormatter=          modules[1],
        commands=               modules[2],
        createInput=            modules[3],
        CryptoJS=               modules[4],
        Cursor=                 modules[5],
        command=                modules[6],
        EventEmmiter=           modules[7]
    function Vim(){
        EventEmmiter.call(this)
        this._text=''
        this._command=''
        this.viewChanged=[]
        this.lineHeightInPx=13
        this.inputTag=createInput(this)
        this._mode='normal'
        this._cursor=new Cursor(this)
    }
    Object.setPrototypeOf(Vim.prototype,EventEmmiter.prototype)
    Object.defineProperty(Vim.prototype,'mode',{
        set(val){
            this._mode=val
            this.viewChanged.mode=true
        },
        get(){
            return this._mode
        }
    })
    Object.defineProperty(Vim.prototype,'text',{
        set(val){
            this._text=val
            this.viewChanged.text=true
            this.view()
            this.emit('textChange')
        },
        get(){
            return this._text
        }
    })
    Object.defineProperty(Vim.prototype,'command',{
        set(val){
            this._command=val
            this.viewChanged.command=true
            if(this._command){
                command.call(this)
                this.view()
            }
            this.emit('commandChange')
        },
        get(){
            return this._command
        }
    })
    Vim.prototype.view=function(){
        this.emit('view',Object.keys(this.viewChanged))
        this.viewChanged={}
    }
    commands(Vim)
    Vim.prototype.setText=function(text){
        this.text=text
        this.view()
    }
    Vim.prototype.setupPassword=function(password){
        this.password=password
    }
    /*Vim.prototype.unindent=function(beginLine,endLine){
        let lines=linesOf(this.text)
        for(
            let currentLine=beginLine;
            currentLine!=endLine;
            currentLine++
        )
            lines[currentLine]=
                unindent(lines[currentLine])
        this.text=lines.join('\n')
        let vim=this
        let sum=0
        for(let i=0;i<beginLine;i++)
            sum+=lines[i].length+1
        let lineHead=
            getLineHeadByCursor(vim.textarea.value,sum)
        vim.selectionStart=lineHead
        vim.selectionEnd=lineHead+1
        function unindent(s){
            return s.substring(
                Math.min(
                    (s+'\n').search(/[^ ]/),
                    4
                )
            )
        }
    }
    Vim.prototype.indent=function(beginLine,endLine){
        let lines=linesOf(this.textarea.value)
        for(
            let currentLine=beginLine;
            currentLine!=endLine;
            currentLine++
        )
            lines[currentLine]=
                indent(lines[currentLine])
        this.textarea.value=lines.join('\n')
        function indent(s){
            return'    '+s
        }
    }
    Vim.prototype.yank=function(type,content){
        this.pasteBoard.type=type
        this.pasteBoard.content=content
        localStorage.setItem('pasteBoard_vimontheweb',CryptoJS.AES.encrypt(
            JSON.stringify(this.pasteBoard),
            this.password,
            {format:JsonFormatter}
        ))
    }
    Vim.prototype.gotoNextMatch=function(){
        let selectionEnd=this.textarea.selectionEnd
        this.textarea.selectionStart=
        this.textarea.selectionEnd=
            this.textarea.value.substring(selectionEnd).search(
                new RegExp(this.searchPattern)
            )+selectionEnd
    }*/
    Vim.prototype.focus=function(){
        this.inputTag.focus()
    }
    Vim.prototype.createViewDiv=createViewDiv
    // begin 2015-09-07
    function linesOf(text){
    /*
        An independent line should not include EOL,
        since it has already been seperated from the others.
    */
        let result=text.split('\n')
        result.pop()
        return result
    }
    // end 2015-09-07
    // begin 2015-09-06
    function getLineStartByCursor(text,cursor){
        return text.substring(0,cursor).lastIndexOf('\n')+1
    }
    function getLineHeadByCursor(text,cursor){
        let lineStart=getLineStartByCursor(text,cursor)
        return lineStart+text.substring(lineStart).search(/[^ ]/)
    }
    // end 2015-09-06
    return Vim
})
