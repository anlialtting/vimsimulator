(async()=>{
    let docs=await module.repository.docs
    function h(vim,doc){
        let count=doc.count||1
        while(count--)
            vim._trueCursor.moveLeft()
        return docs.ac
    }
    function j(vim,doc){
        let count=doc.count||1
        while(count--)
            vim._trueCursor.moveDown()
        return docs.ac
    }
    function k(vim,doc){
        let count=doc.count||1
        while(count--)
            vim._trueCursor.moveUp()
        return docs.ac
    }
    function l(vim,doc){
        let count=doc.count||1
        while(count--)
            vim._trueCursor.moveRight()
        return docs.ac
    }
    return{h,j,k,l}
})()
