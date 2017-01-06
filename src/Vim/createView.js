Promise.all([
    module.shareImport('createView/createTextDiv.js'),
]).then(modules=>{
    let
        createTextDiv=modules[0]
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
            div=document.createElement('div')
        vim.inputTag.style.outline='none'
        vim.inputTag.style.width='0'
        vim.inputTag.style.color='white'
        vim.inputTag.style.backgroundColor='black'
        div.style.position='relative'
        div.appendChild(createTextDiv(vim))
        div.appendChild(createCommandDiv(vim))
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
