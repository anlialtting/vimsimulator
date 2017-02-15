({
    set(val){
        let set=val=>{
            if(typeof val=='string'){
                this._values.text=val
            }else if(typeof val=='object'){
                let txt=this._values.text
                if(val.function=='insert')
                    this._values.text=
                        txt.substring(0,val.position)+
                        val.string+
                        txt.substring(val.position)
                else if(val.function=='delete')
                    this._values.text=
                        txt.substring(0,val.start)+
                        txt.substring(val.end)
            }
            this._viewChanged.text=this._viewChanged.text||[]
            this._viewChanged.text.push(val)
        }
        set(val)
        if(/[^\n]$/.test(this._values.text))set({
            function:'insert',
            position:this._values.text.length,
            string:'\n',
        })
    },get(){
        return this._values.text
    }
})
