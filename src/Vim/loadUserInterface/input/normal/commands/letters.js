(async()=>{
    let docs=await module.repository.docs
    function a(vim,cmd,arg){
        return{function:'a'}
    }
    function d(vim,cmd,arg){
        if(cmd=='')
            return docs.a
        if(cmd=='d')
            return{
                function:'dd',
                count:arg||1,
                register:'"',
            }
    }
    function g(vim,cmd,arg){
        if(cmd=='')
            return docs.a
        if(cmd=='g')
            return{
                function:'gg',
                count:arg,
            }
    }
    function h(vim,cmd,arg){
        arg=arg||1
        if(vim._text)
            while(arg--)
                vim._cursor.moveLeft()
        return docs.ac
    }
    function i(vim,cmd,arg){
        vim._mode='insert'
        return docs.ac
    }
    function j(vim,cmd,arg){
        arg=arg||1
        if(vim._text)
            while(arg--)
                vim._cursor.moveDown()
        return docs.ac
    }
    function k(vim,cmd,arg){
        arg=arg||1
        if(vim._text)
            while(arg--)
                vim._cursor.moveUp()
        return docs.ac
    }
    function l(vim,cmd,arg){
        arg=arg||1
        if(vim._text)
            while(arg--)
                vim._cursor.moveRight()
        return docs.ac
    }
    function n(vim,cmd,arg){
        //vim.gotoNextMatch()
        return docs.ac
    }
    function o(vim,cmd,arg){
        return{function:'o'}
    }
    function p(vim,cmd,arg){
        return{
            function:'p',
            count:arg||1,
            register:'"',
        }
    }
    function r(vim,cmd,arg){
        if(cmd=='')
            return docs.a
        if(vim._text){
            let c=vim._cursor.abs
            vim._text=vim._text.substring(0,c)+cmd+vim._text.substring(c+1)
        }
        return docs.acc
    }
    function u(vim,cmd,arg){
        if(vim._undoBranchManager.current.previous!=undefined){
            vim._undoBranchManager.current=
                vim._undoBranchManager.current.previous
            vim._text=vim._undoBranchManager.current.text
        }
        return docs.ac
    }
    function v(vim,cmd,arg){
        let c=vim._cursor.abs
        vim._mode='visual'
        vim._cursor.moveTo(c)
        return docs.ac
    }
    function x(vim,cmd,arg){
        return{
            function:'x',
            count:arg||1,
            register:'"'
        }
    }
    function y(vim,cmd,arg){
        if(cmd=='')
            return docs.a
        if(cmd=='y')
            return{
                function:'yy',
                count:arg||1,
                register:'"',
            }
    }
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
        return{
            function:'gg',
            count:arg,
        }
    }
    function I(vim,cmd,arg){
        vim._mode='insert'
        vim._cursor.moveTo(vim._cursor.lineStart)
        return docs.ac
    }
    function O(vim,cmd,arg){
        return{function:'O'}
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
    return({A,D,G,I,O,P,X,a,d,g,h,i,j,k,l,n,o,p,r,u,v,x,y})
})()
