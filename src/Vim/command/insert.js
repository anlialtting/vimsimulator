module.import('ascii.js').then(ascii=>{
    function main(vim){
        if(vim.command==ascii.bs){
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
                vim.command=''
            }
            return
        }
        if(vim.command==ascii.esc){
            vim.mode='normal'
            vim.command=''
            return
        }
        if(vim.command==ascii.del){
            if(vim._text){
                vim._text=
                    vim._text.substring(0,vim._cursor.abs)+
                    vim._text.substring(vim._cursor.abs+1)
            }
            vim.command=''
            return
        }
        vim._text||(vim._text='\n')
        vim._text=
            vim._text.substring(0,vim._cursor.abs)+
            vim.command.replace(/\r/,'\n')+
            vim._text.substring(vim._cursor.abs)
        vim._cursor.moveTo(vim._cursor.abs+vim.command.length)
        vim.command=''
    }
    return vim=>{
        let r=main(vim)
        vim.view()
        return r
    }
})
