module.export={
    encode(s){
        let e=document.createElement('div')
        e.textContent=s
        return e.innerHTML
    },
    decode(s){
        let e=document.createElement('div')
        e.innerHTML=s
        return e.textContent
    }
}
