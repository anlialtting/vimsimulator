module.shareImport('measureWidth.js').then(measureWidth=>{
    return(vim=>{
        let input=document.createElement('input')
        input.style.position='absolute'
        input.style.fontFamily='monospace'
        input.style.border=0
        input.style.padding=0
        input.style.fontSize=`${vim._lineHeightInPx}px`
        input.style.backgroundColor='rgba(0,0,0,0)'
        //input.style.height=0
        let composing=false
        input.addEventListener('blur',()=>{
            vim.view()
        })
        input.addEventListener('compositionstart',e=>{
            composing=true
        })
        input.addEventListener('compositionend',e=>{
            vim.imInput=''
            composing=false
            f()
        })
        input.addEventListener('focus',()=>{
            vim.view()
        })
        input.addEventListener('input',()=>{
            f()
        })
        input.addEventListener('keydown',e=>{
            if(composing)
                return
            if(e.key=='Backspace')
                vim.command+=String.fromCharCode(8)
            else if(e.key=='Enter')
                vim.command+=String.fromCharCode(13)
            else if(
                e.key=='Escape'||
                e.ctrlKey&&e.key=='c'||
                e.ctrlKey&&e.key=='['
            )
                vim.command+=String.fromCharCode(27)
            else if(e.key=='Delete')
                vim.command+=String.fromCharCode(127)
            else if(e.ctrlKey&&e.key=='r')
                vim.command+=String.fromCharCode(17)+'r'
            else
                return
            e.preventDefault()
            e.stopPropagation()
        })
        return input
        function f(){
            if(composing){
                vim.imInput=input.value
                vim.view()
            }else{
                vim.command+=input.value
                input.value=''
            }
            input.style.width=`${measureWidth(vim,input.value)}px`
        }
    })
})
