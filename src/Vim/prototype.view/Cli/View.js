Promise.all([
]).then(modules=>{
    function View(cli){
        this._cli=cli
        this._children=[]
        this._divs={}
        this.div=document.createElement('div')
        this.div.className='cli'
        this.div.style.fontSize=`${cli._fontSize}px`
        update(this)
        this._cli.on('view',this._listener=()=>update(this))
        function update(view){
            let div=view.div
            for(let r in view._divs)
                for(let c in view._divs[r]){
                    let div=view._divs[r][c].div
                    div.removeAttribute('style')
                    div.innerHTML=''
                }
            view.freeChildren()
            cli._children.map(c=>{
                if(!(c.r in view._divs))
                    view._divs[c.r]={}
                if(!(c.c in view._divs[c.r])){
                    let d=document.createElement('div')
                    view._divs[c.r][c.c]={
                        div:d
                    }
                    div.appendChild(d)
                }
                let childDiv=view._divs[c.r][c.c].div
                childDiv.style.position='absolute'
                childDiv.style.top=`${c.r*cli._fontSize}px`
                childDiv.style.left=`${c.c*cli._fontWidth}px`
                for(let i in c.style)
                    childDiv.style[i]=c.style[i]
                if(typeof c.child=='string'){
                    childDiv.textContent=c.child
                }else{
                    /*let v=c.child.view
                    view._children.push(v)
                    childDiv.appendChild(v.div)*/
                }
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
    return View
})
