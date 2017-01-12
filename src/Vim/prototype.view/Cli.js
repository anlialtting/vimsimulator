Promise.all([
    module.repository.EventEmmiter,
    module.shareImport('measureWidth.js'),
]).then(modules=>{
    let
        EventEmmiter=   modules[0],
        measureWidth=   modules[1]
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
    Cli.prototype.clear=function(){
        this._children=[]
        this.emit('view')
    }
    Cli.prototype.appendChild=function(c){
        if(
            typeof c=='string'||
            c instanceof Cli
        )
            c={child:c}
        if(!('r' in c))
            c.r=0
        if(!('c' in c))
            c.c=0
        this._children.push(c)
        this.emit('view')
    }
    function View(cli){
        let view=this
        this._cli=cli
        this._children=[]
        this.div=document.createElement('div')
        this.div.className='cli'
        this.div.style.fontSize=`${cli._fontSize}px`
        let div=this.div
        update()
        this._cli.on('view',this._listener=update)
        this.div=div
        function update(){
            div.innerHTML=''
            view.freeChildren()
            cli._children.map(c=>{
                let childDiv=document.createElement('div')
                childDiv.style.position='absolute'
                childDiv.style.top=`${c.r*cli._fontSize}px`
                childDiv.style.left=`${c.c*cli._fontWidth}px`
                for(let i in c.style)
                    childDiv.style[i]=c.style[i]
                if(typeof c.child=='string'){
                    childDiv.textContent=c.child
                }else{
                    let v=c.child.view
                    view._children.push(v)
                    childDiv.appendChild(v.div)
                }
                div.appendChild(childDiv)
            })
        }
    }
    View.prototype.free=function(){
        this._cli.removeListener('view',this._listener)
        this.freeChildren()
    }
    View.prototype.freeChildren=function(){
        this._children.map(c=>{
            c.free()
        })
        this._children=[]
    }
    return Cli
})
