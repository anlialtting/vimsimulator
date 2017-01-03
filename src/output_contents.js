module.shareImport('count_rows_string.js').then(count_rows_string=>{
return output_contents
function output_contents(
    vim,
    cursor,
    partialsum_length_lines,
    countOfColsPerRow,
    countOfColsForPaddingForLineNumber,
    lines,
    cursor_end
){
    let
        text=vim.textarea.value,
        count_rows_showed=0,
        row_currentLine=0,
        col_currentRow=0,
        currentLineSpan,
        selectionShowingState,
        isActiveElement,
        lineNumber,
        charNumber,
        i,
        string_toshow_currentCharacter,
        width_string_toshow_currentCharacter,
        range
    window.VimPatch={}
    VimPatch.goto=function(i){
        vim.textarea.selectionStart=i
        vim.textarea.selectionEnd=i+1
        vim.update()
    }
    let currentLine=''
    currentLineSpan=document.createElement('span')
    row_currentLine=0
    col_currentRow=0
    /*
        selectionShowingState:
            0: Cursor has not been reached or it is ended.
            1: Cursor span is started.
            2: Cursor span will start next row.
    */
    selectionShowingState=0
    isActiveElement=
        vim.textarea===document.activeElement
    lineNumber=vim.lineCursor
    charNumber=0
    if(cursor<partialsum_length_lines[vim.lineCursor])
        selectionShowingState=2
    vim.pre_editor.innerHTML=''
    range=calculateShowingRange(
        vim,
        countOfColsPerRow
    )
    while(
        lineNumber<range.upper
    ){
        i=partialsum_length_lines[lineNumber]+charNumber
        string_toshow_currentCharacter=
            text[i]==='\n'
                ?(vim.mode===1||0<=i-1&&text[i-1]==='\n'?' ':'')
                :text[i]
        width_string_toshow_currentCharacter=
            string_toshow_currentCharacter===''?0:
            string_toshow_currentCharacter.charCodeAt(0)<0xff?1:2
        shouldStopCurrentRow()&&
            stopCurrentRow()
        col_currentRow===0&&vim.environment.number&&
            showLineNumber()
        if(isActiveElement){
            if(
                selectionShowingState===0&&i===cursor||
                selectionShowingState===2
            )
                startSelectionShowing()
            if(
                vim.mode===0&&i===cursor_end||
                vim.mode===1&&(
                    cursor===cursor_end?
                        i===cursor_end+1
                    :
                        i===cursor_end
                )||
                vim.mode===2&&i===cursor_end
            )
                stopSelectionShowing()
        }
        if(text[i]==='\n')
            meetEol()
        else if(text[i]==='\t')
            meetTab()
        else
            showCurrentCharacter()
        if(text[i]==='\n')
            stopCurrentLine()
    }
    if(selectionShowingState)
        stopSelectionShowingOnOutput()
    outputNullLines(vim,count_rows_showed,range.upper===lines.length)
    return count_rows_showed
    function shouldStopCurrentRow(){
        return vim.count_cols_toshow<(
            vim.environment.number?
                countOfColsForPaddingForLineNumber
            :
                0
        )+
        col_currentRow+
        width_string_toshow_currentCharacter
    }
    function meetTab(){
        currentLine+=text[i]
        charNumber++
        col_currentRow=
            Math.floor((col_currentRow+8)/8)*8
    }
    function meetEol(){
        if(
            vim.environment.list||
            vim.mode===1||
            0<=i-1&&text[i-1]
        ){ // eol showing
            currentLine+='<span style="'+vim.stylesheet_eol+'">'
            if(vim.environment.list)
                currentLine+='$'
            else
                currentLine+=' '
            currentLine+='</span>'
        }
    }
    function stopCurrentRow(){
        if(isActiveElement&&selectionShowingState===1)
            pauseSelectionShowing()
        currentLine+='\n'
        row_currentLine++
        col_currentRow=0
    }
    function showCurrentCharacter(){
        var html_toshow
        if(text[i]==='<'){
            html_toshow='&lt;'
        }else if(text[i]==='>'){
            html_toshow='&gt;'
        }else if(text[i]==='&'){
            html_toshow='&amp;'
        }else{
            html_toshow=text[i]
        }
        currentLine+=
            //'<span onmousedown="javascript:VimPatch.goto('+i+')">'+(
                !vim.highlighter||
                    '!@#$%^&*()-=[]{},.;<>?:\'"\\/'.
                    indexOf(text[i])===-1
                ?
                    html_toshow
                :
                    '<span style="color:deeppink;">'+
                        html_toshow+
                    '</span>'
            //)+'</span>'
        charNumber++
        col_currentRow+=width_string_toshow_currentCharacter
    }
    function showLineNumber(){
        if(row_currentLine===0){
            var s=(lineNumber+1).toString()
            currentLine+=
                spaces(countOfColsForPaddingForLineNumber-s.length-1)
            currentLine+=
                '<span style="color:lawngreen;">'+
                    s+
                '</span>';
            currentLine+=' '
        }else
            currentLine+=spaces(countOfColsForPaddingForLineNumber)
        function spaces(n){
            let result=''
            while(result.length<n)
                result+=' '
            return result
        }
    }
    function stopCurrentLine(){
        stopCurrentRow()
        currentLineSpan.innerHTML+=currentLine
        vim.pre_editor.appendChild(currentLineSpan)
        count_rows_showed+=row_currentLine
        currentLine=''
        currentLineSpan=document.createElement('span')
        charNumber=0
        row_currentLine=0
        lineNumber++
    }
    function startSelectionShowing(){
        selectionShowingState=1
        currentLine+=
            '<span style="background-color:'+
            vim.style.color+';color:'+
            vim.style.backgroundColor+';">'
    }
    function pauseSelectionShowing(){
        selectionShowingState=2
        currentLine+='</span>'
    }
    function stopSelectionShowing(){
        selectionShowingState=0
        currentLine+='</span>'
    }
    function stopSelectionShowingOnOutput(){
        selectionShowingState=0
        vim.pre_editor.innerHTML+='</span>'
    }
    function outputNullLines(
        vim,
        count_rows_showed,
        isEofReached
    ){
        for(let i=0;i<vim.count_rows_toshow-count_rows_showed-1;i++)
            vim.pre_editor.appendChild(
                document.createTextNode((isEofReached?'~':'@')+'\n')
            )
    }
}
function calculateShowingRange(
    vim,
    countOfColsPerRow
){
    var result,partialSum_rowsCount_lines
    {
        partialSum_rowsCount_lines=
            vim.textarea.value.split('\n')
        partialSum_rowsCount_lines.pop()
        for(let i in partialSum_rowsCount_lines)
            partialSum_rowsCount_lines[i]=
                count_rows_string(
                    countOfColsPerRow,
                    partialSum_rowsCount_lines[i]
                )
        for(let i=1;i<partialSum_rowsCount_lines.length;i++)
            partialSum_rowsCount_lines[i]+=
                partialSum_rowsCount_lines[i-1]
        partialSum_rowsCount_lines.unshift(0)
    }{
        let
            lower=vim.lineCursor,
            upper=vim.lineCursor
        while(
            partialSum_rowsCount_lines[upper+1]-
                partialSum_rowsCount_lines[lower]
            <=
            vim.count_rows_toshow-1
        )
            upper++
        result={
            lower:lower,
            upper:upper,
        }
    }
    if(result.lower===result.upper)
        result.upper++
    return result
}
})
