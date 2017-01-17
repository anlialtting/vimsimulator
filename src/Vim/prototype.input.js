Promise.all([
    module.shareImport('prototype.input/normal.js'),
    module.shareImport('prototype.input/insert.js'),
    module.shareImport('prototype.input/visual.js'),
    module.shareImport('prototype.input/cmdline.js'),
]).then(modules=>{
    let
        modes={
            normal:     modules[0],
            insert:     modules[1],
            visual:     modules[2],
            cmdline:    modules[3],
        }
    return{set(val){
        console.log(this._cursor.abs)
        modes[this.mode](this,val)
    }}
})
