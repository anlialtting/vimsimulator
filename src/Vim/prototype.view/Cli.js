Promise.all([
    module.repository.EventEmmiter,
    module.shareImport('measureWidth.js'),
]).then(modules=>{
    let
        EventEmmiter=   modules[0],
        measureWidth=   modules[1]
    function Cli(){
        this._children=[]
        this._fontSize=13
        this._fontWidth=measureWidth(13)
    }
    Object.setPrototypeOf(Cli.prototype,EventEmmiter.prototype)
    Object.defineProperty(Cli.prototype,'view',{get(){
        let div=document.createElement('div')
        div.className='cli'
        div.style.fontSize=`${this._fontSize}px`
        this.on('view',()=>{
            div.innerHTML=''
            this._children.map(c=>{
                let childDiv=document.createElement('div')
                childDiv.style.position='absolute'
                childDiv.style.top=`${c.r*this._fontSize}px`
                childDiv.style.left=`${c.c*this._fontWidth}px`
                for(let i in c.style)
                    childDiv.style[i]=c.style[i]
                childDiv.textContent=c.child
                div.appendChild(childDiv)
            })
        })
        return div
    }})
    Cli.prototype.clear=function(){
        this._children=[]
        this.emit('view')
    }
    Cli.prototype.appendChild=function(c){
        if(typeof c=='string')
            c={child:c}
        if(!('r' in c))
            c.r=0
        if(!('c' in c))
            c.c=0
        this._children.push(c)
        this.emit('view')
    }
    return Cli
})
