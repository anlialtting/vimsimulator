Promise.all([
    module.shareImport('command/normal.js'),
    module.shareImport('command/insert.js'),
    module.shareImport('command/visual.js'),
]).then(modules=>{
    let
        modes={
            normal:modules[0],
            insert:modules[1],
            visual:modules[2],
        }
    return function(){
        if(this.mode in modes)
            return modes[this.mode](this)
    }
})
