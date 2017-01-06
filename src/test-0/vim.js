module.styleByPath('vim.css')
module.debug=true
module.shareImport('../Vim.js').then(Vim=>{
    let div=document.createElement('div')
    div.style.width='min-content'
    div.style.margin='0 auto'
    let vim=createVim()
    let view=vim.createView()
    view.width=80
    view.height=24
    div.appendChild(view.div)
    div.appendChild(createTextarea(vim))
    vim.on('quit',()=>{
        div.removeChild(view.div)
    })
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
        <p>
            存在先於本質
    </body>
</html>
`
        return vim
    }
    function createTextarea(vim){
        let textarea=document.createElement('textarea')
        textarea.style.width=`${13/2*80}px`
        textarea.style.height=`${13*24}px`
        vim.on('view',()=>{
            textarea.value=vim.text
            if(vim.text){
                let c=vim._cursor.abs
                if(vim.mode=='normal'){
                    textarea.selectionStart=c
                    textarea.selectionEnd=c+1
                }else if(vim.mode=='insert'){
                    textarea.selectionStart=c
                    textarea.selectionEnd=c
                }
            }
        })
        return textarea
    }
})
