(async()=>{
    function yank(vim,r,m,s){
        vim._setRegister(r,{mode:m,string:s})
    }
    function put(vim,c,s){
        vim._trueText={
            function:'insert',
            position:c,
            string:s,
        }
    }
    function putCharacterwise(vim,c,s){
        put(vim,c,s)
        vim._cursor.moveTo(c+s.length-1)
    }
    function putLinewise(vim,c,s){
        put(vim,c,s)
        vim._cursor.moveTo(c)
    }
    function deleteCharacterwise(vim,r,a,b){
        yank(vim,r,'string',vim._trueText.substring(a,b))
        vim._trueText={
            function:'delete',
            start:a,
            end:b,
        }
        vim._cursor.moveTo(a)
    }
    function deleteLinewise(vim,r,a,b){
        yank(vim,r,'line',vim._trueText.substring(a,b))
        vim._trueText={
            function:'delete',
            start:a,
            end:b,
        }
    }
    return{
        yank,
        putCharacterwise,
        putLinewise,
        deleteCharacterwise,
        deleteLinewise,
    }
})()

