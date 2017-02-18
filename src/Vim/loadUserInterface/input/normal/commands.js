Promise.all([
    module.shareImport('commands/uppercases.js'),
    module.shareImport('commands/lowercases.js'),
    module.repository.shift,
]).then(async modules=>{
    let
        uppercases=     modules[0],
        lowercases=     modules[1],
        shift=          modules[2],
        docs=           await module.repository.docs
    function lt(vim,cmd,arg){
        if(cmd=='')
            return docs.a
        if(cmd=='<'){
            arg||(arg=1)
            shift.left(vim,vim._cursor.r,vim._cursor.r+arg)
            return docs.acc
        }
    }
    function gt(vim,cmd,arg){
        if(cmd=='')
            return docs.a
        if(cmd=='>'){
            arg||(arg=1)
            shift.right(vim,vim._cursor.r,vim._cursor.r+arg)
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
        vim._cursor.moveTo(vim._cursor.lineStart)
        return docs.ac
    }
    function dollarSign(vim){
        vim._cursor.moveTo(Math.max(
            vim._cursor.lineStart,
            vim._cursor.lineEnd-2
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
    let commands={
        A:uppercases.A,
        D:uppercases.D,
        G:uppercases.G,
        I:uppercases.I,
        O:uppercases.O,
        P:uppercases.P,
        X:uppercases.X,
        a:lowercases.a,
        d:lowercases.d,
        g:lowercases.g,
        h:lowercases.h,
        i:lowercases.i,
        j:lowercases.j,
        k:lowercases.k,
        l:lowercases.l,
        n:lowercases.n,
        o:lowercases.o,
        p:lowercases.p,
        r:lowercases.r,
        u:lowercases.u,
        v:lowercases.v,
        x:lowercases.x,
        y:lowercases.y,
        '<':lt,
        '>':gt,
        '.':dot,
        ':':colon,
        '/':slash,
        '^':caret,
        '$':dollarSign,
        '"':quotationMark,
    }
    commands[String.fromCharCode(17)]=ctrl
    return commands
})
