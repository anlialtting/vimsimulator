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
        clearUsed(view)
        view.freeChildren()
        dfs(view,view._cli,0,0)
    }
    function clearUsed(view){
        view._used.map(d=>{
            d.removeAttribute('style')
            d.innerHTML=''
        })
        view._used=[]
    }
    function dfs(view,cli,dr,dc){
        cli._children.map(c=>{
            let tr=dr+c.r,tc=dc+c.c
            let childDiv=getDiv(view,tr,tc)
            childDiv.style.position='absolute'
            childDiv.style.top=`${tr*cli._fontSize}px`
            childDiv.style.left=`${tc*cli._fontWidth}px`
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
        function getDiv(view,r,c){
            if(!(r in view._divs))
                view._divs[r]={}
            if(!(c in view._divs[r]))
                view.div.appendChild(
                    view._divs[r][c]=document.createElement('div')
                )
            return view._divs[r][c]
        }
    }
    return View
})
