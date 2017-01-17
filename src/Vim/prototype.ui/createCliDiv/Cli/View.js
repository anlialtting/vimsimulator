Promise.all([
    module.shareImport('update.js'),
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
        this._used=[]
        this._fontWidth=measureWidth(this._fontSize)
        this.node=document.createElement('div')
        this.node.className='cli'
        this.node.style.fontSize=`${this._fontSize}px`
        update(this)
        this._cli.on('view',this._listener=()=>update(this))
    }
    View.prototype.free=function(){
        this._cli.removeListener('view',this._listener)
    }
    return View
})
