module.debug=true
module.outerImport('Vim.js',{
    CryptoJS:()=>module.extract('https://cdn.rawgit.com/sytelus/CryptoJS/7fbfbbee0d005b31746bc5858c70c359e98308e5/rollups/aes.js','CryptoJS')
}).then(Vim=>{
    let vim=new Vim
    vim.setup(document.getElementById('textarea_source'))
    vim.activated=true
    vim.update()
})
