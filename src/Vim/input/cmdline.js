module.import('../ascii.js').then(ascii=>{
    function main(vim,val){
        if(!('command' in vim._modeData))
            vim._modeData.command=''
        vim._modeData.command+=val
        if(vim._modeData.command[
            vim._modeData.command.length-1
        ]==ascii.esc){
            vim.mode='normal'
            vim._modeData.command=''
            return
        }else if(vim._modeData.command[0]==':'){
            if(/\r$/.test(vim._modeData.command)){
                for(let i=1;i<vim._modeData.command.length;i++){
                    if(vim._modeData.command[i]=='q')
                        vim.emit('quit')
                    if(vim._modeData.command[i]=='w')
                        vim.emit('write')
                }
                vim._modeData.command=''
                vim.mode='normal'
            }
        }else if(vim._modeData.command[0]=='/'){
            if(/\r$/.test(vim._modeData.command)){
                /*
                vim.searchPattern=vim.command.substring(1)
                vim.gotoNextMatch()
                */
                vim._modeData.command=''
            }
        }
    }
    return (vim,val)=>{
        let r=main(vim,val)
        vim._view()
        return r
    }
})
