Promise.all([
    module.repository.EventEmmiter,
    module.shareImport('measureWidth.js'),
    module.shareImport('charWidth.js'),
    module.shareImport('Cli/View.js'),
]).then(modules=>{
    let
        EventEmmiter=   modules[0],
        measureWidth=   modules[1],
        charWidth=      modules[2],
        View=           modules[3]
    function Cli(){
        EventEmmiter.call(this)
        this._children=[]
        this._fontSize=13
        this._fontWidth=measureWidth(13)
    }
    Object.setPrototypeOf(Cli.prototype,EventEmmiter.prototype)
    Object.defineProperty(Cli.prototype,'view',{get(){
        return new View(this)
    }})
    Cli.prototype.flush=function(){
        if(this._flushed)
            return
        this.emit('view')
        this._flushed=true
    }
    Cli.prototype.clear=function(){
        this._flushed=false
        this._children=[]
    }
    Cli.prototype.appendChild=function(child){
        this._flushed=false
        if(
            typeof child=='string'||
            child instanceof Cli
        )
            child={child}
        if(!('r' in child))
            child.r=0
        if(!('c' in child))
            child.c=0
        if(typeof child.child=='string'){
            let r=0,c=0
            for(let i=0;i<child.child.length;i++){
                let chr=child.child[i]
                this._children.push({
                    child:chr,
                    r:child.r+r,
                    c:child.c+c,
                    style:child.style,
                })
                if(chr=='\n'){
                    r++
                    c=0
                }else
                    c+=charWidth(chr)
            }
        }else
            this._children.push(child)
    }
    return Cli
})
