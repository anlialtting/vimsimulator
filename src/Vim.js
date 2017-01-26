if(!module.repository.EventEmmiter)
    module.repository.EventEmmiter=module.importByPath(
        `https://cdn.rawgit.com/anliting/module/${
            '5ddc4f02188066d00a698eea63f983ab1e5b7d4f'
        }/node/events.js`
    )
Promise.all([
    module.repository.EventEmmiter,
    module.get('Vim/colors.css'),
    module.shareImport('Vim/createCursor.js'),
    module.shareImport('Vim/prototype.input.js'),
    module.shareImport('Vim/prototype.ui.js'),
    module.shareImport('Vim/UndoBranchManager.js'),
    module.get('Vim/style.css'),
    module.shareImport('Vim/prototype._mode.js'),
    module.shareImport('Vim/defaultOptions.js'),
]).then(modules=>{
    let
        EventEmmiter=           modules[0],
        colors=                 modules[1],
        createCursor=           modules[2],
        UndoBranchManager=      modules[5],
        style=                  modules[6],
        defaultOptions=         modules[8]
    function Vim(read){
        EventEmmiter.call(this)
        this._values={
            mode:'normal'
        }
        this._options=Object.create(defaultOptions)
        this._viewChanged=[]
        this._text=''
        this._registers={}
        this._modeData={}
        this._cursor=createCursor(this)
        this._undoBranchManager=new UndoBranchManager
        this._undoBranchManager.push('')
        this._styleManager=new StyleManager
        this.style=this._styleManager.style
        this.read=read
        rc(this)
    }
    Object.setPrototypeOf(Vim.prototype,EventEmmiter.prototype)
    Object.defineProperty(Vim.prototype,'_mode',modules[7])
    Vim.prototype._quit=function(){
        this.emit('quit')
    }
    Object.defineProperty(Vim.prototype,'_text',{
        set(val){
            if(/[^\n]$/.test(val))
                val+='\n'
            this._values.text=val
            this._viewChanged.text=true
        },get(){
            return this._values.text
        }
    })
    Object.defineProperty(Vim.prototype,'_trueText',{get(){
        return this._values.text||'\n'
    }})
    Vim.prototype._view=function(){
        this.emit('view',Object.keys(this._viewChanged))
        this._viewChanged={}
    }
    Vim.prototype._read=function(path){
        return this.read&&this.read(path)
    }
    Vim.prototype._write=function(){
        this.emit('write',this._registers['%'])
        let
            l=this._text.split('\n').length-1,
            c=this._text.length
        return `${
            this._registers['%']?
                `"${this._registers['%']}"`
            :
                '[Event]'
        } ${l}L, ${c}C written`
    }
    Object.defineProperty(Vim.prototype,'_mainUi',{get(){
        if(!this._values._mainUi){
            this._values._mainUi=this.ui
            this._values._mainUi.width=80
            this._values._mainUi.height=24
        }
        return this._values._mainUi
    }})
    Object.defineProperty(Vim.prototype,'mode',{get(){
        return this._mode
    }})
    Object.defineProperty(Vim.prototype,'text',{
        set(val){
            this._text=val
            this._welcomeText=undefined
            this._undoBranchManager.clear()
            this._undoBranchManager.push(this._text)
            this._view()
        },get(){
            return this._text
        }
    })
    Vim.prototype.focus=function(){
        this._mainUi.focus()
    }
    Object.defineProperty(Vim.prototype,'input',modules[3])
    Object.defineProperty(Vim.prototype,'ui',modules[4])
    Object.defineProperty(Vim.prototype,'node',{get(){
        return this._mainUi.node
    }})
    Object.defineProperty(Vim.prototype,'height',{set(val){
        this._mainUi.height=val
    }})
    Object.defineProperty(Vim.prototype,'width',{set(val){
        this._mainUi.width=val
    }})
    Object.defineProperty(Vim.prototype,'pollute',{get(){
        document.head.appendChild(this.style)
        this.once('quit',()=>{
            document.head.removeChild(this.style)
        })
    }})
    Vim.prototype._welcomeText=`\
                  Web Vim

Thanks Bram Moolenaar for the original Vim!

          type :q<Enter> to exit            
`
    return Vim
    function StyleManager(){
        this.style=document.createElement('style')
        this.style.appendChild(document.createTextNode(style))
        this.style.appendChild(document.createTextNode(colors))
    }
    function rc(vim){
        let vimrc=vim._read('~/.vimrc')
        if(vimrc==undefined)
            return
        vimrc.split('\n').map(c=>{
            if(!c)
                return
            vim._mode='cmdline'
            vim._modeData.inputBuffer=':'
            vim._modeData.cursor.position=1
            vim.input=c
            vim.input={key:'Enter'}
        })
    }
})
