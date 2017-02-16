var
    color4i={color:'var(--color4i)'},
    lfDoc={
        child:'$',
        style:color4i
    },
    line=module.shareImport('wrap/line.js')
;(async modules=>{
    let stringWidth=await module.repository.stringWidth
    line=await line
    function width(c){
        return c=='\n'?1:stringWidth(c)
    }
    function wrap(list,text,targetWidth){
        let
            charCount=0,
            rowsCount=0
        return line.lines(text).map((l,j)=>{
            l+='\n'
            let rows=wrapLine(list,l,targetWidth||Infinity)
            let res={
                index:j,
                start:charCount,
                startRow:rowsCount,
                rows,
            }
            charCount+=l.length
            rowsCount+=rows.length
            return res
        })
    }
    function wrapLine(list,l,targetWidth){
        let rows=[]
        for(let i=0;i<l.length;){
            let start=i,end=calcEnd(i,l,targetWidth)
            rows.push({
                start,
                end,
                string:substring(list,l,start,end)
            })
            i=end
        }
        return rows
    }
    function calcEnd(i,l,targetWidth){
        for(
            let rowWidth=0,w;
            i<l.length&&rowWidth+(w=width(l[i]))<=targetWidth;
            rowWidth+=w,i++
        );
        return i
    }
    function substring(list,s,start,end){
        let a=[]
        for(;start!=end;start++){
            let c=s[start]
            a.push(c=='\n'?list?Object.create(lfDoc):'\n':c)
        }
        return a
    }
    return wrap
})()
