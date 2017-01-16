Promise.all([
    module.shareImport('viewText/wrap.js'),
]).then(modules=>{
    let
        wrap=       modules[0]
    function viewText(view,text,targetWidth,vc){
        let res=wrap(view,text,targetWidth,vc)
        if(view.height){
            checkScroll(view,res.cursorViewRow)
            res.res=cut(view,res.res)
        }
        return res.res
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
