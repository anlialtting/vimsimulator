function shift(vim,s,e,count){
    let cursor=Object.create(vim._trueCursor)
    for(;s!=e;s++){
        cursor.r=s
        let
            a=cursor.lineStart,
            b=cursor.lineEnd,
            m=vim._trueText.substring(a,b).match(/^([\t ]*)([\S\s]*)/)
        vim._text={
            function:'replace',
            start:a,
            end:b,
            string:padding(vim._options,count(m[1]))+m[2],
        }
    }
}
function padding(o,n){
    let
        a=Math.floor(n/o.tabstop),
        b=n-a*o.tabstop
    return(
        o.expandtab?' '.repeat(o.tabstop):'\t'
    ).repeat(a)+' '.repeat(b)
}
function countPadding(vim,s){
    return count(s,'\t')*vim._options.tabstop+count(s,' ')
    function count(s,c){
        return s.split(c).length-1
    }
}
function left(vim,s,e){
    shift(vim,s,e,m=>Math.max(0,countPadding(vim,m)-vim._options.shiftwidth))
}
function right(vim,s,e){
    shift(vim,s,e,m=>countPadding(vim,m)+vim._options.shiftwidth)
}
({
    left,
    right
})
