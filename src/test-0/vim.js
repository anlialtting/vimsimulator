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
    let vim=createVim()
    let vimViewDiv=createTestDiv(vim)
    document.head.appendChild(style)
    document.head.appendChild(vim.style)
    document.body.appendChild(vimViewDiv)
    vim.on('quit',()=>{
        document.head.removeChild(style)
        document.head.removeChild(vim.style)
        document.body.removeChild(vimViewDiv)
    })
    vim.focus()
    function createVim(){
        let vim=new Vim
        //vim.text=testdata.longText
        return vim
    }
})
function createTestDiv(vim){
    let div=document.createElement('div')
    div.className='test'
    div.addEventListener('click',()=>
        vim.focus()
    )
    vim.width=80
    vim.height=24
    div.appendChild(vim.node)
    return div
}
