if(!module.repository.EventEmmiter)
    module.repository.EventEmmiter=module.importByPath(
        `https://cdn.rawgit.com/anliting/module/${
            '5ddc4f02188066d00a698eea63f983ab1e5b7d4f'
        }/node/events.js`
    )
Promise.all([
    module.repository.EventEmmiter,
    module.shareImport('Vim/prototype.mode.js'),
    module.shareImport('Vim/VimCursor.js'),
    module.shareImport('Vim/prototype.input.js'),
    module.shareImport('Vim/prototype.ui.js'),
    module.shareImport('Vim/UndoBranchManager.js'),
    module.style('Vim/style.css'),
]).then(modules=>{
    let
        EventEmmiter=           modules[0],
        VimCursor=              modules[2],
        UndoBranchManager=      modules[5],
        style=                  modules[6]
    let defaultOptions={
        expandtab:  false,
        list:       false,
        number:     false,
        shiftwidth: 8,
        tabstop:    8,
    }
    function Vim(){
        EventEmmiter.call(this)
        this._values={}
        this._options=Object.create(defaultOptions)
        this._viewChanged=[]
        this._text=''
        this._mode='normal'
        this._modeData={}
        this._cursor=new VimCursor(this)
        this._undoBranchManager=new UndoBranchManager
        this._undoBranchManager.push('')
        this._fontSize=13
    }
    Object.setPrototypeOf(Vim.prototype,EventEmmiter.prototype)
    Vim.prototype._welcomeText=`\
              VIM - Vi IMproved

                 version WEB
                by An-Li Ting
 Vim is open source and freely distributable

            Thanks Bram Moolenaar,
       for inventing the original Vim!

type  :q<Enter>               to exit
`
    Object.defineProperty(Vim.prototype,'_text',{
        set(val){
            this._values.text=val
            this._viewChanged.text=true
            this._view()
            this.emit('textChange')
        },get(){
            return this._values.text
        }
    })
    Vim.prototype._view=function(){
        this.emit('view',Object.keys(this._viewChanged))
        this._viewChanged={}
    }
    Object.defineProperty(Vim.prototype,'mode',modules[1])
    Object.defineProperty(Vim.prototype,'text',{
        set(val){
            if(/[^\n]$/.test(val))
                val+='\n'
            this._text=val
            this._welcomeText=undefined
            this._undoBranchManager.clear()
            this._undoBranchManager.push(this._text)
        },get(){
            return this._text
        }
    })
    Vim.prototype.focus=function(){
        this._mainUi.focus()
    }
    Object.defineProperty(Vim.prototype,'input',modules[3])
    Object.defineProperty(Vim.prototype,'ui',modules[4])
    Object.defineProperty(Vim.prototype,'_mainUi',{get(){
        return this._values._mainUi||(this._values._mainUi=this.ui)
    }})
    Object.defineProperty(Vim.prototype,'div',{get(){
        return this._mainUi.div
    }})
    Object.defineProperty(Vim.prototype,'height',{set(val){
        this._mainUi.height=val
    }})
    Object.defineProperty(Vim.prototype,'width',{set(val){
        this._mainUi.width=val
    }})
    Vim.prototype._write=function(){
        this.emit('write')
        return `<EVENT-DRIVEN> ${this._text.split('\n').length-1}L, ${
            this._text.length
        }C written`
    }
    Vim.prototype._quit=function(){
        this.emit('quit')
    }
    Vim.style=style
    return Vim
})
