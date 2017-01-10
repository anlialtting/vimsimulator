module.import('../ascii.js').then(ascii=>{
    function main(vim,val){
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
        }
        if(val==ascii.esc){
            vim.mode='normal'
            return
        }
        if(val==ascii.bs){
            vim._modeData.inputBuffer=vim._modeData.inputBuffer.substring(
                0,vim._modeData.inputBuffer.length-1
            )
            vim._modeData.cursor--
        }else{
            vim._modeData.inputBuffer=
                vim._modeData.inputBuffer.substring(
                    0,vim._modeData.cursor
                )+
                val+
                vim._modeData.inputBuffer.substring(vim._modeData.cursor)
            vim._modeData.cursor+=val.length
        }
        let cmd=vim._modeData.inputBuffer
        if(!cmd){
            vim.mode='normal'
            return
        }
        if(!/\r$/.test(cmd))
            return
        if(cmd[0]==':'){
            if(/set?/.test(cmd)){
            }else{
                for(let i=1;i<cmd.length;i++){
                    if(cmd[i]=='q')
                        vim.emit('quit')
                    if(cmd[i]=='w')
                        vim.emit('write')
                }
            }
        }else if(cmd[0]=='/'){
        }
        vim.mode='normal'
    }
    return(vim,val)=>{
        let r=main(vim,val)
        vim._view()
        return r
    }
})
