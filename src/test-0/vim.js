module.rootScript.parentNode.removeChild(module.rootScript)
module.debug=true
Promise.all([
    module.shareImport('../Vim.js'),
    module.styleByPath('vim.css'),
    module.shareImport('testdata.js'),
]).then(modules=>{
    let
        Vim=modules[0],
        style=modules[1],
        testdata=modules[2]
    let vim=new Vim
    //vim.text=testdata.longText
    let vimViewDiv=createTestDiv(vim)
    vim.pollute
    document.head.appendChild(style)
    document.body.appendChild(vimViewDiv)
    vim.once('quit',()=>{
        document.head.removeChild(style)
        document.body.removeChild(vimViewDiv)
    })
    vim.focus()
})
function createTestDiv(vim){
    let div=document.createElement('div')
    div.className='test'
    div.appendChild(vim.node)
    return div
}
