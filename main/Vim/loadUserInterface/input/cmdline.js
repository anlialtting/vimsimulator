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
            return vim._mode='normal'
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
        return vim._mode='normal'
    if(!enter)
        return
    let status
    if(cmd[0]==':'){
        cmd=cmd.substring(1)
        let
            setPattern=/^set?(.*)/,
            editPattern=/^e(?:dit)?(.*)/
        if(setPattern.test(cmd)){
            status=set(vim,cmd.match(setPattern)[1])
        }else if(editPattern.test(cmd)){
            status=edit(vim,cmd.match(editPattern)[1])
        }else if(/^q(?:uit)?$/.test(cmd)){
            vim._quit()
        }else if(/^wq$/.test(cmd)){
            vim._write()
            vim._quit()
        }else if(/^w(?:rite)?$/.test(cmd)){
            status=vim._write()
        }
    }else if(cmd[0]=='/'){
    }
    vim._mode='normal'
    if(status)
        vim._modeData.status=status
}
function edit(vim,cmd){
    let argumentPattern=/ (.*)/
    if(argumentPattern.test(cmd)){
        cmd=cmd.match(argumentPattern)[1]
        return vim._edit(cmd)
    }
}
function set(vim,cmd){
    let argumentPattern=/ (.*)/
    if(argumentPattern.test(cmd)){
        cmd=cmd.match(argumentPattern)[1]
        let
            showValuePattern=   /(.*)\?$/,
            argsPattern=        /(.*)[=:](.*)/,
            noPattern=          /^no(.*)/,
            show=       false,
            toSet=      false,
            option,
            value
        if(showValuePattern.test(cmd)){
            show=true
            option=cmd.match(showValuePattern)[1]
        }else if(argsPattern.test(cmd)){
            toSet=true
            option=cmd.match(argsPattern)[1]
            value=parseInt(cmd.match(argsPattern)[2],10)
        }else{
            toSet=true
            if(noPattern.test(cmd)){
                option=cmd.match(noPattern)[1]
                value=false
            }else{
                option=cmd
                value=true
            }
        }
        if(option in shortcut)
            option=shortcut[option]
        if(toSet){
            if(option in vim._options)
                vim._setOption(option,value)
        }else if(show){
            let v=vim._options[option]
            let res=`${v==false?'no':'  '}${option}`
            if(typeof v=='number')
                res+=`=${v}`
            return res
        }
    }
}
export default(vim,val)=>{
    let r=main(vim,val)
    vim._ui()
    return r
}
