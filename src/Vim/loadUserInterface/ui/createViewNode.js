var
    createCliDiv=   module.shareImport('createViewNode/createCliDiv.js')
;(async()=>{
    createCliDiv=   await createCliDiv
    function createViewNode(ui){
        let n=createCliDiv(ui)
        n.classList.add('webvim')
        n.addEventListener('click',()=>
            ui._vim.focus()
        )
        return n
    }
    return createViewNode
})()
