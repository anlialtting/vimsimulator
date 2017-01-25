function shift(vim,s,e,count){
    let cursor=Object.create(vim._cursor)
    for(;s!=e;s++){
        cursor.r=s
        let
            txt=vim._trueText,
            a=cursor.lineStart,
            b=cursor.lineEnd,
            l=txt.substring(a,b),
            m=l.match(/^([\t ]*)([\S\s]*)/)
        vim._text=
            txt.substring(0,a)+
            padding(vim,count(m[1]))+
            m[2]+
            txt.substring(b)
    }
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
