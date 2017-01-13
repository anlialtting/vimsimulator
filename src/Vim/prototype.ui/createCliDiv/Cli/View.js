Promise.all([
]).then(modules=>{
    function View(cli){
        this._cli=cli
        this._children=[]
        this._divs={}
        this._used=[]
        this._listeners=[]
        this.div=document.createElement('div')
        this.div.className='cli'
        this.div.style.fontSize=`${cli._fontSize}px`
        update(this)
        this._cli.on('view',this._listener=()=>update(this))
    }
    View.prototype.free=function(){
        this._cli.removeListener('view',this._listener)
    }
    function update(view){
        clearUsed(view)
        view._listeners.map(doc=>
            doc.cli.removeListener('view',doc.listener)
        )
        view._listeners=[]
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
            if(typeof c.child=='string'){
                let childDiv=getDiv(view,tr,tc)
                childDiv.style.position='absolute'
                childDiv.style.top=`${tr*cli._fontSize}px`
                childDiv.style.left=`${tc*cli._fontWidth}px`
                for(let i in c.style)
                    childDiv.style[i]=c.style[i]
                childDiv.textContent=c.child
                view._used.push(childDiv)
            }else
                dfs(view,c.child,tr,tc)
        })
        let listener=()=>update(view)
        view._listeners.push({cli,listener})
        cli.on('view',listener)
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
