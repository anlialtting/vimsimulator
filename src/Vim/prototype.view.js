Promise.all([
    module.shareImport('prototype.view/createTextDiv.js'),
    module.shareImport('prototype.view/measureWidth.js'),
    module.shareImport('prototype.view/createInput.js'),
    module.shareImport('prototype.view/createCommandDiv.js'),
    module.shareImport('prototype.view/Cli.js'),
]).then(modules=>{
    let
        createTextDiv=      modules[0],
        measureWidth=       modules[1],
        createInput=        modules[2],
        createCommandDiv=   modules[3],
        Cli=                modules[4]
    function View(vim){
        this._vim=vim
        this._scroll=0
        this._inputTag=createInput(this._vim)
        this._cli=createCli(this)
        this.div=createViewDiv(this)
    }
    Object.defineProperty(View.prototype,'width',{set(val){
        this._width=val
        this._cli.width=this._width
        this.div.style.width=`${
            measureWidth(this._vim,'a'.repeat(this._width))
        }px`
    },get(){
        return this._width
    }})
    Object.defineProperty(View.prototype,'height',{set(val){
        this._height=val
        this._cli.height=this._height
        this.div.style.height=`${this._vim._lineHeightInPx*this._height}px`
    },get(){
        return this._height
    }})
    View.prototype.focus=function(){
        this._inputTag.focus()
    }
    function createViewDiv(view){
        let
            vim=view._vim,
            div=document.createElement('div')
        div.style.position='relative'
        div.appendChild(createTextDiv(view))
        div.appendChild(createCommandDiv(vim))
        div.appendChild(view._inputTag)
        vim.on('view',changed=>{
            let span=div.getElementsByClassName('cursor')[0]
            if(span){
                let rect=span.getBoundingClientRect()
                view._inputTag.style.left=`${rect.left}px`
                view._inputTag.style.top=`${rect.top}px`
            }
        })
        return div
    }
    function createCli(view){
        let cli=new Cli
        return cli
    }
    return{get(){
        return new View(this)
    }}
})
