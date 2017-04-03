(async()=>{
    let[
        measureWidth,
        dom,
    ]=await Promise.all([
        module.repository.measureWidth,
        module.repository.althea.dom,
    ])
    return(ui=>{
        let vim=ui._vim
        let textarea=dom('textarea',{className:'input'})
        textarea.style.fontSize=`${ui._fontSize}px`
        textarea.style.height=`${ui._fontSize+2}px`
        let composing=false
        textarea.addEventListener('blur',()=>{
            vim._ui()
        })
        textarea.addEventListener('compositionstart',e=>{
            composing=true
        })
        textarea.addEventListener('compositionend',e=>{
            composing=false
            f()
        })
        textarea.addEventListener('focus',()=>{
            vim._ui()
        })
        textarea.addEventListener('input',()=>{
            f()
        })
        textarea.addEventListener('keydown',e=>{
            if(composing||!(
                e.key=='ArrowLeft'||
                e.key=='ArrowRight'||
                e.key=='ArrowDown'||
                e.key=='ArrowUp'||
                e.key=='Backspace'||
                e.key=='Delete'||
                e.key=='End'||
                e.key=='Enter'||
                e.key=='Escape'||
                e.key=='Home'||
                e.key=='Tab'||
                e.ctrlKey&&e.key=='c'||
                e.ctrlKey&&e.key=='['||
                e.ctrlKey&&e.key=='r'
            ))
                return
            e.preventDefault()
            e.stopPropagation()
            vim.input=e
        })
        return textarea
        function f(){
            if(composing){
                vim._ui()
            }else{
                vim.input=textarea.value
                textarea.value=''
            }
            let width=measureWidth(ui._fontSize,textarea.value)
            if(width)
                width+=2
            textarea.style.width=`${width}px`
        }
    })
})()
