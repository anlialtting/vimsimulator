module.shareImport('monospaceFonts.js').then(monospaceFonts=>{
    return create_pre_editor
    function create_pre_editor(vim){
        let pre_editor=document.createElement('pre')
        pre_editor.className='vimontheweb_pre_editor'
        pre_editor.vim=vim
        pre_editor.onmousedown=function(e){
            e.preventDefault()
            e.stopPropagation()
        }
        pre_editor.onmouseup=function(e){
            e.preventDefault()
            e.stopPropagation()
        }
        pre_editor.onclick=e=>{
            e.preventDefault()
            e.stopPropagation()
            vim.input.focus()
        }
        pre_editor.onwheel=function(e){
            if(e.deltaX<0)
                vim.cursorMovesLeft()
            else if(0<e.deltaX)
                vim.cursorMovesRight()
            if(e.deltaY<0){
                let step=Math.max(1,Math.floor(-e.deltaY/48))
                for(let i=0;i<step;i++)
                    vim.cursorMovesUp()
            }else if(0<e.deltaY){
                let step=Math.max(1,Math.floor(e.deltaY/48))
                for(let i=0;i<step;i++)
                    vim.cursorMovesDown()
            }
            vim.update()
            e.preventDefault()
            e.stopPropagation()
        }
        pre_editor.style.cursor='default'
        // centering
        pre_editor.style.marginLeft=
            ''+-(vim.count_cols_toshow*6)/2+'pt'
        pre_editor.style.marginTop=
            ''+-(vim.count_rows_toshow*12)/2+'pt'
        // end centering
        //pre_editor.style.backgroundColor=style.backgroundColor
        pre_editor.style.color=vim.style.color
        pre_editor.style.height=vim.count_rows_toshow*12+'pt'
        pre_editor.style.width=vim.count_cols_toshow*6+'pt'
        pre_editor.style.lineHeight='12pt'
        pre_editor.style.letterSpacing='0pt'
        pre_editor.style.fontFamily=monospaceFonts
        document.body.appendChild(style())
        return pre_editor
        function style(){
            let result=document.createElement('style')
            result.textContent='.vimontheweb_pre_editor{'+
                'display:none;'+
                'border:0px;'+
                'position:fixed;'+
                'left:50%;'+
                'top:50%;'+
            '}'
            return result
        }
    }
})
