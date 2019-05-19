let ctx=document.createElement('canvas').getContext('2d')
export default(size,s)=>{
    if(s==undefined)
        s='a'
    ctx.font=`${size}px monospace`
    return ctx.measureText(s).width
}
