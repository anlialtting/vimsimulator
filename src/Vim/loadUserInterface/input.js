module.repository.shift=module.shareImport('input/shift.js'),
Promise.all([
    module.shareImport('input/normal.js'),
    module.shareImport('input/insert.js'),
    module.shareImport('input/visual.js'),
    module.shareImport('input/cmdline.js'),
]).then(modules=>{
    let
        modes={
            normal:     modules[0],
            insert:     modules[1],
            visual:     modules[2],
            cmdline:    modules[3],
        }
    return{set(val){
        modes[this.mode](this,val)
    }}
})
