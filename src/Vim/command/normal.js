Promise.all([
    module.shareImport('normal/commands.js'),
]).then(modules=>{
    let
        commands=modules[0]
    return function(vim){
        let
            cmd=vim.command,
            arg
        if(49<=cmd.charCodeAt(0)&&cmd.charCodeAt(0)<58){
            arg=parseInt(cmd,10)
            cmd=cmd.substring(arg.toString().length)
        }
        let res=tryCommand(vim,cmd,arg)||{}
        if(res.acceptable){
            if(res.complete){
                if(res.changed)
                    vim.lastChangingCommand=
                        vim.command
                vim.command=''
            }
        }else{
            vim.command=''
        }
    }
    function tryCommand(vim,cmd,arg){
        if(cmd=='')
            return{acceptable:true}
        if(cmd[0] in commands)
            return commands[cmd[0]](vim,cmd.substring(1),arg)
    }
})
