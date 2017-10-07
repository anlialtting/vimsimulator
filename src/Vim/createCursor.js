import VimCursor from './createCursor/VimCursor.js'
function createCursor(vim){
    let cursor=new VimCursor,trueCursor=cursor._exotic
    Object.defineProperty(cursor,'text',{configurable:true,get(){
        return vim._text
    }})
    Object.defineProperty(cursor,'mode',{get(){
        return vim._mode
    }})
    Object.defineProperty(trueCursor,'text',{get(){
        return vim._trueText
    }})
    return[cursor,trueCursor]
}
export default createCursor
