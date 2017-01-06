(function createViewVim(vim){
    let
        viewVim=Object.create(vim),
        viewCursor=Object.create(vim._cursor)
    Object.defineProperty(viewVim,'text',{
        set(val){vim.text=val},
        get(){return vim.text||'\n'}
    })
    Object.defineProperty(viewVim,'_cursor',{
        get(){return viewCursor}
    })
    Object.defineProperty(viewCursor,'_vim',{
        get(){return viewVim}
    })
    return viewVim
})
