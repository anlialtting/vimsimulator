function EventEmmiter(){
    this._listeners={}
}
EventEmmiter.prototype._keyExist=function(key){
    return key in this._listeners
}
EventEmmiter.prototype._ensureKeyExist=function(key){
    if(!(key in this._listeners))
        this._listeners[key]=new Map
}
EventEmmiter.prototype.emit=function(key,event){
    if(!this._keyExist(key))
        return
    for(let[listener,doc]of[...this._listeners[key].entries()]){
        if(doc.once)
            this.off(key,listener)
        listener(event)
    }
}
EventEmmiter.prototype.off=function(key,listener){
    if(!this._keyExist(key))
        return
    this._listeners[key].delete(listener)
}
EventEmmiter.prototype.on=function(key,listener){
    this._ensureKeyExist(key)
    this._listeners[key].set(listener,{once:false})
}
EventEmmiter.prototype.once=function(key,listener){
    this._ensureKeyExist(key)
    this._listeners[key].set(listener,{once:true})
}
export default EventEmmiter
