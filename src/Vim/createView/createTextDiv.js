Promise.all([
    module.shareImport('createTextDiv/htmlEntities.js'),
    module.shareImport('createTextDiv/line.js'),
]).then(modules=>{
    let
        htmlEntities=modules[0],
        line=modules[1]
    let modes={
        normal,insert,cmdline
    }
    function createTextDiv(view){
        let vim=view._vim
        let div=document.createElement('div')
        div.style.fontFamily='monospace'
        div.style.fontSize=`${vim.lineHeightInPx}px`
        div.style.lineHeight='1'
        div.style.whiteSpace='pre'
        f()
        vim.on('view',f)
        return div
        function f(){
            if(vim.mode in modes)
                modes[vim.mode](view,div)
        }
    }
    function normal(view,div){
        let
            vim=view._vim,
            text=viewText(view)
        if(document.activeElement!=vim.inputTag)
            return div.textContent=text.map(l=>
                l.map(s=>s+'\n').join('')
            ).join('')
        div.innerHTML=highlight(view,text)
    }
    function insert(view,div){
        // same as normal
        normal(view,div)
    }
    function cmdline(view,div){
        // same as normal
        normal(view,div)
    }
    function viewText(view){
        let
            vim=view._vim,
            text=vim.text||'\n'
        let r,c
        if(vim.text){
            r=vim._cursor.r
            c=vim._cursor.c
        }else{
            r=c=0
        }
        return line.lines(text).map((l,j)=>{
            if(j==r)
                if(vim.imInput)
                    l=
                        l.substring(0,c)+
                        vim.imInput+
                        l.substring(c)
                else if(c==l.length)
                    l+=' '
            if(!view.width)
                return[l]
            let res=[]
            for(let i=0;i*view.width<l.length;i++)
                res.push(l.substring(i*view.width,(i+1)*view.width))
            return res
        })
    }
    function highlight(view,text){
        let vim=view._vim
        let r,c
        if(vim.text){
            r=vim._cursor.r
            c=vim._cursor.c
        }else{
            r=c=0
        }
        let res=[]
        text.map((l,i)=>
            l.map((row,j)=>{
                if(view.width&&i==r&&j*view.width<=c&&c<(j+1)*view.width){
                    let viewC=c-j*view.width
                    res.push(`${
                        htmlEntities.encode(row.substring(0,viewC))
                    }<span class=cursor style=background-color:black;color:white>${
                        htmlEntities.encode(row[viewC])
                    }</span>${
                        htmlEntities.encode(row.substring(viewC+1))
                    }`)
                }else{
                    res.push(htmlEntities.encode(row))
                }
            })
        )
        while(res.length<view.height-1)
            res.push('~')
        return res.map(s=>s+'\n').join('')
    }
    return createTextDiv
})
