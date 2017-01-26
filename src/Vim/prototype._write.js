(function(){
    this.emit('write',this._registers['%'])
    let
        l=this._text.split('\n').length-1,
        c=this._text.length
    return `${
        this._registers['%']?
            `"${this._registers['%']}"`
        :
            '[Event]'
    } ${l}L, ${c}C written`
})
