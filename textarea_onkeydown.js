module.export=textarea_onkeydown
function textarea_onkeydown(vim,e){
    var value_toreturn
    if(
        e.ctrlKey&&e.shiftKey&&e.keyCode===86
    ){ // ctrl+shift+v
        vim.activated=!vim.activated
        vim.col_cursor=
            vim.textarea.selectionStart-getLineStartByCursor(
                vim.textarea.value,
                vim.textarea.selectionStart
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
function textarea_onkeydown_mode_0(vim,e){
    var
        value_toreturn
    if(isLongCommand())
        if(!e.shiftKey)
            longCommand()
        else
            longCommandShift()
    else
        if(!e.shiftKey)
            shortCommand()
        else
            shortCommandShift()
    if(isLongCommand()){
        // testing funciton 2015-09-06
        /*setTimeout(function(){
            vim.input_commandline.focus()
        },0)*/
    }else
        vim.runCommandIfPossible()
    if(value_toreturn===false){
        e.preventDefault()
        e.stopPropagation()
    }
    return value_toreturn
    function isLongCommand(){
        return 0<vim.command.length&&(
            vim.command[0]===':'||
            vim.command[0]==='/'||
            vim.command[0]==='!'
        )
    }
    function shortCommand(){
        if(e.keyCode===8){ // backspace
            value_toreturn=false
            vim.textarea.selectionStart=vim.textarea.selectionEnd=
                vim.textarea.selectionStart?
                    vim.textarea.selectionStart-1
                :
                    vim.textarea.selectionStart
        }else if(e.keyCode===13){ // enter
            value_toreturn=false
            if(
                vim.textarea.value.substring(
                    0,vim.textarea.selectionStart
                ).split('\n').length-1
                    !=vim.textarea.value.split('\n').length-1-1
            ){
                vim.textarea.selectionStart=
                vim.textarea.selectionEnd=getLineEndByCursor(
                    vim.textarea.value,
                    vim.textarea.selectionStart
                )
            }
        }else if(e.keyCode===32){ // space for chrome and safari
            value_toreturn=false
            vim.command+=' '
        }else if(e.keyCode===35){ // end
            value_toreturn=false
            vim.textarea.selectionStart=
                getLineEndByCursor(
                    vim.textarea.value,
                    vim.textarea.selectionStart
                )-1
            vim.textarea.selectionEnd=vim.textarea.selectionStart+1
        }else if(e.keyCode===36){ // home
            value_toreturn=false
            vim.textarea.selectionStart=getLineStartByCursor(
                vim.textarea.value,
                vim.textarea.selectionStart
            )
            vim.textarea.selectionEnd=vim.textarea.selectionStart+1
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
        }else if(e.keyCode===46){ // delete
            value_toreturn=false
            var p=vim.textarea.selectionStart
            vim.textarea.value=vim.textarea.value.substring(0,p)+
                vim.textarea.value.substring(
                    p+1,vim.textarea.value.length
                )
            vim.textarea.selectionStart=p
            vim.textarea.selectionEnd=p+1
        }else if(48<=e.keyCode&&e.keyCode<58){ // 0-9
            value_toreturn=false
            vim.command+=
                String.fromCharCode(e.keyCode)
        }else if(e.keyCode===59||e.keyCode===186){
            /*
             * 59: ';' for firefox and opera
             * 186: ';' for chrome and safari
             */
            value_toreturn=false
            vim.command+=';'
        }else if(65<=e.keyCode&&e.keyCode<91){ // a-z
            value_toreturn=false
            vim.command+=
                String.fromCharCode(e.keyCode+32)
        }else if(e.keyCode===190){ // .
            value_toreturn=false
            vim.command+='.'
        }else if(e.keyCode===191){ // /
            value_toreturn=false
            vim.command+='/'
        }else{
            value_toreturn=true
        }
    }
    function shortCommandShift(){
        if(e.keyCode===49){ // !
            value_toreturn=false
            vim.command+='!'
        }else if(e.keyCode===52){ // $
            value_toreturn=false
            vim.textarea.selectionStart=
                getLineEndByCursor(
                    vim.textarea.value,
                    vim.textarea.selectionStart
                )-1
            vim.textarea.selectionEnd=vim.textarea.selectionStart+1
        }else if(e.keyCode===54){ // ^
            value_toreturn=false
            !function(){
                var lineHead
                lineHead=getLineHeadByCursor(
                    vim.textarea.value,
                    vim.textarea.selectionStart
                )
                vim.textarea.selectionStart=lineHead
                vim.textarea.selectionEnd=lineHead+1
            }()
        }else if(e.keyCode===59||e.keyCode===186){
            /*
             * 59: ':' for firefox and opera
             * 186: ':' for chrome and safari
             */
            value_toreturn=false
            vim.command+=':'
        }else if(65<=e.keyCode&&e.keyCode<91){ // A-Z
            value_toreturn=false
            vim.command+=
                String.fromCharCode(e.keyCode)
        }else if(e.keyCode===188){ // <
            value_toreturn=false
            vim.command+='<'
        }else if(e.keyCode===190){ // >
            value_toreturn=false
            vim.command+='>'
        }else{
            value_toreturn=true
        }
    }
    function longCommand(){
        if(e.keyCode===8){ // backspace
            value_toreturn=false
            vim.command
                =vim.command.substring(
                    0,
                    vim.command.length-1
                )
        }else if(e.keyCode===13){ // enter
            value_toreturn=false
            vim.runCommandIfPossible()
        }else if(e.keyCode===32){ // space
            value_toreturn=false
            vim.command+=' '
        }else if(48<=e.keyCode&&e.keyCode<58){ // 0-9
            value_toreturn=false
            vim.command+=
                String.fromCharCode(e.keyCode)
        }else if(65<=e.keyCode&&e.keyCode<91){ // a-z
            value_toreturn=false
            vim.command+=
                String.fromCharCode(e.keyCode+32)
        }else if(96<=e.keyCode&&e.keyCode<106){ // 0-9
            value_toreturn=false
            vim.command+=
                String.fromCharCode(e.keyCode-48)
        }else if(e.keyCode===186){ // ;
            value_toreturn=false
            vim.command+=';'
        }else if(e.keyCode===187){ // =
            value_toreturn=false
            vim.command+='='
        }else if(e.keyCode===188){ // ,
            value_toreturn=false
            vim.command+=','
        }else if(e.keyCode===189){ // -
            value_toreturn=false
            vim.command+='-'
        }else if(e.keyCode===190){ // .
            value_toreturn=false
            vim.command+='.'
        }else if(e.keyCode===191){ // /
            value_toreturn=false
            vim.command+='/'
        }else if(e.keyCode===220){ // \
            value_toreturn=false
            vim.command+='\\'
        }else{
            value_toreturn=false
        }
    }
    function longCommandShift(){
        if(e.keyCode===48){ // )
            value_toreturn=false
            vim.command+=')'
        }else if(e.keyCode===49){ // !
            value_toreturn=false
            vim.command+='!'
        }else if(e.keyCode===50){ // @
            value_toreturn=false
            vim.command+='@'
        }else if(e.keyCode===51){ // #
            value_toreturn=false
            vim.command+='#'
        }else if(e.keyCode===52){ // $
            value_toreturn=false
            vim.command+='$'
        }else if(e.keyCode===53){ // %
            value_toreturn=false
            vim.command+='%'
        }else if(e.keyCode===54){ // ^
            value_toreturn=false
            vim.command+='^'
        }else if(e.keyCode===55){ // &
            value_toreturn=false
            vim.command+='&'
        }else if(e.keyCode===56){ // *
            value_toreturn=false
            vim.command+='*'
        }else if(e.keyCode===57){ // (
            value_toreturn=false
            vim.command+='('
        }else if(65<=e.keyCode&&e.keyCode<91){ // A-Z
            value_toreturn=false
            vim.command+=
                String.fromCharCode(e.keyCode)
        }else if(e.keyCode===188){ // <
            value_toreturn=false
            vim.command+='<'
        }
    }
}
function textarea_onkeydown_mode_1(vim,e){
    var value_toreturn
    if(e.keyCode===9){ // tab
        var
            f=vim.textarea.selectionStart,
            l=vim.textarea.selectionEnd,
            stringToInsert
        stringToInsert=
// It should be tab '\t' by Vim default.
                '    '
        vim.textarea.value=
            vim.textarea.value.substring(0,f)+
            stringToInsert+
            vim.textarea.value.substring(l,vim.textarea.value.length)
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
    vim.runCommandIfPossible()
    return value_toreturn
}
