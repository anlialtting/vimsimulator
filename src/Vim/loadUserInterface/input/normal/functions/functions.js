(async()=>{
    function insertAt(s,t,c){
        return t.substring(0,c)+s+t.substring(c)
    }
    function yank(vim,r,m,s){
        vim._setRegister(r,{mode:m,string:s})
    }
    function put(vim,c,s){
        vim._text=insertAt(s,vim._trueText,c)
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
        let txt=vim._trueText
        yank(vim,r,'string',txt.substring(a,b))
        vim._text=txt.substring(0,a)+txt.substring(b)
        vim._cursor.moveTo(a)
    }
    function deleteLinewise(vim,r,a,b){
        let txt=vim._trueText
        yank(vim,r,'line',txt.substring(a,b))
        vim._text=txt.substring(0,a)+txt.substring(b)
    }
    return{
        yank,
        putCharacterwise,
        putLinewise,
        deleteCharacterwise,
        deleteLinewise,
    }
})()

