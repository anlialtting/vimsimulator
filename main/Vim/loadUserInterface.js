import input from './loadUserInterface/input.js'
import uiPromise from './loadUserInterface/ui.js'
export default(async()=>{
    let[
        ui,
    ]=await Promise.all([
        uiPromise,
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
