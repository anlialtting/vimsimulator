Promise.all([
    module.shareImport('viewText/line.js'),
    module.shareImport('viewCursor.js'),
    module.shareImport('../width.js'),
]).then(modules=>{
    let
        line=       modules[0],
        viewCursor= modules[1],
        width=      modules[2]
    function viewText(view,targetWidth){
        let res=wrap(view,targetWidth)
        if(view.height){
            checkScroll(view,res.cursorViewRow)
            res.res=cut(view,res.res)
        }
        return res.res
    }
    function wrap(view,targetWidth){
        let
            vc=viewCursor(view._vim),
            charCount=0,
            viewRowsCount=0,
            cursorViewRow
        let res=line.lines(view._vim._text||'\n').map((l,j)=>{
            let rawL=l
            if(view._vim._options.list)
                l+='$'
            if(j==vc.r)
                if(view._vim.imInput)
                    l=
                        l.substring(0,vc.c)+
                        view._vim.imInput+
                        l.substring(vc.c)
                else if(vc.c==l.length)
                    l+=' '
            let res={
                index:j
            }
            res.start=charCount
            res.startRow=viewRowsCount
            if(targetWidth&&l.length){
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
                        i<l.length&&rowWidth+width(l[i])<=targetWidth;
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
            res.endRow=viewRowsCount
            charCount+=rawL.length+1
            return res
        })
        return{
            res,
            cursorViewRow
        }
    }
    return viewText
})
function checkScroll(view,cursorViewRow){
    if(view._scroll+view.height-1<=cursorViewRow)
        view._scroll=cursorViewRow-(view.height-1)+1
    if(cursorViewRow<view._scroll)
        view._scroll=cursorViewRow
}
function cut(view,res){
    return res.map(l=>{
        if(
            l.endRow<=view._scroll||
            view._scroll+view.height-1<=l.startRow
        )
            return
        l.rows=l.rows.map((r,i)=>{
            if(!(
                view._scroll<=l.startRow+i&&
                l.startRow+i<view._scroll+view.height-1
            ))
                return
            return r
        }).filter(r=>r!=undefined)
        return l
    }).filter(l=>l!=undefined)
}
