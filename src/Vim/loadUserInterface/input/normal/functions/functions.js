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
    vim._trueCursor.moveTo(c+s.length-1)
}
function putLinewise(vim,c,s){
    put(vim,c,s)
    vim._trueCursor.moveTo(c)
}
function delete_(a,b){
    vim._trueText={
        function:'delete',
        start:a,
        end:b,
    }
}
function deleteCharacterwise(vim,r,a,b){
    yank(vim,r,'string',vim._trueText.substring(a,b))
    delete_(a,b)
    vim._trueCursor.moveTo(a)
}
function deleteLinewise(vim,r,a,b){
    yank(vim,r,'line',vim._trueText.substring(a,b))
    delete_(a,b)
}
export default{
    yank,
    putCharacterwise,
    putLinewise,
    deleteCharacterwise,
    deleteLinewise,
}
