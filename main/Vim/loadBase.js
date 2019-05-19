import _welcomeText from './loadBase/prototype._welcomeText.js'
import _write from './loadBase/prototype._write.js'
import _edit from './loadBase/prototype._edit.js'
import _mode from './loadBase/prototype._mode.js'
import _text from './loadBase/prototype._text.js'
export default o=>{
    o._quit=function(){
        this.emit('quit')
    }
    Object.defineProperty(o,'_trueText',{set(val){
        if(this._text=='')
            this._text='\n'
        this._text=val
    },get(){
        return this._values.text||'\n'
    }})
    o._ui=function(){
        this._uis.forEach(ui=>
            ui._updateByVim(this._viewChanged)
        )
        this._viewChanged={}
    }
    o._read=function(path){
        return this.read&&this.read(path)
    }
    Object.defineProperty(o,'_mode',_mode)
    Object.defineProperty(o,'_text',_text)
    o._write=_write
    o._edit=_edit
    o._welcomeText=_welcomeText
    o._setOption=function(key,value){
        this._options[key]=value
        this._viewChanged.options=this._viewChanged.options||{}
        this._viewChanged.options[key]=null
    }
    o._setRegister=function(key,value){
        this._registers[key]=value
        if(key=='+')
            this.copy&&this.copy(value.string)
    }
    Object.defineProperty(o,'_mainUi',{get(){
        if(!this._values._mainUi){
            this._values._mainUi=this.ui
            this._values._mainUi.width=80
            this._values._mainUi.height=24
        }
        return this._values._mainUi
    }})
}
