import doe from'../../../lib/doe.mjs'
import Vim from'../../Vim.js'
import testdata from'./testdata.js'
import style from'../a.js'
let vim=new Vim(p=>{
    if(p=='~/.vimrc')
        return localStorage.webvimVimrc
},p=>{
    if(p=='~/.vimrc')
        localStorage.webvimVimrc=vim.text
})
vim.polluteStyle
vim.polluteCopy
//vim.text=testdata.fullScreen
//vim.text=testdata.htmlDoc
//vim.text=testdata.longText
//vim.text=testdata.longTextMultiline
let vimViewDiv=doe.div({className:'test'},vim.node)
doe.head(doe.style(style))
doe.body(vimViewDiv)
vim.once('quit',()=>{
    doe.head(1,style)
    doe.body(1,vimViewDiv)
})
vim.focus()
