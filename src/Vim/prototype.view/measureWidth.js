let ctx=document.createElement('canvas').getContext('2d')
function measureWidth(size,s){
    ctx.font=`${size}px monospace`
    return ctx.measureText(s).width
}
measureWidth
