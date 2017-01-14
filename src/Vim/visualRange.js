function visualRange(vim){
    if(vim.mode=='visual'){
        let
            c=vim._modeData.cursor,
            d=vim._cursor.abs
        if(d<c){let t=c;c=d;d=t}
        return{s:c,e:d+1}
    }
}
visualRange
