module.rootScript.parentNode.removeChild(module.rootScript)
module.debug=true
;(async()=>{
    let[
        Vim,
        testdata,
        style,
    ]=await Promise.all([
        module.shareImport('../../Vim.js'),
        module.shareImport('testdata.js'),
        module.styleByPath('../a.css'),
    ])
    let vim=new Vim(p=>{
        if(p=='~/.vimrc')
            return localStorage.webvimVimrc
    },p=>{
        if(p=='~/.vimrc')
            localStorage.webvimVimrc=vim.text
    })
    vim.polluteStyle
    vim.polluteCopy
    //vim.text=testdata.fullScreen
    //vim.text=testdata.htmlDoc
    //vim.text=testdata.longText
    //vim.text=testdata.longTextMultiline
    let vimViewDiv=createTestDiv(vim)
    document.head.appendChild(style)
    document.body.appendChild(vimViewDiv)
    vim.once('quit',()=>{
        document.head.removeChild(style)
        document.body.removeChild(vimViewDiv)
    })
    vim.focus()
})()
function createTestDiv(vim){
    let div=document.createElement('div')
    div.className='test'
    div.appendChild(vim.node)
    return div
}
