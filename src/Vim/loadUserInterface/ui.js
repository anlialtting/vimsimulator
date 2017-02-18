module.repository.measureWidth= module.shareImport('ui/measureWidth.js')
module.repository.stringWidth=  module.shareImport('ui/stringWidth.js')
function optionChange(ui,options){
    for(let k of options)switch(k){
        case 'list':
            if(ui._wrapMethod=='greedy')
                ui._wrapMethodData.text.update=ui._vim._trueText
            break
    }
}
var
    EventEmmiter=   module.repository.npm.events,
    GreedyText=     module.shareImport('ui/GreedyText.js'),
    createCliDiv=   module.shareImport('ui/createCliDiv.js')
;(async()=>{
    let measureWidth=await module.repository.measureWidth
    createCliDiv=await createCliDiv
    EventEmmiter=await EventEmmiter
    GreedyText=await GreedyText
    function Ui(vim){
        EventEmmiter.call(this)
        this._values={
            clockCycle:16,
        }
        this._vim=vim
        this._fontSize=13
        this._wrapMethod='greedy'
        this._cursorSymbol=Symbol()
        this.node=createViewNode(this)
        setUpClock(this)
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
                        /*v.map(u=>
                            this._wrapMethodData.text.update=u
                        )*/
                        this._wrapMethodData.text.update=
                            this._vim._trueText
                    }
                    break
                case 'options':
                    optionChange(this,Object.keys(v))
                    break
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
        tearDownClock(this)
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
    function setUpClock(ui){
        ui._clockIntervalId=setInterval(()=>
            ui.emit('_clock')
        ,ui._values.clockCycle)
    }
    function tearDownClock(ui){
        clearInterval(ui._clockIntervalId)
        delete ui._clockIntervalId
    }
    return{get(){
        let ui=new Ui(this)
        this._uis.add(ui)
        return ui
    }}
})()
