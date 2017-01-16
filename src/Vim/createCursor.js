Promise.all([
    module.shareImport('createCursor/VimCursor.js'),
]).then(modules=>{
    let
        VimCursor=              modules[0]
    function createCursor(vim){
        let cursor=new VimCursor
        Object.defineProperty(cursor,'text',{get(){
            return vim._trueText
        }})
        Object.defineProperty(cursor,'mode',{get(){
            return vim._mode
        }})
        return cursor
    }
    return createCursor
})
