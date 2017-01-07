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
            text=vim.text||'\n',
            vc=viewCursor(vim),
            viewRowsCount=0,
            cursorViewRow
        let res=line.lines(text).map((l,j)=>{
            if(j==vc.r)
                if(vim.imInput)
                    l=
                        l.substring(0,vc.c)+
                        vim.imInput+
                        l.substring(vc.c)
                else if(vc.c==l.length)
                    l+=' '
            let res={
                index:j
            }
            if(view.width&&l.length){
                res.start=viewRowsCount
                res.rows=[]
                for(let i=0;i*view.width<l.length;i++){
                    res.rows.push(
                        l.substring(i*view.width,(i+1)*view.width)
                    )
                    if(j==vc.r&&i*view.width<=vc.c&&vc.c<(i+1)*view.width)
                        cursorViewRow=viewRowsCount
                    viewRowsCount++
                }
                res.end=viewRowsCount
            }else{
                if(j==vc.r)
                    cursorViewRow=viewRowsCount
                res.start=viewRowsCount
                res.rows=[l]
                viewRowsCount++
                res.end=viewRowsCount
            }
            return res
        })
        if(view.height){
            if(view._scroll+view.height-1<=cursorViewRow)
                view._scroll=cursorViewRow-(view.height-1)+1
            if(cursorViewRow<view._scroll)
                view._scroll=cursorViewRow
            res=res.map(l=>{
                if(
                    l.end<=view._scroll||
                    view._scroll+view.height-1<=l.start
                )
                    return
                l.rows=l.rows.map((r,i)=>{
                    if(!(
                        view._scroll<=l.start+i&&
                        l.start+i<view._scroll+view.height-1
                    ))
                        return
                    return r
                }).filter(r=>r!=undefined)
                return l
            }).filter(l=>l!=undefined)
        }
        return res
    }
    function highlight(view,text){
        let
            vim=view._vim,
            vc=viewCursor(vim),
            res=[]
        text.map(l=>{
            if(!l.rows.length)
                return res.push('')
            l.rows.map((row,j)=>{
                if(!(
                    document.activeElement==vim.inputTag&&l.index==vc.r&&(
                        !view.width||
                        j*view.width<=vc.c&&vc.c<(j+1)*view.width
                    )
                ))
                    return res.push(htmlEntities.encode(row))
                let viewC=view.width?vc.c-j*view.width:vc.c
                res.push(`${
                    htmlEntities.encode(row.substring(0,viewC))
                }<span
                    class=cursor
                    style=background-color:black;color:white>${
                    htmlEntities.encode(row[viewC])
                }</span>${
                    htmlEntities.encode(row.substring(viewC+1))
                }`)
            })
        })
        while(res.length<view.height-1)
            res.push('~')
        return res.map(s=>s+'\n').join('')
    }
    function viewCursor(vim){
        let r,c
        if(vim.text){
            r=vim._cursor.r
            c=vim._cursor.c
        }else{
            r=c=0
        }
        return{r,c}
    }
    return createTextDiv
})
