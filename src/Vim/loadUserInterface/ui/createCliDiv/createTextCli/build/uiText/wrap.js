var color4i={color:'var(--color4i)'}
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
            cursorViewRow
        let res=line.lines(text).map((l,j)=>{
            let rawL=l
            l+='\n'
            let res={
                index:j
            }
            res.start=charCount
            res.startRow=viewRowsCount
            if(targetWidth&&l.length){
                res.rows=[]
                for(let i=0;i<l.length;){
                    let start=i,end=calcEnd(i)
                    res.rows.push({
                        start,
                        end,
                        string:substring(l,start,end)
                    })
                    if(j==vc.r&&start<=vc.c&&vc.c<end)
                        cursorViewRow=viewRowsCount
                    viewRowsCount++
                    i=end
                    function substring(s,start,end){
                        let a=[]
                        for(;start!=end;start++){
                            let c=s[start]
                            if(c=='\n'){
                                a.push(ui._vim._options.list?{
                                    child:'$',
                                    style:color4i
                                }:'\n')
                            }else
                                a.push(c)
                        }
                        return a
                    }
                    function calcEnd(i){
                        for(
                            let rowWidth=0;
                            i<l.length&&rowWidth+width(l[i])<=targetWidth;
                            rowWidth+=width(l[i++])
                        );
                        return i
                    }
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
            charCount+=rawL.length+1
            return res
        })
        return{
            res,
            cursorViewRow
        }
    }
    return wrap
})
