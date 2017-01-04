Promise.all([
    module.shareImport('htmlEntities.js'),
    module.shareImport('line.js'),
]).then(modules=>{
    let
        htmlEntities=modules[0],
        line=modules[1]
    return createViewDiv
    function createViewDiv(){
        let
            div=document.createElement('div'),
            commandDiv=createCommandDiv(this)
        div.style.position='relative'
        div.appendChild(createTextDiv(this))
        div.appendChild(commandDiv)
        div.appendChild(this.inputTag)
        this.on('view',changed=>{
            this.inputTag.style.top=`${
                this._cursor.r*this.lineHeightInPx
            }px`
            this.inputTag.style.outline='none'
            this.inputTag.style.color='rgba(0,0,0,0)'
            changed.forEach(key=>{
                if(key=='mode'){
                    if(this.mode==0)
                        commandDiv.textContent=''
                    else if(this.mode==1)
                        commandDiv.textContent='-- INSERT --'
                    else if(this.mode==2)
                        commandDiv.textContent='-- VISUAL --'
                    else if(this.mode==3)
                        commandDiv.textContent='-- VISUAL BLOCK --'
                }
            })
        })
        return div
    }
    function createCommandDiv(vim){
        let
            div=document.createElement('div')
        div.style.fontFamily='monospace'
        div.style.fontSize='13px'
        div.style.lineHeight='1'
        div.style.whiteSpace='pre'
        return div
    }
    function createTextDiv(vim){
        let
            div=document.createElement('div')
        div.style.fontFamily='monospace'
        div.style.fontSize='13px'
        div.style.lineHeight='1'
        div.style.whiteSpace='pre'
        div.addEventListener('dblclick',()=>{
            vim.focus()
        })
        vim.on('view',changed=>{
            if(vim.mode==0)
                mode0(vim,div)
            if(vim.mode==1)
                mode1(vim,div)
        })
        return div
    }
    function mode0(vim,div){
        if(document.activeElement!=vim.inputTag)
            return div.innerHTML=htmlEntities.encode(vim.text)
        let
            lines=  line.lines(vim.text).map(s=>s+'\n'),
            r=      vim._cursor.r,
            c=      vim._cursor.c
        div.innerHTML=
            htmlEntities.encode(
                lines.slice(0,r).join('')+
                lines[r].substring(0,c)
            )+
            '<span style=background-color:black;color:white;>'+
            htmlEntities.encode(
                lines[r].substring(c,c+1)
            )+
            '</span>'+
            htmlEntities.encode(
                lines[r].substring(c+1)+
                lines.slice(r+1).join('')
            )
    }
    function mode1(vim,div){
        let
            lines=  line.lines(vim.text).map(s=>s+'\n'),
            r=      vim._cursor.r,
            c=      vim._cursor.c
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
        else
            div.innerHTML=
                htmlEntities.encode(
                    lines.slice(0,r).join('')+
                    lines[r].substring(0,c)
                )+
                '<span style=background-color:black;color:white;>'+
                htmlEntities.encode(
                    lines[r].substring(c,
                        c+1
                    )
                )+
                '</span>'+
                htmlEntities.encode(
                    lines[r].substring(c+1)+
                    lines.slice(r+1).join('')
                )
    }
})
