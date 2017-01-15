function update(view){
    view._listeners.map(doc=>
        doc.cli.removeListener('view',doc.listener)
    )
    view._listeners=[]
    dfs(view,view._cli,0,0)
}
function dfs(view,cli,dr,dc){
    cli._children.map(c=>{
        let tr=dr+c.r,tc=dc+c.c
        if(typeof c.child=='string')
            write(c,tr,tc)
        else
            dfs(view,c.child,tr,tc)
    })
    let listener=()=>update(view)
    view._listeners.push({cli,listener})
    cli.on('view',listener)
    function write(doc,r,c){
        let div=getDiv(view,cli,r,c)
        if(doc.style){
            let span=document.createElement('span')
            for(let i in doc.style)
                span.style[i]=doc.style[i]
            span.textContent=doc.child
            div.textContent=''
            div.appendChild(span)
        }else{
            div.textContent=doc.child
        }
    }
    function getDiv(view,cli,r,c){
        if(!(r in view._divs))
            view._divs[r]={}
        if(!(c in view._divs[r])){
            let div=document.createElement('div')
            div.style.top=`${r*cli._fontSize}px`
            div.style.left=`${c*cli._fontWidth}px`
            view._divs[r][c]=div
            view.node.appendChild(div)
        }
        return view._divs[r][c]
    }
}
update
