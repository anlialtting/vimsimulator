let e=document.createElement('div')
;({
    encode(s){
        e.textContent=s
        return e.innerHTML
    },decode(s){
        e.innerHTML=s
        return e.textContent
    }
})
