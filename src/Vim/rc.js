(vim=>{
    let vimrc=vim._read('~/.vimrc')
    if(vimrc==undefined)
        return
    vimrc.split('\n').map(c=>{
        if(!c)
            return
        vim._mode='cmdline'
        vim._modeData.inputBuffer=':'
        vim._modeData.cursor.position=1
        vim.input=c
        vim.input={key:'Enter'}
    })
})
