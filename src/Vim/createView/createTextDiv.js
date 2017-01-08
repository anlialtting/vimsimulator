Promise.all([
    module.shareImport('createTextDiv/htmlEntities.js'),
    module.shareImport('createTextDiv/viewText.js'),
    module.shareImport('createTextDiv/viewCursor.js'),
]).then(modules=>{
    let
        htmlEntities=   modules[0],
        viewText=       modules[1],
        viewCursor=     modules[2]
    function createTextDiv(view){
        let vim=view._vim
        let div=document.createElement('div')
        div.style.fontFamily='monospace'
        div.style.fontSize=`${vim._lineHeightInPx}px`
        div.style.lineHeight='1'
        div.style.whiteSpace='pre'
        f()
        vim.on('view',f)
        return div
        function f(){
            div.innerHTML=highlight(view,viewText(view))
        }
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
                    document.activeElement==vim._inputTag&&l.index==vc.r&&(
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
    return createTextDiv
})
