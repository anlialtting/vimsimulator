Promise.all([
    module.shareImport('prototype.ui/createCliDiv.js'),
    module.shareImport('prototype.ui/measureWidth.js'),
    module.shareImport('prototype.ui/createInput.js'),
    module.repository.EventEmmiter,
]).then(modules=>{
    let
        createCliDiv=       modules[0],
        measureWidth=       modules[1],
        createInput=        modules[2],
        EventEmmiter=       modules[3]
    function View(vim){
        EventEmmiter.call(this)
        this._vim=vim
        this._scroll=0
        this._inputTag=createInput(this._vim)
        this.div=createViewDiv(this)
        this._vim.on('view',()=>
            this._update()
        )
    }
    Object.setPrototypeOf(View.prototype,EventEmmiter.prototype)
    Object.defineProperty(View.prototype,'width',{set(val){
        this._width=val
        this.div.style.width=`${
            measureWidth(this._vim._fontSize)*this._width
        }px`
        this._update()
    },get(){
        return this._width
    }})
    Object.defineProperty(View.prototype,'height',{set(val){
        this._height=val
        this.div.style.height=`${this._vim._fontSize*this._height}px`
        this._update()
    },get(){
        return this._height
    }})
    View.prototype._update=function(){
        this.emit('update')
    }
    View.prototype.focus=function(){
        this._inputTag.focus()
    }
    function createViewDiv(view){
        let
            vim=view._vim,
            div=document.createElement('div')
        div.className='webvim'
        div.appendChild(createCliDiv(view))
        div.appendChild(view._inputTag)
        /*vim.on('view',changed=>{
            let span=div.getElementsByClassName('cursor')[0]
            if(span){
                let rect=span.getBoundingClientRect()
                view._inputTag.style.left=`${rect.left}px`
                view._inputTag.style.top=`${rect.top}px`
            }
        })*/
        return div
    }
    return{get(){
        return new View(this)
    }}
})
