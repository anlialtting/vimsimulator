(function viewCursor(vim){
    let r,c
    if(vim._text){
        r=vim._cursor.r
        c=vim._cursor.c
    }else{
        r=c=0
    }
    return{r,c}
})
