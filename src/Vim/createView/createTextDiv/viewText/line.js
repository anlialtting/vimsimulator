function lines(text){
/*
    A line should not include EOL,
    since it has already been seperated from the others.
*/
    let result=text.split('\n')
    result.pop()
    return result
}
;({
    lines
})
