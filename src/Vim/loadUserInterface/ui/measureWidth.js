let ctx=document.createElement('canvas').getContext('2d')
;((size,s)=>{
    if(s==undefined)
        s='a'
    ctx.font=`${size}px monospace`
    return ctx.measureText(s).width
})
