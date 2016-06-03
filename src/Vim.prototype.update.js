Promise.all([
    module.shareImport('cppstl.js'),
    module.shareImport('create_pre_editor.js'),
    module.shareImport('monospaceFonts.js'),
    module.shareImport('create_div_editor.js'),
]).then(modules=>{
let
    cppstl=modules[0],
    create_pre_editor=modules[1],
    monospaceFonts=modules[2],
    create_div_editor=modules[3]
module.export=function(){
    let
        countOfColsPerRow,
        countOfColsForPaddingForLineNumber,
        lines
    if(toReject(this))
        return
    eolCorrection(this)
    selectionCorrection(this)
    setup(this)
    writeCurrentStateIntoHistory(this)
    show(this)
    lineCursorCatchingUp(this)
    let
        cursor=
            this.textarea.selectionStart,
        cursor_end=
            this.textarea.selectionEnd,
        length_lines=
            calculate_length_lines(),
        partialsum_length_lines=
            calculate_partialsum_length_lines(),
        lineNumber_cursor=
            cppstl.upper_bound(partialsum_length_lines,cursor)-1,
        lineNumber_cursor_end=
            cppstl.upper_bound(partialsum_length_lines,cursor_end)-1,
        charNumber_cursor=
            cursor-partialsum_length_lines[lineNumber_cursor],
        charNumber_cursor_end=
            cursor_end-partialsum_length_lines[lineNumber_cursor_end]
    do_outputAll(this)
    updateInputPosition(this)
    function updateInputPosition(vim){
        vim.input_commandline.style.left=
            6*vim.command.length+'pt'
    }
    function setup(vim){
        lines=linesOf(vim.textarea.value)
        countOfColsForPaddingForLineNumber=Math.max(
            4,
            Math.floor(
                Math.round(
                    Math.log(lines.length)/Math.log(10)*1e6
                )/1e6
            )+2
        )
        countOfColsPerRow=
            vim.count_cols_toshow-
            countOfColsForPaddingForLineNumber
        if(vim.activated){
            if(!vim.div_editor){
                vim.div_editor=create_div_editor(vim)
                vim.pre_editor=create_pre_editor(vim)
                vim.div_editor.appendChild(vim.pre_editor)
                document.body.appendChild(vim.div_editor)
            }
        }
    }
    function toReject(vim){
        if(!vim.activated){
            if(vim.div_editor&&vim.pre_editor){
                vim.div_editor.style.display='none'
                vim.pre_editor.style.display='none'
            }
            return true
        }
        return false
    }
    function show(vim){
        vim.div_editor.style.display='block'
        vim.pre_editor.style.display='block'
    }
    function writeCurrentStateIntoHistory(vim){
        if(
            vim.histories.length===0||
            vim.histories[vim.histories.length-1]!==vim.textarea.value
        ){
            vim.histories.push(vim.textarea.value)
            if(100<vim.histories.length)
                vim.histories.shift()
        }
    }
    function selectionCorrection(vim){
        if(vim.mode===0){
            if(
                0<=vim.textarea.selectionStart-1&&(
                    vim.textarea.selectionStart===
                        vim.textarea.value.length||
                    vim.textarea.value[
                        vim.textarea.selectionStart
                    ]==='\n'&&
                    vim.textarea.value[
                        vim.textarea.selectionStart-1
                    ]!=='\n'
                )
            ){
                vim.textarea.selectionStart--
            }
            vim.textarea.selectionEnd=
                vim.textarea.selectionStart+1
        }else if(vim.mode===1){ // insert mode
        }
    }
    function eolCorrection(vim){
        var
            selectionStart,
            selectionEnd
        if(vim.textarea.value[
            vim.textarea.value.length-1
        ]==='\n')
            return
        selectionStart=vim.textarea.selectionStart
        selectionEnd=vim.textarea.selectionEnd
        vim.textarea.value+='\n'
        vim.textarea.selectionStart=selectionStart
        vim.textarea.selectionEnd=selectionEnd
    }
    function do_outputAll(vim){
        output_contents(vim)
        output_commandLine(vim)
    }
    function output_contents(vim){
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
        range=calculateShowingRange(vim)
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
    function calculate_lineNumber_select(vim){
        return vim.textarea.value.substring(
            0,
            cursor(vim)
        ).split('\n').length-1
        function cursor(vim){
            if(vim.mode===0||vim.mode===1)
                return vim.textarea.selectionStart
            return vim.textarea.selectionStart<vim.visualmode.fixedCursor?
                vim.textarea.selectionStart
            :
                vim.textarea.selectionEnd-1
        }
    }
    function output_commandLine(vim){
        let s,length
        if(vim.mode===0){
            s=vim.command
            if(50<s.length)
                s=s.substring(s.length-50,s.length)
            length=s.length
            if(vim.command[0]!==':'&&vim.command[0]!=='/')
                s='<span style="color:gray;">'+s+'</span>'
        }else if(vim.mode===1){
            s='-- INSERT --'
            length=s.length
        }else if(vim.mode===2){
            s='-- VISUAL --'
            length=s.length
        }
        let span=document.createElement('span')
        span.innerHTML=s
        vim.pre_editor.appendChild(
            span
        )
        vim.pre_editor.appendChild(
            document.createTextNode(
                calculate_s(length)
            )
        )
    }
    function calculate_s(col_currentRow){
        let result=''
        while(col_currentRow+result.length<60)
            result+=' '
        result+=(lineNumber_cursor+1)+','+(charNumber_cursor+1)
        for(let i=col_currentRow+result.length;i<countOfColsPerRow;i++)
            result+=' '
        result+=Math.floor(100*lineNumber_cursor/lines.length)+'%'
        return result
    }
    function calculateShowingRange(vim){
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
    function calculateLowerAndUpper(vim){
        var result,partialSum_rowsCount_lines
        {
            partialSum_rowsCount_lines=
                vim.textarea.value.split('\n')
            for(let i in partialSum_rowsCount_lines)
                partialSum_rowsCount_lines[i]=
                    count_rows_string(
                        countOfColsPerRow,partialSum_rowsCount_lines[i]
                    )
            for(let i=1;i<partialSum_rowsCount_lines.length;i++)
                partialSum_rowsCount_lines[i]+=
                    partialSum_rowsCount_lines[i-1]
            partialSum_rowsCount_lines.unshift(0)
        }{
            let
                lineNumber_select=calculate_lineNumber_select(vim),
                lower=lineNumber_select,
                upper=lineNumber_select
            while(
                0<=lower-1&&
                    partialSum_rowsCount_lines[lineNumber_select+1]-
                        partialSum_rowsCount_lines[lower-1]
                    <=
                    vim.count_rows_toshow-1
            )
                lower--
            result={
                lower:lower,
                upper:upper+1,
            }
        }
        return result
    }
    function lineCursorCatchingUp(vim){
        let range=calculateLowerAndUpper(vim)
        vim.lineCursor=Math.max(vim.lineCursor,range.lower)
        vim.lineCursor=Math.min(vim.lineCursor,range.upper-1)
    }
    function linesOf(text){
        let lines=text.split('\n')
        lines.pop()
        lines.forEach((e,i)=>{
            lines[i]+='\n'
        })
        return lines
    }
    function calculate_length_lines(){
        let length_lines=Array(lines.length)
        lines.forEach((e,i)=>{
            length_lines[i]=lines[i].length
        })
        return length_lines
    }
    function calculate_partialsum_length_lines(){
        let partialsum_length_lines=[0]
        partialsum_length_lines.push.apply(
            partialsum_length_lines,
            cppstl.partial_sum(length_lines)
        )
        return partialsum_length_lines
    }
}
function count_rows_string(countOfColsPerRow,string){
    let
        row_currentLine=0,
        col_currentRow=0
    for(let i=0;i<string.length;i++){
        let width
        if(string[i]==='\t'){
            width=8-col_currentRow%8
        }else if(string.charCodeAt(i)<0xff){
            width=1
        }else
            width=2
        if(col_currentRow+width>countOfColsPerRow){
            row_currentLine++
            col_currentRow=0
        }
        col_currentRow+=width
    }
    return row_currentLine+1
}
})
