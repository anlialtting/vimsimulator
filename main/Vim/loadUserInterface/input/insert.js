function main(vim,val){
    if(typeof val=='object')
        val=object(vim,val)
    if(typeof val=='string'){
        let abs=vim._trueCursor.abs
        val=val.replace(/\r/,'\n')
        vim._trueText={
            function:'insert',
            position:abs,
            string:val,
        }
        vim._trueCursor.moveTo(abs+val.length)
    }
}
function object(vim,val){
    if(
        val.ctrlKey&&val.key=='c'||
        val.ctrlKey&&val.key=='['
    )
        val={key:'Escape'}
    switch(val.key){
        case 'ArrowDown':
            vim._trueCursor.moveDown()
            return
        case 'ArrowLeft':
            vim._trueCursor.moveLeft()
            return
        case 'ArrowRight':
            vim._trueCursor.moveRight()
            return
        case 'ArrowUp':
            vim._trueCursor.moveUp()
            return
        case 'Backspace':
            {
                let abs=vim._trueCursor.abs
                if(abs==0)
                    return
                vim._text={
                    function:'delete',
                    start:abs-1,
                    end:abs,
                }
                vim._trueCursor.moveTo(abs-1)
            }
            return
        case 'Delete':
            {
                let
                    txt=vim._trueText,
                    abs=vim._trueCursor.abs
                if(abs+1==txt.length)
                    return
                vim._text={
                    function:'delete',
                    start:abs,
                    end:abs+1,
                }
                vim._trueCursor.moveTo(abs)
            }
            return
        case 'Enter':
            return '\r'
        case 'Escape':
            vim._undoBranchManager.push(vim._text)
            vim._mode='normal'
            return
        case 'Tab':
            {
                let abs=vim._trueCursor.abs
                vim._text={
                    function:'insert',
                    position:abs,
                    string:'\t',
                }
                vim._trueCursor.moveTo(abs+1)
            }
            return
    }
}
export default(vim,val)=>{
    let r=main(vim,val)
    vim._ui()
    return r
}
