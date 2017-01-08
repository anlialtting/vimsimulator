Promise.all([
    module.shareImport('measureWidth.js'),
    module.shareImport('ascii.js'),
]).then(modules=>{
    let
        measureWidth=   modules[0],
        ascii=          modules[1]
    return(vim=>{
        let textarea=document.createElement('textarea')
        textarea.style.position='absolute'
        textarea.style.fontFamily='monospace'
        textarea.style.border=0
        textarea.style.padding=0
        textarea.style.fontSize=`${vim._lineHeightInPx}px`
        textarea.style.backgroundColor='rgba(0,0,0,0)'
        textarea.style.height=`${vim._lineHeightInPx+2}px`
        textarea.style.resize='none'
        textarea.style.overflow='hidden'
        let composing=false
        textarea.addEventListener('blur',()=>{
            vim.view()
        })
        textarea.addEventListener('compositionstart',e=>{
            composing=true
        })
        textarea.addEventListener('compositionend',e=>{
            vim.imInput=''
            composing=false
            f()
        })
        textarea.addEventListener('focus',()=>{
            vim.view()
        })
        textarea.addEventListener('input',()=>{
            f()
        })
        textarea.addEventListener('keydown',e=>{
            if(composing)
                return
            if(e.key=='Backspace')
                vim.command+=ascii.bs
            else if(e.key=='Enter')
                vim.command+=ascii.cr
            else if(
                e.key=='Escape'||
                e.ctrlKey&&e.key=='c'||
                e.ctrlKey&&e.key=='['
            )
                vim.command+=ascii.esc
            else if(e.key=='Delete')
                vim.command+=ascii.del
            else if(e.ctrlKey&&e.key=='r')
                vim.command+=String.fromCharCode(17)+'r'
            else
                return
            e.preventDefault()
            e.stopPropagation()
        })
        return textarea
        function f(){
            if(composing){
                vim.imInput=textarea.value
                vim.view()
            }else{
                vim.command+=textarea.value
                textarea.value=''
            }
            let width=measureWidth(vim,textarea.value)
            if(width)
                width++
            textarea.style.width=`${width}px`
        }
    })
})
