Promise.all([
    module.shareImport('prototype.mode/Cursor.js'),
]).then(modules=>{
    let Cursor=modules[0]
    return{
        set(val){
            this._mode=val
            this._viewChanged.mode=true
            this._modeData={}
            if(this._mode=='cmdline'){
                this._modeData.inputBuffer=''
                this._modeData.cursor=new Cursor(v=>
                    this._modeData.inputBuffer=v
                ,()=>
                    this._modeData.inputBuffer
                )
            }
        },get(){
            return this._mode
        }
    }
})
