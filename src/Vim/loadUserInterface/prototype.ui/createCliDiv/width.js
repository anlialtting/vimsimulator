function charWidth(c){
    if(c=='\t')
        return 8
    c=c.charCodeAt(0)
    if(
// Scripts - East Asian Scripts - CJK Unified Ideographs (Han)
        0x4e00<=c&&c<=0x9fff||
// Symbols and Punctuation - Punctuation - CJK Symbols and Punctuation
        0x3000<=c&&c<=0x303f||
// Symbols and Punctuation - Punctuation - CJK Symbols and Punctuation - Halfwidth and Fullwidth Forms
        0xff00<=c&&c<=0xffef
    )
        return 2
    return 1
}
function stringWidth(s){
    let res=0
    for(let i=0;i<s.length;i++)
        res+=charWidth(s[i])
    return res
}
stringWidth
