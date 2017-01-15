function main(vim,val){
    if(typeof val=='object'){
        if(val.key=='Backspace'){
            if(vim._text){
                let
                    text=
                        vim.text.substring(0,vim._cursor.abs-1)+
                        vim.text.substring(vim._cursor.abs),
                    pos=
                        vim._cursor.abs-1
                vim._text=text
                if(vim._text)
                    vim._cursor.moveTo(pos)
            }
            return
        }
        if(val.key=='Delete'){
            if(vim._text){
                vim._text=
                    vim._text.substring(0,vim._cursor.abs)+
                    vim._text.substring(vim._cursor.abs+1)
            }
            return
        }
        if(val.key=='Enter')
            val='\r'
        if(
            val.key=='Escape'||
            val.ctrlKey&&val.key=='c'||
            val.ctrlKey&&val.key=='['
        )
            return vim.mode='normal'
        if(
            val.key=='Tab'
        ){
            vim._text||(vim._text='\n')
            vim._text=
                vim._text.substring(0,vim._cursor.abs)+
                '\t'+
                vim._text.substring(vim._cursor.abs)
            vim._cursor.moveTo(vim._cursor.abs+1)
            return
        }
    }
    if(typeof val=='string'){
        vim._text||(vim._text='\n')
        vim._text=
            vim._text.substring(0,vim._cursor.abs)+
            val.replace(/\r/,'\n')+
            vim._text.substring(vim._cursor.abs)
        vim._cursor.moveTo(vim._cursor.abs+val.length)
    }
}
((vim,val)=>{
    let r=main(vim,val)
    vim._view()
    return r
})
