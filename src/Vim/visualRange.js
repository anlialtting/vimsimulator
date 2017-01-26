function visualRange(vim){
    let
        c=vim._modeData.cursor,
        d=vim._cursor.abs
    if(d<c)[c,d]=[d,c]
    return{s:c,e:d+1}
}
visualRange
