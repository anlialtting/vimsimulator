Promise.all([
    module.shareImport('normal/commands.js'),
    module.shareImport('normal/ascii.js'),
]).then(modules=>{
    let
        commands=   modules[0],
        ascii=      modules[1]
    return(vim,val)=>{
        if(typeof val=='object'){
            if(val.ctrlKey){
                if(val.key=='r')
                    val=String.fromCharCode(17)+'r'
            }else switch(val.key){
                case 'ArrowLeft':
                    val='h'
                    break
                case 'ArrowRight':
                    val='l'
                    break
                case 'ArrowDown':
                    val='j'
                    break
                case 'ArrowUp':
                    val='k'
                    break
                case 'Backspace':
                    val=ascii.bs
                    break
                case 'Enter':
                    val=ascii.cr
                    break
                case 'Delete':
                    val=ascii.del
                    break
            }
        }
        if(!('command' in vim._modeData))
            vim._modeData.command=''
        vim._modeData.command+=val
        let
            cmd=vim._modeData.command,
            arg
        if(49<=cmd.charCodeAt(0)&&cmd.charCodeAt(0)<58){
            arg=parseInt(cmd,10)
            cmd=cmd.substring(arg.toString().length)
        }
        let res=tryCommand(vim,cmd,arg)||{}
        if(res.acceptable){
            if(res.complete){
                if(res.changed)
                    vim._undoBranchManager.push(vim._text)
                if(vim.mode=='normal')
                    vim._modeData.command=''
            }
        }else{
            vim._modeData.command=''
        }
        vim._view()
    }
    function tryCommand(vim,cmd,arg){
        if(cmd=='')
            return{acceptable:true}
        if(cmd[0] in commands)
            return commands[cmd[0]](vim,cmd.substring(1),arg)
    }
})
