Promise.all([
    module.shareImport('createTextDiv/htmlEntities.js'),
    module.shareImport('createTextDiv/line.js'),
]).then(modules=>{
    let
        htmlEntities=modules[0],
        line=modules[1]
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
            div.innerHTML=highlight(view,viewText(view))
        }
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
        let
            viewRowsCount=0,
            cursorViewRow
        let res=line.lines(text).map((l,j)=>{
            if(j==r)
                if(vim.imInput)
                    l=
                        l.substring(0,c)+
                        vim.imInput+
                        l.substring(c)
                else if(c==l.length)
                    l+=' '
            if(view.width&&l.length){
                let res=[]
                for(let i=0;i*view.width<l.length;i++){
                    res.push(l.substring(i*view.width,(i+1)*view.width))
                    if(j==r&&i*view.width<=c&&c<(i+1)*view.width)
                        cursorViewRow=viewRowsCount
                    viewRowsCount++
                }
                return res
            }else{
                if(j==r)
                    cursorViewRow=viewRowsCount
                viewRowsCount++
                return[l]
            }
        })
        if(view.height){
            while(view._scroll+view.height-1<=cursorViewRow)
                view._scroll++
            if(cursorViewRow<view._scroll)
                view._scroll=cursorViewRow
        }
        for(let i=0;i<view._scroll;){
            i+=res[0].length||1
            res.shift()
        }
        return res
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
        text.map((l,i)=>{
            if(!l.length)
                return res.push('')
            l.map((row,j)=>{
                if(
                    document.activeElement==vim.inputTag&&
                    i==r&&
                    (!view.width||j*view.width<=c&&c<(j+1)*view.width)
                ){
                    let viewC=view.width?c-j*view.width:c
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
        })
        while(res.length<view.height-1)
            res.push('~')
        return res.map(s=>s+'\n').join('')
    }
    return createTextDiv
})
