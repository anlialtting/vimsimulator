Promise.all([
    module.shareImport('prototype.view/createTextDiv.js'),
    module.shareImport('measureWidth.js'),
]).then(modules=>{
    let
        createTextDiv=modules[0],
        measureWidth=modules[1]
    function View(vim){
        this._vim=vim
        this._scroll=0
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
    function createViewDiv(view){
        let
            vim=view._vim,
            div=document.createElement('div')
        vim._inputTag.style.outline='none'
        vim._inputTag.style.width='0'
        vim._inputTag.style.color='white'
        vim._inputTag.style.backgroundColor='black'
        vim._inputTag.style.zIndex='1'
        vim._inputTag.style.position='fixed'
        div.style.position='relative'
        div.appendChild(createTextDiv(view))
        div.appendChild(createCommandDiv(vim))
        div.appendChild(vim._inputTag)
        vim.on('view',changed=>{
            let span=div.getElementsByClassName('cursor')[0]
            if(span){
                let rect=span.getBoundingClientRect()
                vim._inputTag.style.left=`${rect.left}px`
                vim._inputTag.style.top=`${rect.top}px`
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
        }
    }
    return{get(){
        return new View(this)
    }}
})
