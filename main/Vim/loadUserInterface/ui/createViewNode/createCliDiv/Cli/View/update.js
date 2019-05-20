import doe from'../../../../../../../../lib/doe.mjs'
function update(view){
    if(view._width)
        view.node.style.width=`${view._width*view._fontWidth}px`
    if(view._height)
        view.node.style.height=`${view._height*view._fontSize}px`
    view._listeners.map(doc=>
        doc.cli.off('view',doc.listener)
    )
    view._listeners=[]
    {
        let a=dfs(view,view._cli,0,0)
        reuseWrite(view,a,view._previousArray)
        view._previousArray=a
    }
}
function dfs(view,cli,dr,dc,o){
    o||(o={})
    cli._children.map(c=>{
        let tr=dr+c.r,tc=dc+c.c
        if(!(0<=tr&&tr<view._height&&0<=tc&&tc<view._width))
            return
        if(typeof c.child=='string'){
            o[tr]||(o[tr]={})
            o[tr][tc]=c
        }else if(typeof c.child=='symbol')
            view.symbols[c.child]={r:tr,c:tc}
        else
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
        if(a.class!=b.class)
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
    let
        div=getDiv(view,r,c),
        textContent=doc.child
    if(textContent=='\n')
        textContent=' '
    doe(div,
        {className:doc.class||''},
        doc.style?
            doe.span(
                {textContent},
                n=>{doe(n.style,doc.style)}
            )
        :
            {textContent}
    )
    function getDiv(view,r,c){
        if(!(r in view._divs))
            view._divs[r]={}
        if(!(c in view._divs[r])){
            doe(view.node,
                view._divs[r][c]=doe.div(n=>{doe(n.style,{
                    top:`${r*view._fontSize}px`,
                    left:`${c*view._fontWidth}px`,
                })})
            )
        }
        return view._divs[r][c]
    }
}
export default update
