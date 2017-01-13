Promise.all([
]).then(modules=>{
    function View(cli){
        this._cli=cli
        this._children=[]
        this._divs={}
        this._used=[]
        this.div=document.createElement('div')
        this.div.className='cli'
        this.div.style.fontSize=`${cli._fontSize}px`
        update(this)
        this._cli.on('view',this._listener=()=>update(this))
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
    function update(view){
        let
            div=view.div,
            cli=view._cli
        view._used.map(d=>{
            d.removeAttribute('style')
            d.innerHTML=''
        })
        view._used=[]
        view.freeChildren()
        cli._children.map(c=>{
            if(!(c.r in view._divs))
                view._divs[c.r]={}
            if(!(c.c in view._divs[c.r]))
                div.appendChild(
                    view._divs[c.r][c.c]=document.createElement('div')
                )
            let childDiv=view._divs[c.r][c.c]
            childDiv.style.position='absolute'
            childDiv.style.top=`${c.r*cli._fontSize}px`
            childDiv.style.left=`${c.c*cli._fontWidth}px`
            for(let i in c.style)
                childDiv.style[i]=c.style[i]
            if(typeof c.child=='string')
                childDiv.textContent=c.child
            else{
                let v=c._view||(c._view=c.child.view)
                view._children.push(v)
                childDiv.appendChild(v.div)
            }
            view._used.push(childDiv)
        })
    }
    return View
})
