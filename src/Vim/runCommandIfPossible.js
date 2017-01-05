Promise.all([
    module.shareImport('runCommandIfPossible/normal.js'),
    module.shareImport('runCommandIfPossible/insert.js'),
    module.shareImport('runCommandIfPossible/visual.js'),
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
