function shift(vim,s,e,count){
    let cursor=Object.create(vim._cursor)
    for(;s!=e;s++){
        cursor.r=s
        let
            a=cursor.lineStart,
            b=cursor.lineEnd,
            l=vim._text.substring(a,b),
            m=l.match(/^([\t ]*)([\S\s]*)/)
        vim._text=
            vim._text.substring(0,a)+
            padding(vim,count(m[1]))+
            m[2]+
            vim._text.substring(b)
    }
}
function left(vim,s,e){
    shift(vim,s,e,m=>
        Math.max(0,countPadding(vim,m)-vim._options.shiftwidth)
    )
}
function right(vim,s,e){
    shift(vim,s,e,m=>
        countPadding(vim,m)+vim._options.shiftwidth
    )
}
function padding(vim,n){
    let
        a=Math.floor(n/vim._options.tabstop),
        b=n-a*vim._options.tabstop
    return '\t'.repeat(a)+' '.repeat(b)
}
function countPadding(vim,s){
    return count(s,'\t')*vim._options.tabstop+count(s,' ')
    function count(s,c){
        return s.split(c).length-1
    }
}
({
    left,
    right
})
