function main(vim,val){
    if(typeof val=='object'){
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
                    let
                        txt=vim._trueText,
                        abs=vim._cursor.abs
                    if(abs==0)
                        return
                    vim._text=txt.substring(0,abs-1)+txt.substring(abs),
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
                    vim._text=txt.substring(0,abs)+txt.substring(abs+1)
                    vim._cursor.moveTo(abs)
                }
                return
            case 'Enter':
                val='\r'
                break
            case 'Escape':
                vim._mode='normal'
                return
            case 'Tab':
                {
                    let
                        txt=vim._trueText,
                        abs=vim._cursor.abs
                    vim._text=txt.substring(0,abs)+'\t'+txt.substring(abs)
                    vim._cursor.moveTo(abs+1)
                }
                return
        }
    }
    if(typeof val=='string'){
        let
            txt=vim._trueText,
            abs=vim._cursor.abs
        val=val.replace(/\r/,'\n')
        vim._text=txt.substring(0,abs)+val+txt.substring(abs)
        vim._cursor.moveTo(abs+val.length)
    }
}
((vim,val)=>{
    let r=main(vim,val)
    vim._view()
    return r
})
