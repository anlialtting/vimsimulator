let
    EventEmmiter=module.arguments.events||module.importByPath('https://cdn.rawgit.com/anliting/module/5ddc4f02188066d00a698eea63f983ab1e5b7d4f/node/events.js')
Promise.all([
    module.shareImport('Vim/createView.js'),
    module.shareImport('Vim/createInput.js'),
    module.shareImport('Vim/Cursor.js'),
    module.shareImport('Vim/command.js'),
    EventEmmiter,
]).then(modules=>{
    let
        createView=             modules[0],
        createInput=            modules[1],
        Cursor=                 modules[2],
        command=                modules[3],
        EventEmmiter=           modules[4]
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
    Vim.prototype.focus=function(){
        this.inputTag.focus()
    }
    Vim.prototype.createView=createView
    return Vim
})
