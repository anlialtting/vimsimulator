let shortcut={
    nu:'number',
}
function main(vim,val){
    let enter=false
    if(typeof val=='object'){
        if(val.key=='ArrowLeft')
            vim._modeData.cursor.position--
        else if(val.key=='ArrowRight')
            vim._modeData.cursor.position++
        else if(val.key=='Backspace')
            vim._modeData.cursor.backspace
        else if(val.key=='Delete')
            vim._modeData.cursor.delete
        else if(val.key=='End')
            vim._modeData.cursor.end
        else if(val.key=='Enter')
            enter=true
        else if(
            val.key=='Escape'||
            val.ctrlKey&&val.key=='c'||
            val.ctrlKey&&val.key=='['
        )
            return vim.mode='normal'
        else if(val.key=='Home')
            vim._modeData.cursor.home
    }else if(typeof val=='string'){
        vim._modeData.inputBuffer=
            vim._modeData.inputBuffer.substring(
                0,vim._modeData.cursor.position
            )+
            val+
            vim._modeData.inputBuffer.substring(
                vim._modeData.cursor.position
            )
        vim._modeData.cursor.position+=val.length
    }
    let cmd=vim._modeData.inputBuffer
    if(!cmd)
        return vim.mode='normal'
    if(!enter)
        return
    if(cmd[0]==':'){
        cmd=cmd.substring(1)
        let setPattern=/^set?(.*)/
        if(setPattern.test(cmd)){
            set(vim,cmd.match(setPattern)[1])
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
function set(vim,cmd){
    let argumentPattern=/ (.*)/
    if(argumentPattern.test(cmd)){
        cmd=cmd.match(argumentPattern)[1]
        let
            showValuePattern=   /(.*)\?$/,
            noPattern=          /^no(.*)/,
            show=       false,
            no=         false,
            toSet=      false
        if(showValuePattern.test(cmd)){
            show=true
            cmd=cmd.match(showValuePattern)[1]
        }else{
            toSet=true
            if(noPattern.test(cmd)){
                no=true
                cmd=cmd.match(noPattern)[1]
            }
        }
        if(cmd in shortcut)
            cmd=shortcut[cmd]
        if(toSet){
            if(cmd in vim._options)
                vim._options[cmd]=!no
        }else if(show)
            console.log(vim._options[cmd]?
                cmd
            :
                `no${cmd}`
            )
    }
}
((vim,val)=>{
    let r=main(vim,val)
    vim._view()
    return r
})
