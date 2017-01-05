module.debug=true
module.shareImport('../Vim.js').then(Vim=>{
    let vim=new Vim
    document.body.appendChild(vim.createViewDiv())
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
    vim.focus()
})
