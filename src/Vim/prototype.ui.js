Promise.all([
    module.shareImport('prototype.ui/createCliDiv.js'),
    module.shareImport('prototype.ui/measureWidth.js'),
    module.repository.EventEmmiter,
]).then(modules=>{
    let
        createCliDiv=       modules[0],
        measureWidth=       modules[1],
        EventEmmiter=       modules[2]
    function Ui(vim){
        EventEmmiter.call(this)
        this._values={}
        this._vim=vim
        this._fontSize=13
        this._wrapMethod='greedy'
        this._refreshMinTime=16
        this.node=createViewNode(this)
        this._vim.on('view',()=>this._update())
    }
    Object.setPrototypeOf(Ui.prototype,EventEmmiter.prototype)
    Object.defineProperty(Ui.prototype,'_fontWidth',{get(){
        return measureWidth(this._fontSize)
    }})
    Ui.prototype._update=function(){
        this.emit('update')
    }
    Object.defineProperty(Ui.prototype,'_wrapMethod',{set(val){
        this._values.wrapMethod=val
        if(this._values.wrapMethod=='greedy'){
            this._wrapMethodData={
                _scroll:0,
            }
        }else if(this._values.wrapMethod=='fixed'){
            this._wrapMethodData={
                _scroll:0,
            }
        }
    },get(){
        return this._values.wrapMethod
    }})
    Object.defineProperty(Ui.prototype,'width',{set(val){
        this._width=val
        this._update()
    },get(){
        return this._width
    }})
    Object.defineProperty(Ui.prototype,'height',{set(val){
        this._height=val
        this._update()
    },get(){
        return this._height
    }})
    Ui.prototype.focus=function(){
        this._inputTag.focus()
    }
    function createViewNode(ui){
        let n=createCliDiv(ui)
        n.classList.add('webvim')
        return n
    }
    return{get(){
        return new Ui(this)
    }}
})
