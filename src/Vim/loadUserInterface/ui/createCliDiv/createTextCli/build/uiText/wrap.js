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
    function wrap(list,text,targetWidth,cursor){
        let
            charCount=0,
            rowsCount=0
        let res=line.lines(text).map((l,j)=>{
            l+='\n'
            let res={
                index:j,
                start:charCount,
                startRow:rowsCount,
                rows:targetWidth&&l.length?
                    wrapLine(list,l,targetWidth)
                :
                    rawLine(l),
            }
            charCount+=l.length
            rowsCount+=res.rows.length
            return res
        })
        return{
            res,
            cursorViewRow:calcRow(res,cursor)
        }
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
    function rawLine(l){
        return[{
            start:0,
            end:l.length,
            string:l
        }]
    }
    function calcRow(txt,pos){
        let res
        txt.map(l=>l.rows.map((r,i)=>{
            if(l.start+r.start<=pos&&pos<l.start+r.end)
                res=l.startRow+i
        }))
        return res
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
