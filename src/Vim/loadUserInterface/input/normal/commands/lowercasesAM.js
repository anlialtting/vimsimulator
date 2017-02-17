function a(vim,cmd,arg){
    vim._mode='insert'
    vim._cursor.moveRight()
    return{
        acceptable:true,
        complete:true,
    }
}
function d(vim,cmd,arg){
    if(cmd=='')
        return{acceptable:true}
    if(cmd=='d'){
        return{
            function:'dd',
            count:arg||1,
            register:'"',
        }
    }
}
function g(vim,cmd,arg){
    if(cmd=='')
        return{acceptable:true}
    if(cmd=='g'){
        arg=arg||1
        arg=Math.min(vim._cursor._countOfRows,arg)
        vim._cursor.moveTo(vim._cursor.line(arg-1))
        return{
            acceptable:true,
            complete:true,
        }
    }
}
function h(vim,cmd,arg){
    arg=arg||1
    if(vim._text)
        while(arg--)
            vim._cursor.moveLeft()
    return{
        acceptable:true,
        complete:true,
    }
}
function i(vim,cmd,arg){
    vim._mode='insert'
    return{
        acceptable:true,
        complete:true,
    }
}
function j(vim,cmd,arg){
    arg=arg||1
    if(vim._text)
        while(arg--)
            vim._cursor.moveDown()
    return{
        acceptable:true,
        complete:true,
    }
}
function k(vim,cmd,arg){
    arg=arg||1
    if(vim._text)
        while(arg--)
            vim._cursor.moveUp()
    return{
        acceptable:true,
        complete:true,
    }
}
function l(vim,cmd,arg){
    arg=arg||1
    if(vim._text)
        while(arg--)
            vim._cursor.moveRight()
    return{
        acceptable:true,
        complete:true,
    }
}
({a,d,g,h,i,j,k,l})
