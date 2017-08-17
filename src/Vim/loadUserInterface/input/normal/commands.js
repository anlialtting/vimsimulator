(async()=>{
    let[
        letters,
        shift,
        docs,
    ]=await Promise.all([
        module.shareImport('commands/letters.js'),
        module.repository.shift,
        module.repository.docs,
    ])
    function lt(vim,cmd,arg){
        if(cmd=='')
            return docs.a
        if(cmd=='<'){
            arg||(arg=1)
            shift.left(vim,vim._trueCursor.r,vim._trueCursor.r+arg)
            return docs.acc
        }
    }
    function gt(vim,cmd,arg){
        if(cmd=='')
            return docs.a
        if(cmd=='>'){
            arg||(arg=1)
            shift.right(vim,vim._trueCursor.r,vim._trueCursor.r+arg)
            return docs.acc
        }
    }
    function dot(vim,cmd,arg){
        return docs.ac
    }
    function colon(vim){
        vim._mode='cmdline'
        vim._modeData.inputBuffer=':'
        vim._modeData.cursor.position=1
        return docs.a
    }
    function slash(vim){
        vim._mode='cmdline'
        vim._modeData.inputBuffer='/'
        vim._modeData.cursor.position=1
        return docs.a
    }
    function caret(vim){
        vim._trueCursor.moveTo(vim._trueCursor.lineStart)
        return docs.ac
    }
    function dollarSign(vim){
        vim._trueCursor.moveTo(Math.max(
            vim._trueCursor.lineStart,
            vim._trueCursor.lineEnd-2
        ))
        return docs.ac
    }
    function ctrl(vim,cmd){
        if(cmd=='')
            return docs.a
        if(cmd=='r'){
            if(vim._undoBranchManager.current.next!=undefined){
                vim._undoBranchManager.current=
                    vim._undoBranchManager.current.next
                vim._text=vim._undoBranchManager.current.text
            }
            return docs.ac
        }
    }
    function quotationMark(vim,cmd,arg){
        if(cmd=='')
            return docs.a
        let register=cmd[0]
        cmd=cmd.substring(1)
        if(cmd=='')
            return docs.a
        let count=arg||1
        if(cmd=='P')
            return{function:'P',register,count}
        if(cmd=='p')
            return{function:'p',register,count}
        if(cmd=='d'||cmd=='y')
            return docs.a
        if(cmd=='dd')
            return{function:'dd',register,count}
        if(cmd=='yy')
            return{function:'yy',register,count}
    }
    let commands=Object.assign({
        '<':lt,
        '>':gt,
        '.':dot,
        ':':colon,
        '/':slash,
        '^':caret,
        '$':dollarSign,
        '"':quotationMark,
    },letters)
    commands[String.fromCharCode(17)]=ctrl
    return commands
})()
