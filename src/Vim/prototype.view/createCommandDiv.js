Promise.all([
    module.shareImport('htmlEntities.js'),
]).then(modules=>{
    let
        htmlEntities=   modules[0]
    function createCommandDiv(vim){
        let div=document.createElement('div')
        div.style.fontFamily='monospace'
        div.style.fontSize=`${vim._lineHeightInPx}px`
        div.style.lineHeight='1'
        div.style.whiteSpace='pre'
        f()
        vim.on('view',changed=>{
            if(changed.indexOf('mode')<0)
                return
            f()
        })
        return div
        function f(){
            if(vim.mode=='normal')
                div.textContent=''
            else if(vim.mode=='insert')
                div.textContent='-- INSERT --'
            else if(vim.mode=='visual')
                div.textContent='-- VISUAL --'
            else if(vim.mode=='visual-block')
                div.textContent='-- VISUAL BLOCK --'
            else if(vim.mode=='cmdline'){
                update(div)
                vim.on('view',listener)
                function listener(){
                    if(vim.mode=='cmdline')
                        update(div)
                    else
                        vim.removeListener('view',listener)
                }
            }
        }
        function update(div){
            let
                text=vim._modeData.inputBuffer,
                cursor=vim._modeData.cursor.position
            if(cursor==text.length)
                text+=' '
            div.innerHTML=`${
                htmlEntities.encode(text.substring(0,cursor))
            }<span style=background-color:black;color:white>${
                htmlEntities.encode(text.substring(cursor,cursor+1))
            }</span>${
                htmlEntities.encode(text.substring(cursor+1))
            }`
        }
    }
    return createCommandDiv
})
