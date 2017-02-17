(async()=>{
    let
        visualRange=await module.repository.visualRange,
        shift=await module.repository.shift
    function main(vim,val){
        if(typeof val=='string'){
            if(val=='d'){
                let
                    r=visualRange(vim),
                    a=vim._text.substring(0,r.s),
                    b=vim._text.substring(r.s,r.e),
                    c=vim._text.substring(r.e)
                vim._text=a+c
                vim._registers['"']={mode:'string',string:b}
                vim._cursor.moveTo(r.s)
                vim._mode='normal'
                return
            }
            if(val=='h')
                return vim._cursor.moveLeft()
            if(val=='j')
                return vim._cursor.moveDown()
            if(val=='k')
                return vim._cursor.moveUp()
            if(val=='l')
                return vim._cursor.moveRight()
            if(val=='y'){
                let r=visualRange(vim)
                vim._registers['"']={
                    mode:'string',
                    string:vim._text.substring(r.s,r.e),
                }
                vim._cursor.moveTo(r.s)
                vim._mode='normal'
                return
            }
            if(val=='<'){
                let r=visualRange(vim)
                let cursor=Object.create(vim._cursor)
                cursor.moveTo(r.s)
                let s=cursor.r
                cursor.moveTo(r.e)
                let e=cursor.r
                shift.left(vim,s,e+1)
                vim._mode='normal'
                return
            }
            if(val=='>'){
                let r=visualRange(vim)
                let cursor=Object.create(vim._cursor)
                cursor.moveTo(r.s)
                let s=cursor.r
                cursor.moveTo(r.e)
                let e=cursor.r
                shift.right(vim,s,e+1)
                vim._mode='normal'
                return
            }
        }else if(typeof val=='object'){
            if(
                val.key=='Escape'||
                val.ctrlKey&&val.key=='c'||
                val.ctrlKey&&val.key=='['
            )
                return vim._mode='normal'
        }
    }
    return(vim,val)=>{
        main(vim,val)
        vim._ui()
    }
})()
