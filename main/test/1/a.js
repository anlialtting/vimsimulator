import measureWidth from '../../Vim/loadUserInterface/ui/measureWidth.js'
//import style from './style.js'
import style from '../a.js'
;(async()=>document.head.appendChild(Object.assign(
    document.createElement('style'),
    {textContent:style}
)))()
;(async()=>{
    console.log=s=>
        document.body.appendChild(document.createTextNode(s))
    let w=80,h=24
    let fontSize=13
    let fontWidth=measureWidth(fontSize)
    let cv,ctx
    [cv,ctx]=init()
    document.body.appendChild(div())
    timeTest()
    function init(){
        let cv=document.createElement('canvas')
        cv.width=fontWidth*w
        cv.height=fontSize*h
        let ctx=cv.getContext('2d')
        ctx.font=`${fontSize}px monospace`
        ctx.textBaseline='top'
        return[cv,ctx]
    }
    function div(){
        let div=document.createElement('div')
        div.className='test'
        div.appendChild(cv)
        return div
    }
    async function timeTest(){
        let n=20
        let start=new Date
        for(let i=0;i<n;i++){
            draw()
            await new Promise(setTimeout)
        }
        console.log(`${1e3/((new Date-start)/n)}fps`)
    }
    function draw(){
        ctx.clearRect(0,0,cv.width,cv.height)
        for(let x=0;x<w;x++)
            for(let y=0;y<h;y++){
                let s=randomLetter()
                ctx.fillText(s,fontWidth*x,fontSize*y)
            }
        function randomLetter(){
            return String.fromCharCode(
                97+Math.floor(Math.random()*26)
            )
        }
    }
})()
