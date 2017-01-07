module.styleByPath('vim.css')
module.debug=true
module.shareImport('../Vim.js').then(Vim=>{
    let div=document.createElement('div')
    div.style.width='min-content'
    div.style.margin='0 auto'
    let vim=createVim()
    let view=vim.createView()
    let vimViewDiv=createVimViewDiv(view,vim)
    div.appendChild(vimViewDiv)
    //div.appendChild(createTextarea(vim))
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
/*function createTextarea(vim){
    let textarea=document.createElement('textarea')
    textarea.style.width=`${13/2*80}px`
    textarea.style.height=`${13*24}px`
    f()
    vim.on('view',f)
    return textarea
    function f(){
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
    }
}*/
