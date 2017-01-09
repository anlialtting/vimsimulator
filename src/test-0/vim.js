module.styleByPath('vim.css')
module.debug=true
module.shareImport('../Vim.js').then(Vim=>{
    let div=document.createElement('div')
    div.style.width='min-content'
    div.style.margin='0 auto'
    let vim=createVim()
    let view=vim.view
    let vimViewDiv=createVimViewDiv(view,vim)
    div.appendChild(vimViewDiv)
    vim.on('quit',()=>{
        div.removeChild(vimViewDiv)
    })
    document.body.appendChild(div)
    view.width=80
    view.height=24
    vim.focus()
    function createVim(){
        let vim=new Vim
        vim.text=`<!doctype html>
<html>
    <head>
        <title>Title</title>
    </head>
    <body>
        <!-- this is a comment -->
        <p>
            存在先於本質
    </body>
</html>
`
        return vim
    }
})
function createVimViewDiv(view,vim){
    let div=document.createElement('div')
    div.style.border='1px solid lightgray'
    div.addEventListener('dblclick',()=>{
        vim.focus()
    })
    div.appendChild(view.div)
    return div
}
