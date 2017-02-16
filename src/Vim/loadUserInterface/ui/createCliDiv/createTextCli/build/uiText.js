function calcRow(txt,pos){
    let res
    txt.map(l=>l.rows.map((r,i)=>{
        if(l.start+r.start<=pos&&pos<l.start+r.end)
            res=l.startRow+i
    }))
    return res
}
function checkScroll(ui,cursorViewRow){
    if(ui._wrapMethodData._scroll+ui.height-1<=cursorViewRow)
        ui._wrapMethodData._scroll=cursorViewRow-(ui.height-1)+1
    if(cursorViewRow<ui._wrapMethodData._scroll)
        ui._wrapMethodData._scroll=cursorViewRow
}
function cut(ui,res){
    let s=ui._wrapMethodData._scroll
    return res.map(l=>{
        if(l.startRow+l.rows.length<=s||s+ui.height-1<=l.startRow)
            return
        l.rows=l.rows.map((r,i)=>{
            if(!(s<=l.startRow+i&&l.startRow+i<s+ui.height-1))
                return
            return r
        }).filter(r=>r!=undefined)
        return l
    }).filter(l=>l!=undefined)
}
var wrap=module.shareImport('uiText/wrap.js')
;(async()=>{
    wrap=await wrap
    function uiText(ui,targetWidth,vc){
        let res=wrap(
            ui._vim._options.list,
            ui._wrapMethodData.text.string,
            targetWidth
        )
        if(ui.height){
            checkScroll(ui,calcRow(res,vc.abs))
            res=cut(ui,res)
        }
        return res
    }
    return uiText
})()
