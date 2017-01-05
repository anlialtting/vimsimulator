module.import('textarea_onkeydown_mode_0.js').then(textarea_onkeydown_mode_0=>{
return textarea_onkeydown
function textarea_onkeydown(vim,e){
    var value_toreturn
    if(
        e.ctrlKey&&e.shiftKey&&e.keyCode===86
    ){ // ctrl+shift+v
        vim.activated=!vim.activated
        vim.col_cursor=
            vim.selectionStart-getLineStartByCursor(
                vim.text,
                vim.selectionStart
            )
        value_toreturn=false
    }else if(!vim.activated){
        value_toreturn=true
    }else if(
        e.keyCode===27||e.ctrlKey&&e.keyCode===67
    ){ // esc or ctrl+c
        vim.mode=0
        vim.command=''
        vim.update()
        value_toreturn=false
    }else if(
        e.ctrlKey&&e.keyCode===86
    ){ // ctrl+v
        value_toreturn=true
    }else if(vim.mode===0){
        value_toreturn=textarea_onkeydown_mode_0(vim,e)
    }else if(vim.mode===1){
        value_toreturn=textarea_onkeydown_mode_1(vim,e)
    }else if(vim.mode===2){
        value_toreturn=textarea_onkeydown_mode_2(vim,e)
    }else{
        value_toreturn=true
    }
    if(value_toreturn)
        return value_toreturn
    vim.afterkeydown_textarea()
    vim.update()
    return value_toreturn
}
function textarea_onkeydown_mode_1(vim,e){
    var value_toreturn
    if(e.keyCode===9){ // tab
        var
            f=vim.selectionStart,
            l=vim.selectionEnd,
            stringToInsert
        stringToInsert=
// It should be tab '\t' by Vim default.
                '    '
        vim.text=
            vim.text.substring(0,f)+
            stringToInsert+
            vim.text.substring(l,vim.text.length)
        vim.textarea.selectionStart=
        vim.textarea.selectionEnd=
            f+stringToInsert.length
        value_toreturn=false
    }else if(e.keyCode===35){ // end
        value_toreturn=false
        vim.textarea.selectionStart=
            getLineEndByCursor(
                vim.textarea.value,
                vim.textarea.selectionStart
            )-1
        vim.textarea.selectionEnd=vim.textarea.selectionStart
    }else if(e.keyCode===36){ // home
        value_toreturn=false
        vim.textarea.selectionStart=getLineStartByCursor(
            vim.textarea.value,
            vim.textarea.selectionStart
        )
        vim.textarea.selectionEnd=vim.textarea.selectionStart
    }else if(e.keyCode===37){ // left arrow
        value_toreturn=false
        vim.cursorMovesLeft()
    }else if(e.keyCode===38){ // up arrow
        value_toreturn=false
        vim.cursorMovesUp()
    }else if(e.keyCode===39){ // right arrow
        value_toreturn=false
        vim.cursorMovesRight()
    }else if(e.keyCode===40){ // down arrow
        value_toreturn=false
        vim.cursorMovesDown()
    }
    return value_toreturn
}
function textarea_onkeydown_mode_2(vim,e){
    var value_toreturn
    if(e.keyCode===37){ // left arrow
        value_toreturn=false
        vim.cursorMovesLeft()
    }else if(e.keyCode===38){ // up arrow
        value_toreturn=false
        vim.cursorMovesUp()
    }else if(e.keyCode===39){ // right arrow
        value_toreturn=false
        vim.cursorMovesRight()
    }else if(e.keyCode===40){ // down arrow
        value_toreturn=false
        vim.cursorMovesDown()
    }else if(65<=e.keyCode&&e.keyCode<91){ // a-z
        value_toreturn=false
        vim.command+=
            String.fromCharCode(e.keyCode+32)
    }else if(e.keyCode===188){ // <
        value_toreturn=false
        vim.command+='<'
    }else if(e.keyCode===190){ // >
        value_toreturn=false
        vim.command+='>'
    }
    //vim.runCommandIfPossible()
    return value_toreturn
}
})
