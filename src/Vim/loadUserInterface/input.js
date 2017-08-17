module.repository.shift=module.shareImport('input/shift.js')
;(async()=>{
    let
        [normal,insert,visual,cmdline]=await Promise.all([
            module.shareImport('input/normal.js'),
            module.shareImport('input/insert.js'),
            module.shareImport('input/visual.js'),
            module.shareImport('input/cmdline.js'),
        ]),
        modes={normal,insert,visual,cmdline,}
    return{set(val){
        modes[this.mode](this,val)
    }}
})()
