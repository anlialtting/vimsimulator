module.import('../ascii.js').then(ascii=>{
    function main(vim){
        if(vim.command[vim.command.length-1]==ascii.esc){
            vim.mode='normal'
            vim.command=''
            return
        }
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
    return vim=>{
        let r=main(vim)
        vim._view()
        return r
    }
})
