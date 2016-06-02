module.debug=true
module.import('../src/Vim.js').then(Vim=>{
    let vim=new Vim
    vim.setup(document.getElementById('textarea_source'))
    vim.activated=true
    vim.update()
})
