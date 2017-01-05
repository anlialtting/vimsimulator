(function(vim){
    if(vim.command==='d'){
        vim.command_vd()
        vim.command=''
    }else if(vim.command==='y'){
        vim.command_vy()
        vim.command=''
    }else if(vim.command==='<'){
        vim.command_vlt()
        vim.command=''
    }else if(vim.command==='>'){
        vim.command_vgt()
        vim.command=''
    }
})
