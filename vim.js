module.debug=true
module.import('Vim.js').then(Vim=>{
    let vim=new Vim
    vim.setup(document.getElementById('textarea_source'))
    vim.activated=true
    vim.update()
})
