module.debug=true
module.import('../src/Vim.js').then(Vim=>{
    let vim=new Vim
    document.body.appendChild(vim.createViewDiv())
    vim.text=`hello, world
<html>
    <head>
        <title>Title</title>
    </head>
    <body>
    </body>
</html>
`
    vim.focus()
})
