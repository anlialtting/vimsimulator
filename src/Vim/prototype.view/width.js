function charWidth(c){
    if(c=='\t')
        return 8
    if(/[\u4E00-\u9fff]/.test(c))
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
