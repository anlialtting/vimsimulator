import lc from './lc.js'
export default function(p){
    let read=this.read(p)
    this._registers['%']=p
    if(read==undefined){
        this.text=''
        return `"${p}" [New File]`
    }else{
        this.text=read
        return `"${p}" ${lc(read)}`
    }
}
