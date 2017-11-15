module.repository.visualRange=
    module.module('loadUserInterface/visualRange.js')
;(async()=>{
    let[
        input,
        ui,
    ]=await Promise.all([
        module.module('loadUserInterface/input.js'),
        module.shareImport('loadUserInterface/ui.js'),
    ])
    return o=>{
        Object.defineProperty(o,'cursor',{get(){
            return this._cursor.abs
        }})
        Object.defineProperty(o,'mode',{get(){
            return this._mode
        }})
        Object.defineProperty(o,'text',{
            set(val){
                this._text=val
                this._welcomeText=undefined
                this._undoBranchManager.clear()
                this._undoBranchManager.push(this._text)
                this._ui()
            },get(){
                return this._text
            }
        })
        o.focus=function(){
            this._mainUi.focus()
        }
        Object.defineProperty(o,'input',input)
        Object.defineProperty(o,'ui',ui)
    }
})()
