;(async()=>{
    let[
        createCliDiv,
    ]=await Promise.all([
        module.shareImport('createViewNode/createCliDiv.js'),
    ])
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
