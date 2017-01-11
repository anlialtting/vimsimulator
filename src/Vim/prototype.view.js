Promise.all([
    module.shareImport('prototype.view/createTextDiv.js'),
    module.shareImport('prototype.view/measureWidth.js'),
    module.shareImport('prototype.view/htmlEntities.js'),
    module.shareImport('prototype.view/createInput.js'),
]).then(modules=>{
    let
        createTextDiv=  modules[0],
        measureWidth=   modules[1],
        htmlEntities=   modules[2],
        createInput=    modules[3]
    function View(vim){
        this._vim=vim
        this._scroll=0
        this._inputTag=createInput(this._vim)
        createViewDiv(this)
    }
    Object.defineProperty(View.prototype,'width',{set(val){
        this._width=val
        this.div.style.width=`${
            measureWidth(this._vim,'a'.repeat(this.width))
        }px`
    },get(){
        return this._width
    }})
    Object.defineProperty(View.prototype,'height',{set(val){
        this._height=val
        this.div.style.height=`${this._vim._lineHeightInPx*this.height}px`
    },get(){
        return this._height
    }})
    View.prototype.focus=function(){
        this._inputTag.focus()
    }
    function createViewDiv(view){
        let
            vim=view._vim,
            div=document.createElement('div')
        div.style.position='relative'
        div.appendChild(createTextDiv(view))
        div.appendChild(createCommandDiv(vim))
        div.appendChild(view._inputTag)
        vim.on('view',changed=>{
            let span=div.getElementsByClassName('cursor')[0]
            if(span){
                let rect=span.getBoundingClientRect()
                view._inputTag.style.left=`${rect.left}px`
                view._inputTag.style.top=`${rect.top}px`
            }
        })
        view.div=div
    }
    function createCommandDiv(vim){
        let div=document.createElement('div')
        div.style.fontFamily='monospace'
        div.style.fontSize=`${vim._lineHeightInPx}px`
        div.style.lineHeight='1'
        div.style.whiteSpace='pre'
        f()
        vim.on('view',changed=>{
            if(changed.indexOf('mode')<0)
                return
            f()
        })
        return div
        function f(){
            if(vim.mode=='normal')
                div.textContent=''
            else if(vim.mode=='insert')
                div.textContent='-- INSERT --'
            else if(vim.mode=='visual')
                div.textContent='-- VISUAL --'
            else if(vim.mode=='visual-block')
                div.textContent='-- VISUAL BLOCK --'
            else if(vim.mode=='cmdline'){
                update(div)
                vim.on('view',listener)
                function listener(){
                    if(vim.mode=='cmdline')
                        update(div)
                    else
                        vim.removeListener('view',listener)
                }
            }
        }
        function update(div){
            let
                text=vim._modeData.inputBuffer,
                cursor=vim._modeData.cursor.position
            if(cursor==text.length)
                text+=' '
            div.innerHTML=`${
                htmlEntities.encode(text.substring(0,cursor))
            }<span style=background-color:black;color:white>${
                htmlEntities.encode(text.substring(cursor,cursor+1))
            }</span>${
                htmlEntities.encode(text.substring(cursor+1))
            }`
        }
    }
    return{get(){
        return new View(this)
    }}
})
