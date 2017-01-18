function update(view){
    if(view._width)
        view.node.style.width=`${view._width*view._fontWidth}px`
    if(view._height)
        view.node.style.height=`${view._height*view._fontSize}px`
    view._listeners.map(doc=>
        doc.cli.removeListener('view',doc.listener)
    )
    view._listeners=[]
    // bottleneck
    let s=new Date
    {
        let a=dfs(view,view._cli,0,0)
        reuseWrite(view,a,view._previousArray)
        view._previousArray=a
    }
    console.log(new Date-s)
}
function dfs(view,cli,dr,dc,o){
    o||(o={})
    cli._children.map(c=>{
        let tr=dr+c.r,tc=dc+c.c
        if(typeof c.child=='string'){
            o[tr]||(o[tr]={})
            o[tr][tc]=c
        }else
            dfs(view,c.child,tr,tc,o)
    })
    let listener=()=>update(view)
    view._listeners.push({cli,listener})
    cli.on('view',listener)
    return o
}
function reuseWrite(view,a,b){
    let o={}
    for(let r in a)
        for(let c in a[r])
            if(r in b&&c in b[r]&&notEqual(a[r][c],b[r][c]))
                write(view,a[r][c]||'',r,c)
    inNotIn(a,b,(r,c)=>write(view,a[r][c],r,c))
    inNotIn(b,a,(r,c)=>write(view,'',r,c))
    return o
    function set(r,c){
        o[r]||(o[r]={})
        o[r][c]=1
    }
    function notEqual(a,b){
        if(a.child!=b.child)
            return true
        if(a.style!=b.style)
            return true
        return false
    }
    function inNotIn(a,b,f){
        for(let r in a)
            for(let c in a[r])
                if(!(r in b&&c in b[r]))
                    f(r,c)
    }
}
function write(view,doc,r,c){
    let div=getDiv(view,r,c)
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
    function getDiv(view,r,c){
        if(!(r in view._divs))
            view._divs[r]={}
        if(!(c in view._divs[r])){
            let div=document.createElement('div')
            div.style.top=`${r*view._fontSize}px`
            div.style.left=`${c*view._fontWidth}px`
            view._divs[r][c]=div
            view.node.appendChild(div)
        }
        return view._divs[r][c]
    }
}
update
