Promise.all([
    module.shareImport('prototype.update/cppstl.js'),
    module.shareImport('prototype.update/create_pre_editor.js'),
    module.shareImport('prototype.update/monospaceFonts.js'),
    module.shareImport('prototype.update/create_div_editor.js'),
    module.shareImport('prototype.update/count_rows_string.js'),
    module.shareImport('prototype.update/output_contents.js'),
]).then(modules=>{
    let
        cppstl=modules[0],
        create_pre_editor=modules[1],
        monospaceFonts=modules[2],
        create_div_editor=modules[3],
        count_rows_string=modules[4],
        output_contents=modules[5]
    return function(){
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
            vim.input.style.left=
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
                vim.histories.length==0||
                vim.histories[vim.histories.length-1]!==vim.textarea.value
            ){
                vim.histories.push(vim.textarea.value)
                if(100<vim.histories.length)
                    vim.histories.shift()
            }
        }
        function selectionCorrection(vim){
            if(vim.mode=='normal'){
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
            }else if(vim.mode=='insert'){
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
            output_contents(
                vim,
                cursor,
                partialsum_length_lines,
                countOfColsPerRow,
                countOfColsForPaddingForLineNumber,
                lines,
                cursor_end
            )
            output_commandLine(vim)
        }
        function calculate_lineNumber_select(vim){
            return vim.textarea.value.substring(
                0,
                cursor(vim)
            ).split('\n').length-1
            function cursor(vim){
                if(vim.mode=='normal'||vim.mode=='visual')
                    return vim.textarea.selectionStart
                return vim.textarea.selectionStart<
                    vim.visualmode.fixedCursor?
                        vim.textarea.selectionStart
                    :
                        vim.textarea.selectionEnd-1
            }
        }
        function output_commandLine(vim){
            let s,length
            if(vim.mode=='normal'){
                s=vim.command
                if(50<s.length)
                    s=s.substring(s.length-50,s.length)
                length=s.length
                if(vim.command[0]!==':'&&vim.command[0]!=='/')
                    s='<span style="color:gray;">'+s+'</span>'
            }else if(vim.mode=='insert'){
                s='-- INSERT --'
                length=s.length
            }else if(vim.mode=='visual'){
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
})
