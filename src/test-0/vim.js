module.styleByPath('vim.css')
module.debug=true
module.shareImport('../Vim.js').then(Vim=>{
    let
        div=document.createElement('div')
    div.style.backgroundColor='gray'
    div.style.width='600px'
    div.style.margin='0 auto'
    let vim=createVim()
    div.appendChild(vim.createView().div)
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
