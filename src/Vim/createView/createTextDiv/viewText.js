Promise.all([
    module.shareImport('line.js'),
    module.shareImport('viewCursor.js'),
]).then(modules=>{
    let
        line=       modules[0],
        viewCursor= modules[1]
    function viewText(view){
        let
            vim=view._vim,
            text=vim._text||'\n',
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
    return viewText
})
