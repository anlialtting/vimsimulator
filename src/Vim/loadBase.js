let proto=Promise.all([
    module.shareImport('loadBase/prototype._welcomeText.js'),
    module.shareImport('loadBase/prototype._write.js'),
    module.shareImport('loadBase/prototype._edit.js'),
    module.shareImport('loadBase/prototype._mode.js'),
    module.shareImport('loadBase/prototype._text.js'),
])
;(async()=>{
    proto=await proto
    return o=>{
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
        Object.defineProperty(o,'_mode',proto[3])
        Object.defineProperty(o,'_text',proto[4])
        o._write=proto[1]
        o._edit=proto[2]
        o._welcomeText=proto[0]
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
})()
