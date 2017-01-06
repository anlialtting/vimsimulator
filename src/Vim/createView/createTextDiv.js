Promise.all([
    module.shareImport('htmlEntities.js'),
    module.shareImport('line.js'),
]).then(modules=>{
    let
        htmlEntities=modules[0],
        line=modules[1]
    function createTextDiv(vim){
        let
            div=document.createElement('div')
        div.style.fontFamily='monospace'
        div.style.fontSize=`${vim.lineHeightInPx}px`
        div.style.lineHeight='1'
        div.style.whiteSpace='pre'
        div.addEventListener('dblclick',()=>{
            vim.focus()
        })
        vim.on('view',changed=>{
            if(vim.mode=='normal')
                normal(vim,div)
            else if(vim.mode=='insert')
                insert(vim,div)
            else if(vim.mode=='cmdline')
                cmdline(vim,div)
        })
        return div
    }
    function normal(vim,div){
        let text,lines,r,c
        if(vim.text){
            text=   vim.text
            lines=  line.lines(vim.text).map(s=>s+'\n')
            r=      vim._cursor.r
            c=      vim._cursor.c
        }else{
            text='\n'
            lines=['\n']
            r=c=0
        }
        if(document.activeElement!=vim.inputTag)
            return div.textContent=text
        let
            chr=lines[r].substring(c,c+1)
        if(chr=='\n')
            chr=' \n'
        div.innerHTML=`${
            htmlEntities.encode(
                lines.slice(0,r).join('')+
                lines[r].substring(0,c)
            )
        }<span style=background-color:black;color:white;>${
            htmlEntities.encode(chr)
        }</span>${
            htmlEntities.encode(
                lines[r].substring(c+1)+
                lines.slice(r+1).join('')
            )
        }`
    }
    function insert(vim,div){
        let lines,r,c
        if(vim.text){
            lines=  line.lines(vim.text).map(s=>s+'\n')
            r=      vim._cursor.r
            c=      vim._cursor.c
        }else{
            lines=['\n']
            r=c=0
        }
        if(vim.imInput)
            div.innerHTML=
                htmlEntities.encode(
                    lines.slice(0,r).join('')+
                    lines[r].substring(0,c)
                )+
                '<span style=background-color:black;color:white;>'+
                htmlEntities.encode(
                    vim.imInput
                )+
                '</span>'+
                htmlEntities.encode(
                    lines[r].substring(c)+
                    lines.slice(r+1).join('')
                )
        else{
            let
                chr=lines[r].substring(c,
                    c+1
                )
            if(chr=='\n')
                chr=' \n'
            div.innerHTML=`${
                htmlEntities.encode(
                    lines.slice(0,r).join('')+
                    lines[r].substring(0,c)
                )
            }<span style=background-color:black;color:white;>${
                htmlEntities.encode(chr)
            }</span>${
                htmlEntities.encode(
                    lines[r].substring(c+1)+
                    lines.slice(r+1).join('')
                )
            }`
        }
    }
    function cmdline(vim,div){
        div.textContent=vim.text||'\n'
    }
    return createTextDiv
})
