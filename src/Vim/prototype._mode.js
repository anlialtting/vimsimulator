Promise.all([
    module.shareImport('prototype._mode/Cursor.js'),
]).then(modules=>{
    let Cursor=modules[0]
    return{
        set(val){
            this._viewChanged.mode=true
            this._modeData={}
            if(val=='insert'){
                this._cursor.moveTo(this._cursor.abs)
                this._welcomeText=undefined
            }
            if(val=='visual'){
                this._modeData.cursor=this._cursor.abs
                this._welcomeText=undefined
            }
            if(val=='cmdline'){
                this._modeData.inputBuffer=''
                this._modeData.cursor=new Cursor(v=>
                    this._modeData.inputBuffer=v
                ,()=>
                    this._modeData.inputBuffer
                )
            }
            this._values.mode=val
        },get(){
            return this._values.mode
        }
    }
})
