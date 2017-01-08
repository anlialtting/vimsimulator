function main(vim){
    if(vim.command[0]==':'){
        if(/\r$/.test(vim.command)){
            for(let i=1;i<vim.command.length;i++){
                if(vim.command[i]=='q')
                    vim.emit('quit')
                if(vim.command[i]=='w')
                    vim.emit('write')
            }
            vim.command=''
            vim.mode='normal'
        }
    }
    if(vim.command[0]=='/'){
        if(/\r$/.test(vim.command)){
            /*
            vim.searchPattern=vim.command.substring(1)
            vim.gotoNextMatch()
            */
            vim.command=''
        }
    }
}
(vim=>{
    let r=main(vim)
    vim.view()
    return r
})
