Promise.all([
    module.shareImport('runCommandIfPossible/runCommandIfPossibleForNormalMode.js'),
    module.shareImport('runCommandIfPossible/runCommandIfPossibleForVisualMode.js'),
    module.shareImport('runCommandIfPossible/runCommandIfPossibleForInsertMode.js'),
]).then(modules=>{
    let
        runCommandIfPossibleForNormalMode=modules[0],
        runCommandIfPossibleForVisualMode=modules[1],
        runCommandIfPossibleForInsertMode=modules[2]
    function runCommandIfPossible(){
        if(this.mode=='normal')
            return runCommandIfPossibleForNormalMode.call(this)
        if(this.mode=='insert')
            return runCommandIfPossibleForInsertMode(this)
        if(this.mode=='visual')
            return runCommandIfPossibleForMode2(this)
    }
    return runCommandIfPossible
})
