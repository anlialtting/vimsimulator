module.repository.docs=module.shareImport('normal/docs.js')
var functions=module.shareImport('normal/functions.js')
Promise.all([
    module.shareImport('normal/commands.js'),
    module.shareImport('normal/ascii.js'),
]).then(async modules=>{
    let
        commands=   modules[0],
        ascii=      modules[1]
    functions=await functions
    return(vim,val)=>{
        if(typeof val=='object')
            val=object(vim,val)
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
        if(res.function!=undefined&&res.function in functions)
            res=functions[res.function](vim,res)
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
        vim._ui()
    }
    function object(vim,val){
        if(val.ctrlKey){
            if(val.key=='r')
                return String.fromCharCode(17)+'r'
        }else switch(val.key){
            case 'ArrowLeft':
                return 'h'
                break
            case 'ArrowRight':
                return 'l'
            case 'ArrowDown':
                return 'j'
            case 'ArrowUp':
                return 'k'
            case 'Backspace':
                return ascii.bs
            case 'Enter':
                return ascii.cr
            case 'Delete':
                return ascii.del
        }
    }
    function tryCommand(vim,cmd,arg){
        if(cmd=='')
            return{acceptable:true}
        if(cmd[0] in commands)
            return commands[cmd[0]](vim,cmd.substring(1),arg)
    }
})
