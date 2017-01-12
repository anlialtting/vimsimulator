module.repository.Cli=module.shareImport('prototype.view/Cli.js')
Promise.all([
    module.shareImport('prototype.view/createTextDiv.js'),
    module.shareImport('prototype.view/measureWidth.js'),
    module.shareImport('prototype.view/createInput.js'),
    module.shareImport('prototype.view/createCliDiv.js'),
]).then(modules=>{
    let
        createTextDiv=      modules[0],
        measureWidth=       modules[1],
        createInput=        modules[2],
        createCliDiv=       modules[3]
    function View(vim){
        this._vim=vim
        this._scroll=0
        this._inputTag=createInput(this._vim)
        this.div=createViewDiv(this)
    }
    Object.defineProperty(View.prototype,'width',{set(val){
        this._width=val
        //this._cli.width=this._width
        this.div.style.width=`${
            measureWidth(this._vim._fontSize)*this._width
        }px`
    },get(){
        return this._width
    }})
    Object.defineProperty(View.prototype,'height',{set(val){
        this._height=val
        //this._cli.height=this._height
        this.div.style.height=`${this._vim._fontSize*this._height}px`
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
        div.className='webvim'
        div.appendChild(createTextDiv(view))
        div.appendChild(view._inputTag)
        div.appendChild(createCliDiv(view))
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
    return{get(){
        return new View(this)
    }}
})
