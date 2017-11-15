import normal from'./input/normal.js'
import insert from'./input/insert.js'
import visual from'./input/visual.js'
import cmdline from'./input/cmdline.js'
let modes={normal,insert,visual,cmdline,}
export default{set(val){
    modes[this.mode](this,val)
}}
