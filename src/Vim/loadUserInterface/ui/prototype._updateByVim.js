function optionChange(ui,options){
    for(let k of options)switch(k){
        case 'list':
            if(ui._wrapMethod=='greedy')
                ui._wrapMethodData.text.setOption(
                    'list',ui._vim._options[k]
                )
            break
        case 'number':
            ui._wrapMethodData.text.width=ui._textWidth
            break
    }
}
;(function(changed){
    for(let k in changed){let v=changed[k]
        switch(k){
            case 'mode':
                this._viewNode.modeChange()
                break
            case 'text':
                if(this._wrapMethod=='greedy'){
                    if(this._sync&&this._vim._text!='')
                        v.map(u=>
                            this._wrapMethodData.text.update=u
                        )
                    else
                        this._wrapMethodData.text.update=
                            this._vim._trueText
                    this._sync=
                        this._vim._text==this._wrapMethodData.text.string
                }
                break
            case 'options':
                optionChange(this,Object.keys(v))
                break
        }
    }
    this._update()
})
