Promise.all([
    module.shareImport('measureWidth.js'),
    module.shareImport('ascii.js'),
]).then(modules=>{
    let
        measureWidth=   modules[0],
        ascii=          modules[1]
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
