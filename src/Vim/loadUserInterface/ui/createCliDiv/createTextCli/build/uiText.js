function checkScroll(ui,cursorViewRow){
    if(ui._wrapMethodData._scroll+ui.height-1<=cursorViewRow)
        ui._wrapMethodData._scroll=cursorViewRow-(ui.height-1)+1
    if(cursorViewRow<ui._wrapMethodData._scroll)
        ui._wrapMethodData._scroll=cursorViewRow
}
function uiText(ui,targetWidth,vc){
    let txt=ui._wrapMethodData.text
    txt.wrap(ui._vim._options.list,targetWidth)
    if(ui.height){
        checkScroll(ui,txt.row(vc.abs))
        let scroll=ui._wrapMethodData._scroll
        return txt.uiText(scroll,scroll+ui.height-1)
    }else{
        return txt.uiText()
    }
}
uiText
