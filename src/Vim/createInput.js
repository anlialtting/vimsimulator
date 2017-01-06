(function createInput(vim){
    let
        input=document.createElement('input')
    input.style.position='absolute'
    input.style.fontFamily='monospace'
    input.style.border=0
    input.style.padding=0
    input.style.fontSize=`${vim.lineHeightInPx}px`
    input.style.backgroundColor='rgba(0,0,0,0)'
    //input.style.height=0
    let
        composing=false
    input.addEventListener('blur',()=>{
        vim.view()
    })
    input.addEventListener('compositionstart',e=>{
        composing=true
    })
    input.addEventListener('compositionend',e=>{
        vim.imInput=''
        composing=false
    })
    input.addEventListener('focus',()=>{
        vim.view()
    })
    input.addEventListener('input',()=>{
        if(composing){
            vim.imInput=input.value
            vim.view()
        }else{
            vim.command+=input.value
            input.value=''
        }
        input.style.width=`${mesureWidth(input.value)}px`
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
        else
            return
        e.preventDefault()
        e.stopPropagation()
    })
    return input
    function mesureWidth(s){
        let span=document.createElement('span')
        span.style.display='inline-block'
        span.style.fontSize=`${vim.lineHeightInPx}px`
        span.textContent=s
        document.body.appendChild(span)
        let res=span.clientWidth
        document.body.removeChild(span)
        return res
    }
})
