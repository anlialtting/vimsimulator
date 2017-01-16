Promise.all([
    module.shareImport('commands/uppercases.js'),
    module.shareImport('commands/lowercasesAM.js'),
    module.shareImport('commands/lowercasesNZ.js'),
    module.shareImport('../shift.js'),
]).then(modules=>{
    let
        uppercases=     modules[0],
        lowercasesAM=   modules[1],
        lowercasesNZ=   modules[2],
        shift=          modules[3]
    function lt(vim,cmd,arg){
        if(cmd=='')
            return{acceptable:true}
        if(cmd=='<'){
            arg||(arg=1)
            shift.left(vim,vim._cursor.r,vim._cursor.r+arg)
            return{
                acceptable:true,
                complete:true,
                changed:true,
            }
        }
    }
    function gt(vim,cmd,arg){
        if(cmd=='')
            return{acceptable:true}
        if(cmd=='>'){
            arg||(arg=1)
            shift.right(vim,vim._cursor.r,vim._cursor.r+arg)
            return{
                acceptable:true,
                complete:true,
                changed:true,
            }
        }
    }
    function dot(vim,cmd,arg){
        return{
            acceptable:true,
            complete:true,
        }
    }
    function colon(vim){
        vim._mode='cmdline'
        vim._modeData.inputBuffer=':'
        vim._modeData.cursor.position=1
        return{acceptable:true}
    }
    function slash(vim){
        vim._mode='cmdline'
        vim._modeData.inputBuffer='/'
        vim._modeData.cursor.position=1
        return{acceptable:true}
    }
    function ctrl(vim,cmd){
        if(cmd=='')
            return{
                acceptable:true,
            }
        if(cmd=='r'){
            if(vim._undoBranchManager.current.next!=undefined){
                vim._undoBranchManager.current=
                    vim._undoBranchManager.current.next
                vim._text=vim._undoBranchManager.current.text
            }
            return{
                acceptable:true,
                complete:true,
            }
        }
    }
    let commands={
        A:uppercases.A,
        D:uppercases.D,
        G:uppercases.G,
        I:uppercases.I,
        O:uppercases.O,
        P:uppercases.P,
        X:uppercases.X,
        a:lowercasesAM.a,
        d:lowercasesAM.d,
        g:lowercasesAM.g,
        h:lowercasesAM.h,
        i:lowercasesAM.i,
        j:lowercasesAM.j,
        k:lowercasesAM.k,
        l:lowercasesAM.l,
        n:lowercasesNZ.n,
        o:lowercasesNZ.o,
        p:lowercasesNZ.p,
        r:lowercasesNZ.r,
        u:lowercasesNZ.u,
        v:lowercasesNZ.v,
        x:lowercasesNZ.x,
        y:lowercasesNZ.y,
        '<':lt,
        '>':gt,
        '.':dot,
        ':':colon,
        '/':slash,
    }
    commands[String.fromCharCode(17)]=ctrl
    return commands
})
