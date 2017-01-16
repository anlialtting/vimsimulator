function left(vim,s,e){
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
            padding(
                vim,
                Math.max(0,countPadding(vim,m[1])-vim._options.shiftwidth)
            )+
            m[2]+
            vim._text.substring(b)
    }
}
function right(vim,s,e){
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
            padding(
                vim,
                countPadding(vim,m[1])+vim._options.shiftwidth
            )+
            m[2]+
            vim._text.substring(b)
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
({
    left,
    right
})
