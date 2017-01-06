Promise.all([
    module.shareImport('command/normal.js'),
    module.shareImport('command/insert.js'),
    module.shareImport('command/visual.js'),
    module.shareImport('command/cmdline.js'),
]).then(modules=>{
    let
        modes={
            normal:modules[0],
            insert:modules[1],
            visual:modules[2],
            cmdline:modules[3],
        }
    return function(){
        if(this.mode in modes)
            return modes[this.mode](this)
    }
})
