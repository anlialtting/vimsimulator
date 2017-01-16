if(!module.repository.EventEmmiter)
    module.repository.EventEmmiter=module.importByPath(
        `https://cdn.rawgit.com/anliting/module/${
            '5ddc4f02188066d00a698eea63f983ab1e5b7d4f'
        }/node/events.js`
    )
Promise.all([
    module.repository.EventEmmiter,
    module.shareImport('Vim/prototype.mode.js'),
    module.shareImport('Vim/createCursor.js'),
    module.shareImport('Vim/prototype.input.js'),
    module.shareImport('Vim/prototype.ui.js'),
    module.shareImport('Vim/UndoBranchManager.js'),
    module.style('Vim/style.css'),
    module.shareImport('Vim/prototype._mode.js'),
    module.shareImport('Vim/defaultOptions.js'),
]).then(modules=>{
    let
        EventEmmiter=           modules[0],
        createCursor=           modules[2],
        UndoBranchManager=      modules[5],
        style=                  modules[6],
        defaultOptions=         modules[8]
    function Vim(){
        EventEmmiter.call(this)
        this._values={}
        this._options=Object.create(defaultOptions)
        this._viewChanged=[]
        this._text=''
        this._mode='normal'
        this._modeData={}
        this._cursor=createCursor(this)
        this._undoBranchManager=new UndoBranchManager
        this._undoBranchManager.push('')
        this._fontSize=13
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
    Vim.prototype._write=function(){
        this.emit('write')
        let
            l=this._text.split('\n').length-1,
            c=this._text.length
        return `<EVENT-DRIVEN> ${l}L, ${c}C written`
    }
    Object.defineProperty(Vim.prototype,'_mainUi',{get(){
        return this._values._mainUi||(this._values._mainUi=this.ui)
    }})
    Object.defineProperty(Vim.prototype,'mode',modules[1])
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
    Vim.prototype._welcomeText=`\
              VIM - Vi IMproved

                 version WEB
                by An-Li Ting
 Vim is open source and freely distributable

            Thanks Bram Moolenaar,
       for inventing the original Vim!

type  :q<Enter>               to exit
`
    Vim.style=style
    return Vim
})
