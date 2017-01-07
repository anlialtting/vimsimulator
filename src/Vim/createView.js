Promise.all([
    module.shareImport('createView/createTextDiv.js'),
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
        this.div.style.height=`${this._vim.lineHeightInPx*this.height}px`
    },get(){
        return this._height
    }})
    function createViewDiv(view){
        let
            vim=view._vim,
            div=document.createElement('div')
        vim.inputTag.style.outline='none'
        vim.inputTag.style.width='0'
        vim.inputTag.style.color='white'
        vim.inputTag.style.backgroundColor='black'
        vim.inputTag.style.zIndex='1'
        vim.inputTag.style.position='fixed'
        div.style.position='relative'
        div.appendChild(createTextDiv(view))
        div.appendChild(createCommandDiv(vim))
        document.body.appendChild(vim.inputTag)
        vim.on('view',changed=>{
            let span=div.getElementsByClassName('cursor')[0]
            if(span){
                let rect=span.getBoundingClientRect()
                vim.inputTag.style.left=`${rect.left}px`
                vim.inputTag.style.top=`${rect.top}px`
            }
        })
        view.div=div
    }
    function createCommandDiv(vim){
        let div=document.createElement('div')
        div.style.fontFamily='monospace'
        div.style.fontSize=`${vim.lineHeightInPx}px`
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
    return function(){
        return new View(this)
    }
})
