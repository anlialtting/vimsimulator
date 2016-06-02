module.shareImport('monospaceFonts.js').then(monospaceFonts=>{
module.export=create_div_editor
function create_div_editor(vim){
    let div_editor=document.createElement('div')
    div_editor.className='vimontheweb_div_editor'
    div_editor.vim=vim
    // centering
    div_editor.style.marginLeft=
        ''+-(vim.count_cols_toshow*6)/2+'pt'
    div_editor.style.marginTop=
        ''+-(vim.count_rows_toshow*12)/2+'pt'
    // end centering
    div_editor.style.background=vim.style.backgroundColor
    div_editor.style.height=''+vim.count_rows_toshow*12+'pt'
    vim.input_commandline=create_input_commandline(vim)
    div_editor.appendChild(
        vim.input_commandline
    )
    div_editor.appendChild((()=>{
        let div=document.createElement('div')
        div.textContent='.'.repeat(vim.count_cols_toshow)
        div.style.visibility='hidden'
        div.style.fontSize='12pt'
        div.style.fontFamily=monospaceFonts
        return div
    })())
    document.body.appendChild(style())
    return div_editor
    function style(){
        let result=document.createElement('style')
        result.textContent='.vimontheweb_div_editor{'+
            'display:none;'+
            'position:fixed;'+
            'left:50%;'+
            'top:50%;'+
        '}'
        return result
    }
}
function create_input_commandline(vim){
    let input=document.createElement('input')
    input.style.position='relative'
    input.style.top=vim.count_rows_toshow*12+'pt'
    input.oninput=function(e){
        if(
            0<this.value.length&&
            this.selectionStart===this.selectionEnd
        ){
            vim.command+=this.value
            this.value=''
            vim.update()
            setTimeout(function(){
                input.select()
            },0)
        }
        e.stopPropagation()
    }
    return input
}
})
