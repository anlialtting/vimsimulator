let
    EventEmmiter=module.arguments.events||module.importByPath('https://cdn.rawgit.com/anliting/module/5ddc4f02188066d00a698eea63f983ab1e5b7d4f/node/events.js')
Promise.all([
    EventEmmiter,
    module.shareImport('Vim/createInput.js'),
    module.shareImport('Vim/Cursor.js'),
    module.shareImport('Vim/command.js'),
    module.shareImport('Vim/createView.js'),
    module.shareImport('Vim/UndoBranchManager.js'),
]).then(modules=>{
    let
        EventEmmiter=           modules[0],
        createInput=            modules[1],
        Cursor=                 modules[2],
        command=                modules[3],
        createView=             modules[4],
        UndoBranchManager=      modules[5]
    function Vim(){
        EventEmmiter.call(this)
        this._values={}
        this._viewChanged=[]
        this._command=''
        this._text=''
        this._mode='normal'
        this._modeData={}
        this._cursor=new Cursor(this)
        this._undoBranchManager=new UndoBranchManager
        this._undoBranchManager.push('')
        this._lineHeightInPx=13
        this._inputTag=createInput(this)
    }
    Object.setPrototypeOf(Vim.prototype,EventEmmiter.prototype)
    Object.defineProperty(Vim.prototype,'mode',{
        set(val){
            this._mode=val
            this._viewChanged.mode=true
            this._modeData={}
        },
        get(){
            return this._mode
        }
    })
    Object.defineProperty(Vim.prototype,'_text',{
        set(val){
            this._values.text=val
            this._viewChanged.text=true
            this.view()
            this.emit('textChange')
        },
        get(){
            return this._values.text
        }
    })
    Object.defineProperty(Vim.prototype,'text',{
        set(val){
            this._text=val
            this._undoBranchManager.clear()
            this._undoBranchManager.push(this._text)
        },
        get(){
            return this._text
        }
    })
    Object.defineProperty(Vim.prototype,'command',{
        set(val){
            this._command=val
            this._viewChanged.command=true
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
        this.emit('view',Object.keys(this._viewChanged))
        this._viewChanged={}
    }
    Vim.prototype.focus=function(){
        this._inputTag.focus()
    }
    Vim.prototype.createView=createView
    return Vim
})
