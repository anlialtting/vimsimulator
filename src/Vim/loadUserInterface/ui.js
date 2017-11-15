;(async()=>{
    let[
        measureWidth,
        GreedyText,
        createViewNode,
        _updateByVim,
    ]=await Promise.all([
        module.module('ui/measureWidth.js'),
        module.module('ui/GreedyText.js'),
        module.module('ui/createViewNode.js'),
        module.shareImport('ui/prototype._updateByVim.js'),
    ])
    function Ui(vim){
        this._values={}
        this._vim=vim
        this._width=80
        this._height=24
        this._fontSize=13
        this._wrapMethod='greedy'
        this._cursorSymbol=Symbol()
        this._viewNode=createViewNode(this)
        this.node=this._viewNode.node
        setUpClock(this)
    }
    Object.defineProperty(Ui.prototype,'_fontSize',{set(v){
        this._values._fontSize=v
        this._values._fontWidth=measureWidth(this._fontSize)
    },get(){
        return this._values._fontSize
    }})
    Object.defineProperty(Ui.prototype,'_fontWidth',{get(){
        return this._values._fontWidth
    }})
    Object.defineProperty(Ui.prototype,'_numberWidth',{get(){
        return Math.max(3,Math.floor(
            Math.log(this._vim._trueCursor._countOfRows)/Math.log(10)
        )+1)
    }})
    Object.defineProperty(Ui.prototype,'_textWidth',{get(){
        return this._vim._options.number?
            this._width-(this._numberWidth+1)
        :
            this._width
    }})
    Ui.prototype._checkScroll=function(){
        let
            height=         this._height,
            data=           this._wrapMethodData,
            txt=            data.text,
            c=              this._vim._trueCursor,
            cursorViewRow=  txt.row(c._countOfCols==0?c.line(c.r):c.abs)
        if(data._scroll+height-1<=cursorViewRow)
            data._scroll=cursorViewRow-(height-1)+1
        if(cursorViewRow<data._scroll)
            data._scroll=cursorViewRow
    }
    Ui.prototype._update=function(){
        this._viewNode.update()
    }
    Ui.prototype._updateByVim=_updateByVim
    Object.defineProperty(Ui.prototype,'_wrapMethod',{set(val){
        this._values.wrapMethod=val
        if(this._values.wrapMethod=='greedy'){
            let text=new GreedyText
            text.width=this._textWidth
            text.update=this._vim._trueText
            text.setOption('list',this._vim._options.list)
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
    function setUpClock(ui){
        let f=()=>{
            ui._animationFrame=requestAnimationFrame(f)
            ui._viewNode.flush()
        }
        ui._animationFrame=requestAnimationFrame(f)
    }
    function tearDownClock(ui){
        cancelAnimationFrame(ui._animationFrame)
        delete ui._animationFrame
    }
    return{get(){
        let ui=new Ui(this)
        this._uis.add(ui)
        return ui
    }}
})()
