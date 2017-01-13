Promise.all([
    module.shareImport('viewText/line.js'),
    module.shareImport('viewCursor.js'),
    module.shareImport('../../width.js'),
]).then(modules=>{
    let
        line=       modules[0],
        viewCursor= modules[1],
        width=      modules[2]
    function viewText(view){
        let
            vim=view._vim,
            text=vim._text||'\n',
            vc=viewCursor(vim),
            viewRowsCount=0,
            cursorViewRow
        let res=line.lines(text).map((l,j)=>{
            if(vim._options.list)
                l+='$'
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
            res.start=viewRowsCount
            if(view.width&&l.length){
                res.rows=[]
                for(let i=0;i<l.length;){
                    let start=i,end=calcEnd(i)
                    res.rows.push({
                        start,
                        end,
                        string:l.substring(start,end)
                    })
                    if(j==vc.r&&start<=vc.c&&vc.c<end)
                        cursorViewRow=viewRowsCount
                    viewRowsCount++
                    i=end
                }
                function calcEnd(i){
                    for(
                        let rowWidth=0;
                        rowWidth+width(l[i])<=view.width;
                        rowWidth+=width(l[i++])
                    );
                    return i
                }
            }else{
                if(j==vc.r)
                    cursorViewRow=viewRowsCount
                res.rows=[{
                    start:0,
                    end:l.length,
                    string:l
                }]
                viewRowsCount++
            }
            res.end=viewRowsCount
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
