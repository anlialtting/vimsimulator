import View from './Cli/View.js'
import EventEmmiterPromise from '../../../../events.js'
import widthPromise from '../../stringWidth.js'
export default(async()=>{
    let
        EventEmmiter=   await EventEmmiterPromise,
        width=          await widthPromise
    function Cli(){
        EventEmmiter.call(this)
        this._children=[]
    }
    Object.setPrototypeOf(Cli.prototype,EventEmmiter.prototype)
    Object.defineProperty(Cli.prototype,'view',{get(){
        let view=new View(this)
        this.on('view',()=>view.update)
        return view
    }})
    Cli.prototype.clear=function(){
        this._flushed=false
        this._children=[]
    }
    Cli.prototype.flush=function(){
        if(this._flushed)
            return
        this.emit('view')
        this._flushed=true
    }
    Cli.prototype.appendChild=function(child){
        this._flushed=false
        if(
            typeof child=='string'||
            child instanceof Cli
        )
            child={child}
        if(!('r' in child))
            child.r=0
        if(!('c' in child))
            child.c=0
        if(typeof child.child=='string'){
            let r=0,c=0
            for(let i=0;i<child.child.length;i++){
                let chr=child.child[i]
                this._children.push({
                    child:chr,
                    r:child.r+r,
                    c:child.c+c,
                    class:child.class,
                    style:child.style,
                })
                if(chr=='\n'){
                    r++
                    c=0
                }else{
                    c+=width(chr)
                }
            }
        }else
            this._children.push(child)
    }
    return Cli
})()
