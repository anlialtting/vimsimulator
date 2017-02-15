var
    color4i={color:'var(--color4i)'},
    lfDoc={
        child:'$',
        style:color4i
    }
Promise.all([
    module.shareImport('wrap/line.js'),
    module.repository.stringWidth,
]).then(modules=>{
    let
        line=       modules[0],
        stringWidth=modules[1]
    function width(c){
        return c=='\n'?1:stringWidth(c)
    }
    function wrap(ui,text,targetWidth,vc){
        let
            charCount=0,
            viewRowsCount=0,
            cursorViewRow,
            list=ui._vim._options.list
        let res=line.lines(text).map((l,j)=>{
            let length=l.length+1
            l+='\n'
            let res={
                index:j
            }
            res.start=charCount
            res.startRow=viewRowsCount
            if(targetWidth&&l.length){
                res.rows=[]
                for(let i=0;i<l.length;){
                    let start=i,end=calcEnd(i,l,targetWidth)
                    res.rows.push({
                        start,
                        end,
                        string:substring(list,l,start,end)
                    })
                    if(j==vc.r&&start<=vc.c&&vc.c<end)
                        cursorViewRow=viewRowsCount
                    viewRowsCount++
                    i=end
                }
            }else{
                if(j==vc.r)
                    cursorViewRow=viewRowsCount
                res.rows=[{
                    start:0,
                    end:l.length,
                    string:l
                }]
                viewRowsCount++
            }
            res.endRow=viewRowsCount
            charCount+=length
            return res
        })
        return{
            res,
            cursorViewRow
        }
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
            a.push(c=='\n'?list?lfDoc:'\n':c)
        }
        return a
    }
    return wrap
})
