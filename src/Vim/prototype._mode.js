Promise.all([
    module.shareImport('prototype._mode/Cursor.js'),
]).then(modules=>{
    let Cursor=modules[0]
    return{
        set(val){
            this._values.mode=val
            this._viewChanged.mode=true
            this._modeData={}
            if(this._values.mode=='insert'){
                this._welcomeText=undefined
            }
            if(this._values.mode=='visual'){
                this._modeData.cursor=this._cursor.abs
                this._welcomeText=undefined
            }
            if(this._values.mode=='cmdline'){
                this._modeData.inputBuffer=''
                this._modeData.cursor=new Cursor(v=>
                    this._modeData.inputBuffer=v
                ,()=>
                    this._modeData.inputBuffer
                )
            }
        },get(){
            return this._values.mode
        }
    }
})
