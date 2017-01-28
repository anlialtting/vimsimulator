Promise.all([
    module.shareImport('prototype.input.js'),
    module.shareImport('prototype.ui.js'),
]).then(modules=>{
    return o=>{
        Object.defineProperty(o,'mode',{get(){
            return this._mode
        }})
        Object.defineProperty(o,'text',{
            set(val){
                this._text=val
                this._welcomeText=undefined
                this._undoBranchManager.clear()
                this._undoBranchManager.push(this._text)
                this._view()
            },get(){
                return this._text
            }
        })
        o.focus=function(){
            this._mainUi.focus()
        }
        Object.defineProperty(o,'input',modules[0])
        Object.defineProperty(o,'ui',modules[1])
    }
})
