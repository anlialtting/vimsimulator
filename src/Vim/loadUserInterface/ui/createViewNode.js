var
    createCliDiv=   module.shareImport('createViewNode/createCliDiv.js')
;(async()=>{
    createCliDiv=   await createCliDiv
    function createViewNode(ui){
        let cliDiv=createCliDiv(ui)
        let n=cliDiv.node
        ui.on('update',()=>cliDiv.update())
        ui.on('_clock',()=>cliDiv.flush())
        n.classList.add('webvim')
        n.addEventListener('click',()=>
            ui._vim.focus()
        )
        return n
    }
    return createViewNode
})()
