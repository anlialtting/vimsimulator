(async()=>{
    let docs=await module.repository.docs
    function A(vim){
        vim._mode='insert'
        vim._cursor.moveToEOL()
        return docs.ac
    }
    function D(vim,cmd,arg){
        return{
            function:'D',
            count:arg||1,
            register:'"',
        }
    }
    function G(vim,cmd,arg){
        arg=arg||vim._cursor._countOfRows
        arg=Math.min(vim._cursor._countOfRows,arg)
        vim._cursor.moveTo(vim._cursor.line(arg-1))
        return docs.ac
    }
    function I(vim,cmd,arg){
        vim._mode='insert'
        vim._cursor.moveTo(vim._cursor.lineStart)
        return docs.ac
    }
    function O(vim,cmd,arg){
        let
            c=vim._cursor.lineStart,
            txt=vim._trueText
        vim._mode='insert'
        vim._text=txt.substring(0,c)+'\n'+txt.substring(c)
        vim._cursor.moveTo(vim._cursor.lineStart)
        return docs.acc
    }
    function P(vim,cmd,arg){
        return{
            function:'P',
            count:arg||1,
            register:'"',
        }
    }
    function X(vim,cmd,arg){
        return{
            function:'X',
            count:arg||1,
            register:'"'
        }
    }
    return({A,D,G,I,O,P,X})
})()
