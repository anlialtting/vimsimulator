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
    function Ui(vim){
        EventEmmiter.call(this)
        this._values={}
        this._vim=vim
        this._fontSize=13
        this._wrapMethod='a'
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
        if(this._values.wrapMethod=='a'){
            this._wrapMethodData={
                _scroll:0,
            }
        }else if(this._values.wrapMethod=='b'){
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
        let
            vim=ui._vim,
            n=document.createElement('div')
        n.className='webvim'
        n.appendChild(createCliDiv(ui))
        ui._inputTag=createInput(ui)
        n.appendChild(ui._inputTag)
        vim.on('view',changed=>{
            if(!ui._cursor)
                return
            ui._inputTag.style.left=`${
                ui._cursor.c*ui._fontWidth
            }px`
            ui._inputTag.style.top=`${
                ui._cursor.r*ui._fontSize
            }px`
        })
        return n
    }
    return{get(){
        return new Ui(this)
    }}
})
