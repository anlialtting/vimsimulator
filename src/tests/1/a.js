;(async()=>document.head.appendChild(await module.style('a.css')))()
;(async()=>document.head.appendChild(await module.style('../a.css')))()
;(async()=>{
    let w=80,h=24
    let fontSize=13
    let cv=document.createElement('canvas')
    cv.width=fontSize/2*w
    cv.height=fontSize*h
    let ctx=cv.getContext('2d')
    ctx.fillStyle='lightgray'
    ctx.font=`${fontSize}px monospace`
    timeTest()
    document.body.appendChild(div())
    function div(){
        let div=document.createElement('div')
        div.className='test'
        div.appendChild(cv)
        return div
    }
    async function timeTest(){
        let n=100
        let start=new Date
        for(let i=0;i<n;i++){
            let s=String.fromCharCode(97+Math.floor(Math.random()*26))
            s=(s.repeat(w)+'\n').repeat(h)
            draw(s)
            await new Promise(setTimeout)
        }
        let cycle=(new Date-start)/n
        console.log(`${1e3/cycle}fps`)
    }
    function draw(s){
        ctx.clearRect(0,0,cv.width,cv.height)
        let x=0,y=0
        for(let i=0;i<s.length;i++){
            if(s[i]!='\n'){
                ctx.fillText(s[i],fontSize/2*x,fontSize*(y+1))
                x++
            }else
                x=0,y++
        }
    }
})()
