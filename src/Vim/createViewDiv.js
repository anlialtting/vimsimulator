Promise.all([
    module.shareImport('createViewDiv/htmlEntities.js'),
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
        this.inputTag.style.outline='none'
        this.inputTag.style.width='0'
        this.inputTag.style.color='white'
        this.inputTag.style.backgroundColor='black'
        div.style.position='relative'
        div.appendChild(createTextDiv(this))
        div.appendChild(commandDiv)
        div.appendChild(this.inputTag)
        this.on('view',changed=>{
            /*this.inputTag.style.top=`${
                this._cursor.r*this.lineHeightInPx
            }px`*/
            changed.forEach(key=>{
                if(key=='mode'){
                    if(this.mode=='normal')
                        commandDiv.textContent=''
                    else if(this.mode=='insert')
                        commandDiv.textContent='-- INSERT --'
                    else if(this.mode=='visual')
                        commandDiv.textContent='-- VISUAL --'
                    else if(this.mode=='visual-block')
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
        div.style.fontSize=`${vim.lineHeightInPx}px`
        div.style.lineHeight='1'
        div.style.whiteSpace='pre'
        return div
    }
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
        })
        return div
    }
    function normal(vim,div){
        if(document.activeElement!=vim.inputTag)
            return div.innerHTML=htmlEntities.encode(vim.text)
        let
            lines=  line.lines(vim.text).map(s=>s+'\n'),
            r=      vim._cursor.r,
            c=      vim._cursor.c
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
})
