import docs from '../docs.js'
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
    return{
        function:'h',
        count:arg,
    }
}
function i(vim,cmd,arg){
    vim._mode='insert'
    return docs.ac
}
function j(vim,cmd,arg){
    return{
        function:'j',
        count:arg,
    }
}
function k(vim,cmd,arg){
    return{
        function:'k',
        count:arg,
    }
}
function l(vim,cmd,arg){
    return{
        function:'l',
        count:arg,
    }
}
function w(vim,cmd,arg){
    return{
        function:'w',
        count:arg,
    }
}
function W(vim,cmd,arg){
    return{
        function:'W',
        count:arg,
    }
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
        let c=vim._trueCursor.abs
        vim._text=vim._text.substring(0,c)+cmd+vim._text.substring(c+1)
    }
    return docs.acc
}
function u(vim,cmd,arg){
    let s=vim._undoBranchManager.gotoPrevious()
    if(s!=undefined)
        vim._text=s
    return docs.ac
}
function v(vim,cmd,arg){
    let c=vim._trueCursor.abs
    vim._mode='visual'
    vim._trueCursor.moveTo(c)
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
    vim._trueCursor.moveToEOL()
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
        function:'G',
        count:arg,
    }
}
function I(vim,cmd,arg){
    vim._mode='insert'
    vim._trueCursor.moveTo(vim._trueCursor.lineStart)
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
export default{A,D,G,I,O,P,X,a,d,g,h,i,j,k,l,n,o,p,r,u,v,w,W,x,y}
