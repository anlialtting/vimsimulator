function checkScroll(cursorViewRow,height,data){
    if(data._scroll+height-1<=cursorViewRow)
        data._scroll=cursorViewRow-(height-1)+1
    if(cursorViewRow<data._scroll)
        data._scroll=cursorViewRow
}
function uiText(data,targetWidth,vc,height){
    let
        txt=data.text
    txt.width=targetWidth
    txt.wrap()
    checkScroll(txt.row(vc.abs),height,data)
    let scroll=data._scroll
    return txt.uiText(scroll,scroll+height-1)
}
uiText
