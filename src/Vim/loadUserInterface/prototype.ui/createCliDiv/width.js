function charWidth(c){
    if(c=='\t')
        return 8
    if(
// Scripts - East Asian Scripts - CJK Unified Ideographs (Han)
        /[\u4E00-\u9fff]/.test(c)||
// Symbols and Punctuation - Punctuation - CJK Symbols and Punctuation
        /[\u3000-\u303f]/.test(c)||
// Symbols and Punctuation - Punctuation - CJK Symbols and Punctuation - Halfwidth and Fullwidth Forms
        /[\uff00-\uffef]/.test(c)
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
