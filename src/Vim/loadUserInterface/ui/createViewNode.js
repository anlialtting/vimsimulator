var
    createCliDiv=   module.shareImport('createViewNode/createCliDiv.js')
;(async()=>{
    createCliDiv=   await createCliDiv
    function createViewNode(ui){
        let cliDiv=createCliDiv(ui)
        let n=cliDiv.node
        n.classList.add('webvim')
        n.addEventListener('click',()=>
            ui._vim.focus()
        )
        return cliDiv
    }
    return createViewNode
})()
