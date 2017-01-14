Promise.all([
    module.shareImport('commands/uppercases.js'),
    module.shareImport('commands/lowercasesAM.js'),
    module.shareImport('commands/lowercasesNZ.js'),
]).then(modules=>{
    let
        uppercases=     modules[0],
        lowercasesAM=   modules[1],
        lowercasesNZ=   modules[2]
    function lt(vim,cmd,arg){
        if(cmd=='')
            return{acceptable:true}
        if(cmd=='<'){
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
            let
                a=vim._cursor.lineStart,
                b=vim._cursor.lineEnd
            vim._text=
                vim._text.substring(0,a)+
                '\t'+
                vim._text.substring(a,b)+
                vim._text.substring(b)
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
        vim.mode='cmdline'
        vim._modeData.inputBuffer=':'
        vim._modeData.cursor.position=1
        return{acceptable:true}
    }
    function slash(vim){
        vim.mode='cmdline'
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
