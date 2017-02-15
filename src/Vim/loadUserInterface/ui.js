module.repository.measureWidth=
    module.shareImport('ui/measureWidth.js')
function GreedyText(){
    this.lines=[]
}
Object.defineProperty(GreedyText.prototype,'update',{set(val){
    if(typeof val=='string'){
        val=val.split('\n')
        val.pop()
        this.lines=val
    }
}})
Object.defineProperty(GreedyText.prototype,'string',{get(){
    let a=this.lines.slice()
    a.push('')
    return a.join('\n')
}})
var EventEmmiter=module.repository.npm.events
Promise.all([
    module.shareImport('ui/createCliDiv.js'),
    module.repository.measureWidth,
]).then(async modules=>{
    let
        createCliDiv=       modules[0],
        measureWidth=       modules[1]
    EventEmmiter=       await EventEmmiter
    function Ui(vim){
        EventEmmiter.call(this)
        this._values={}
        this._vim=vim
        this._fontSize=13
        this._wrapMethod='greedy'
        this._refreshMinTime=16
        this._cursorSymbol=Symbol()
        this.node=createViewNode(this)
    }
    Object.setPrototypeOf(Ui.prototype,EventEmmiter.prototype)
    Object.defineProperty(Ui.prototype,'_fontSize',{set(v){
        this._values._fontSize=v
        this._values._fontWidth=measureWidth(this._fontSize)
    },get(){
        return this._values._fontSize
    }})
    Object.defineProperty(Ui.prototype,'_fontWidth',{get(){
        return this._values._fontWidth
    }})
    Ui.prototype._update=function(){
        this.emit('update')
    }
    Ui.prototype._updateByVim=function(changed){
        for(let k in changed){let v=changed[k]
            switch(k){
                case 'mode':
                    this.emit('modeChange')
                    break
                case 'text':
                    if(this._wrapMethod=='greedy'){
                        v.map(u=>
                            //this._wrapMethodData.text.update=u
                            this._wrapMethodData.text.update=
                                this._vim._trueText
                        )
                    }
            }
        }
        this._update()
    }
    Object.defineProperty(Ui.prototype,'_wrapMethod',{set(val){
        this._values.wrapMethod=val
        if(this._values.wrapMethod=='greedy'){
            let text=new GreedyText
            text.update=this._vim._trueText
            this._wrapMethodData={
                _scroll:0,
                text,
            }
        }else if(this._values.wrapMethod=='fixed'){
            this._wrapMethodData={
                _scroll:0,
            }
        }
    },get(){
        return this._values.wrapMethod
    }})
    Object.defineProperty(Ui.prototype,'width',{set(val){
        this._width=val
        this._update()
    },get(){
        return this._width
    }})
    Object.defineProperty(Ui.prototype,'height',{set(val){
        this._height=val
        this._update()
    },get(){
        return this._height
    }})
    Ui.prototype.focus=function(){
        this._inputTag.focus()
    }
    Object.defineProperty(Ui.prototype,'free',{get(){
        this._vim.removeUi(this)
    }})
    function createViewNode(ui){
        let n=createCliDiv(ui)
        n.classList.add('webvim')
        n.addEventListener('click',()=>
            ui._vim.focus()
        )
        return n
    }
    return{get(){
        let ui=new Ui(this)
        this._uis.add(ui)
        return ui
    }}
})
