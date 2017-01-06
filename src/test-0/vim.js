module.styleByPath('vim.css')
module.debug=true
module.shareImport('../Vim.js').then(Vim=>{
    let
        div=document.createElement('div')
    div.style.border='1px solid'
    div.style.width='min-content'
    div.style.margin='0 auto'
    let vim=createVim()
    let view=vim.createView()
    view.width=80
    view.height=24
    div.appendChild(view.div)
    document.body.appendChild(div)
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
    </body>
</html>
`
        return vim
    }
})
