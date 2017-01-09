Promise.all([
    module.shareImport('normal/commands.js'),
]).then(modules=>{
    let commands=modules[0]
    return(vim,val)=>{
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
