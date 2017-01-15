Promise.all([
    module.shareImport('update.js'),
]).then(modules=>{
    let update=modules[0]
    function View(cli){
        this._cli=cli
        this._children=[]
        this._divs={}
        this._listeners=[]
        this._used=[]
        this.node=document.createElement('div')
        this.node.className='cli'
        this.node.style.fontSize=`${cli._fontSize}px`
        update(this)
        this._cli.on('view',this._listener=()=>update(this))
    }
    View.prototype.free=function(){
        this._cli.removeListener('view',this._listener)
    }
    return View
})
