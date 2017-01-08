(function measureWidth(vim,s){
    let span=document.createElement('span')
    span.style.display='inline-block'
    span.style.fontFamily='monospace'
    span.style.fontSize=`${vim._lineHeightInPx}px`
    span.textContent=s
    document.body.appendChild(span)
    let res=span.clientWidth
    document.body.removeChild(span)
    return res
})
