import lc from './lc.js'
export default function(){
    let p=this._registers['%']
    this.write&&this.write(p)
    return `${p?`"${p}"`:'[Event-Only]'} ${lc(this._text)} written`
}
