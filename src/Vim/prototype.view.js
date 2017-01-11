Promise.all([
    module.shareImport('prototype.view/createTextDiv.js'),
    module.shareImport('prototype.view/measureWidth.js'),
    module.shareImport('prototype.view/createInput.js'),
    module.shareImport('prototype.view/createCommandDiv.js'),
]).then(modules=>{
    let
        createTextDiv=      modules[0],
        measureWidth=       modules[1],
        createInput=        modules[2],
        createCommandDiv=   modules[3]
    function View(vim){
        this._vim=vim
        this._scroll=0
        this._inputTag=createInput(this._vim)
        createViewDiv(this)
    }
    Object.defineProperty(View.prototype,'width',{set(val){
        this._width=val
        this.div.style.width=`${
            measureWidth(this._vim,'a'.repeat(this.width))
        }px`
    },get(){
        return this._width
    }})
    Object.defineProperty(View.prototype,'height',{set(val){
        this._height=val
        this.div.style.height=`${this._vim._lineHeightInPx*this.height}px`
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
        view.div=div
    }
    return{get(){
        return new View(this)
    }}
})
