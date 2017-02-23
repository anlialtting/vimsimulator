function main(vim,val){
    if(typeof val=='object')
        val=object(vim,val)
    if(typeof val=='string'){
        let abs=vim._cursor.abs
        val=val.replace(/\r/,'\n')
        vim._trueText={
            function:'insert',
            position:abs,
            string:val,
        }
        vim._cursor.moveTo(abs+val.length)
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
            vim._cursor.moveDown()
            return
        case 'ArrowLeft':
            vim._cursor.moveLeft()
            return
        case 'ArrowRight':
            vim._cursor.moveRight()
            return
        case 'ArrowUp':
            vim._cursor.moveUp()
            return
        case 'Backspace':
            {
                let abs=vim._cursor.abs
                if(abs==0)
                    return
                vim._text={
                    function:'delete',
                    start:abs-1,
                    end:abs,
                }
                vim._cursor.moveTo(abs-1)
            }
            return
        case 'Delete':
            {
                let
                    txt=vim._trueText,
                    abs=vim._cursor.abs
                if(abs+1==txt.length)
                    return
                vim._text={
                    function:'delete',
                    start:abs,
                    end:abs+1,
                }
                vim._cursor.moveTo(abs)
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
                let abs=vim._cursor.abs
                vim._text={
                    function:'insert',
                    position:abs,
                    string:'\t',
                }
                vim._cursor.moveTo(abs+1)
            }
            return
    }
}
;((vim,val)=>{
    let r=main(vim,val)
    vim._ui()
    return r
})
