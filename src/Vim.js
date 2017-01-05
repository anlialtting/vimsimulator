/*
http://www.truth.sk/vim/vimbook-OPL.pdf
*/
let
    CryptoJS=module.arguments.CryptoJS||module.extractByPath('https://cdn.rawgit.com/sytelus/CryptoJS/7fbfbbee0d005b31746bc5858c70c359e98308e5/rollups/aes.js','CryptoJS',{lazy:true}),
    EventEmmiter=module.arguments.events||module.importByPath('https://cdn.rawgit.com/anliting/module/5ddc4f02188066d00a698eea63f983ab1e5b7d4f/node/events.js')
module=module.share({CryptoJS})
Promise.all([
    module.shareImport('Vim/cursorMoves.js'),
    module.shareImport('Vim/JsonFormatter.js'),
    module.shareImport('Vim/commands.js'),
    module.shareImport('Vim/prototype.update.js'),
    CryptoJS,
    module.shareImport('Vim/setup.js'),
    module.shareImport('Vim/runCommandIfPossible.js'),
    EventEmmiter,
    module.shareImport('Vim/Cursor.js'),
    module.shareImport('Vim/createViewDiv.js'),
    module.shareImport('Vim/createInput.js'),
]).then(modules=>{
    let
        cursorMoves=            modules[0],
        JsonFormatter=          modules[1],
        commands=               modules[2],
        CryptoJS=               modules[4],
        setup=                  modules[5],
        runCommandIfPossible=   modules[6],
        EventEmmiter=           modules[7],
        Cursor=                 modules[8],
        createViewDiv=          modules[9],
        createInput=            modules[10]
    function Vim(){
        EventEmmiter.call(this)
        this._text=''
        this._selectionStart=0
        this._selectionEnd=0
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
    Object.defineProperty(Vim.prototype,'selectionStart',{
        set(val){
            this._selectionStart=val
            this.viewChanged.selectionStart=true
        },
        get(){
            return this._selectionStart
        }
    })
    Object.defineProperty(Vim.prototype,'selectionEnd',{
        set(val){
            this._selectionEnd=val
            this.viewChanged.selectionEnd=true
        },
        get(){
            return this._selectionEnd
        }
    })
    Object.defineProperty(Vim.prototype,'command',{
        set(val){
            this._command=val
            this.viewChanged.command=true
            if(this._command){
                this.runCommandIfPossible()
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
    Vim.prototype.setup=setup
    Vim.prototype.setupPassword=function(password){
        this.password=password
    }
    Vim.prototype.unindent=function(beginLine,endLine){
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
    Vim.prototype.cursorMovesLeft=cursorMoves.left
    Vim.prototype.cursorMovesRight=cursorMoves.right
    Vim.prototype.cursorMovesUp=cursorMoves.up
    Vim.prototype.cursorMovesDown=cursorMoves.down
    Vim.prototype.runCommandIfPossible=runCommandIfPossible
    Vim.prototype.gotoNextMatch=function(){
        let selectionEnd=this.textarea.selectionEnd
        this.textarea.selectionStart=
        this.textarea.selectionEnd=
            this.textarea.value.substring(selectionEnd).search(
                new RegExp(this.searchPattern)
            )+selectionEnd
    }
    Vim.prototype.update=modules[3]
    Vim.prototype.update_pre_editor=function(){
        this.pre_editor.style.backgroundColor=
            this.style.backgroundColor
        this.pre_editor.style.color=
            this.style.color
    }
    Vim.prototype.focus=function(){
        this.inputTag.focus()
    }
    Vim.prototype.createViewDiv=createViewDiv
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
        let lineStart=getLineStartByCursor(text,cursor)
        return lineStart+text.substring(lineStart).search(/[^ ]/)
    }
    // end 2015-09-06
    return Vim
})
