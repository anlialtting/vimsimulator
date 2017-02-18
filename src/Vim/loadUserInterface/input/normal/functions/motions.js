(async()=>{
    let docs=await module.repository.docs
    function h(vim,doc){
        let count=doc.count||1
        while(count--)
            vim._cursor.moveLeft()
        return docs.ac
    }
    function j(vim,doc){
        let count=doc.count||1
        while(count--)
            vim._cursor.moveDown()
        return docs.ac
    }
    function k(vim,doc){
        let count=doc.count||1
        while(count--)
            vim._cursor.moveUp()
        return docs.ac
    }
    function l(vim,doc){
        let count=doc.count||1
        while(count--)
            vim._cursor.moveRight()
        return docs.ac
    }
    return({h,j,k,l})
})()
