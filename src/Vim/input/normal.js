Promise.all([
    module.shareImport('normal/commands.js'),
    module.shareImport('normal/ascii.js'),
]).then(modules=>{
    let
        commands=   modules[0],
        ascii=      modules[1]
    return(vim,val)=>{
        if(val instanceof KeyboardEvent){
            if(val.key=='Backspace')
                val=ascii.bs
            else if(val.key=='Enter')
                val=ascii.cr
            else if(val.key=='Delete')
                val=ascii.del
            else if(val.ctrlKey&&val.key=='r')
                val=String.fromCharCode(17)+'r'
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
