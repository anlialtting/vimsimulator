(function charWidth(c){
    if(/[\u4E00-\u9fff]/.test(c))
        return 2
    return 1
})
