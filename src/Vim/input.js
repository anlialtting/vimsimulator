Promise.all([
    module.shareImport('input/normal.js'),
    module.shareImport('input/insert.js'),
    module.shareImport('input/visual.js'),
    module.shareImport('input/cmdline.js'),
    module.shareImport('ascii.js'),
]).then(modules=>{
    let
        modes={
            normal:     modules[0],
            insert:     modules[1],
            visual:     modules[2],
            cmdline:    modules[3],
        },
        ascii=          modules[4]
    return(vim,val)=>{
        if(val instanceof KeyboardEvent){
            if(val.key=='Backspace')
                val=ascii.bs
            else if(val.key=='Enter')
                val=ascii.cr
            else if(
                val.key=='Escape'||
                val.ctrlKey&&val.key=='c'||
                val.ctrlKey&&val.key=='['
            )
                val=ascii.esc
            else if(val.key=='Delete')
                val=ascii.del
            else if(val.ctrlKey&&val.key=='r')
                val=String.fromCharCode(17)+'r'
        }
        modes[vim.mode](vim,val)
    }
})
