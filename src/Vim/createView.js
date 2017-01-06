Promise.all([
    module.shareImport('createView/htmlEntities.js'),
    module.shareImport('createView/line.js'),
]).then(modules=>{
    let
        htmlEntities=modules[0],
        line=modules[1]
    function View(vim){
        this._vim=vim
        createViewDiv(this)
    }
    Object.defineProperty(View.prototype,'width',{set(val){
        this._width=val
        this.div.style.width=`${this._vim.lineHeightInPx/2*this.width}px`
    },get(){
        return this._width
    }})
    Object.defineProperty(View.prototype,'height',{set(val){
        this._height=val
        this.div.style.height=`${this._vim.lineHeightInPx*this.height}px`
    },get(){
        return this._height
    }})
    function createViewDiv(view){
        let
            vim=view._vim,
            div=document.createElement('div'),
            commandDiv=createCommandDiv(vim)
        vim.inputTag.style.outline='none'
        vim.inputTag.style.width='0'
        vim.inputTag.style.color='white'
        vim.inputTag.style.backgroundColor='black'
        div.style.position='relative'
        div.appendChild(createTextDiv(vim))
        div.appendChild(commandDiv)
        div.appendChild(vim.inputTag)
        vim.on('view',changed=>{
            let r=vim.text?vim._cursor.r:0
            vim.inputTag.style.top=`${
                (r+1)*vim.lineHeightInPx
            }px`
        })
        view.div=div
    }
    function createCommandDiv(vim){
        let
            div=document.createElement('div')
        div.style.fontFamily='monospace'
        div.style.fontSize=`${vim.lineHeightInPx}px`
        div.style.lineHeight='1'
        div.style.whiteSpace='pre'
        vim.on('view',changed=>{
            if(changed.indexOf('mode')<0)
                return
            if(vim.mode=='normal')
                div.textContent=''
            else if(vim.mode=='insert')
                div.textContent='-- INSERT --'
            else if(vim.mode=='visual')
                div.textContent='-- VISUAL --'
            else if(vim.mode=='visual-block')
                div.textContent='-- VISUAL BLOCK --'
            else if(vim.mode=='cmdline'){
                update()
                vim.on('view',listener)
                function listener(){
                    update()
                    if(vim.mode!='cmdline')
                        vim.removeListener('view',listener)
                }
                function update(){
                    div.textContent=vim.command
                }
            }
        })
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
    return function(){
        return new View(this)
    }
})
