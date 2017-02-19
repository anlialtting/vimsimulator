function uiText(data,targetWidth,vc,height){
    let
        txt=data.text
    let scroll=data._scroll
    return txt.uiText(scroll,scroll+height-1)
}
uiText
