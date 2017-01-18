Promise.all([
    module.shareImport('View/update.js'),
    module.shareImport('../../measureWidth.js'),
]).then(modules=>{
    let
        update=modules[0],
        measureWidth=modules[1]
    function View(cli,fontSize){
        this._cli=cli
        this._fontSize=fontSize
        this._children=[]
        this._divs={}
        this._listeners=[]
        this._previousArray={}
        this._fontWidth=measureWidth(this._fontSize)
        this.node=document.createElement('div')
        this.node.className='cli'
        this.node.style.fontSize=`${this._fontSize}px`
        update(this)
        this._cli.on('view',this._listener=()=>update(this))
    }
    Object.defineProperty(View.prototype,'width',{set(val){
        this._width=val
        update(this)
    },get(){
        return this._width
    }})
    Object.defineProperty(View.prototype,'height',{set(val){
        this._height=val
        update(this)
    },get(){
        return this._height
    }})
    View.prototype.free=function(){
        this._cli.removeListener('view',this._listener)
    }
    return View
})
