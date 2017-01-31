module.import('lc.js').then(lc=>{
    return(function(){
        let p=this._registers['%']
        //this.emit('write',p)
        this.write&&this.write(p)
        return `${p?`"${p}"`:'[Event-Only]'} ${lc(this._text)} written`
    })
})
