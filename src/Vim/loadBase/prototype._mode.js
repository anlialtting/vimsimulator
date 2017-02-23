(async()=>{
    let Cursor=await module.shareImport('prototype._mode/Cursor.js')
    return{
        set(val){
            this._viewChanged.mode=true
            this._modeData={}
            let abs=this._cursor.abs
            if(val=='insert'){
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
            this._cursor.moveTo(abs)
        },get(){
            return this._values.mode
        }
    }
})()
