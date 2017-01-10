(function charWidth(c){
    if(c=='\t')
        return 8
    if(/[\u4E00-\u9fff]/.test(c))
        return 2
    return 1
})
