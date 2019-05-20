import createCliDiv from './createViewNode/createCliDiv.js'
function createViewNode(ui){
    let cliDiv=createCliDiv(ui)
    let n=cliDiv.node
    n.classList.add('webvim')
    n.addEventListener('click',()=>
        ui._vim.focus()
    )
    return cliDiv
}
export default createViewNode
