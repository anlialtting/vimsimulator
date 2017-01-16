Promise.all([
    module.shareImport('wrap/line.js'),
    module.shareImport('../../width.js'),
]).then(modules=>{
    let
        line=       modules[0],
        width=      modules[1]
    function wrap(view,targetWidth,vc){
        let
            charCount=0,
            viewRowsCount=0,
            cursorViewRow
        let res=line.lines(view._vim._text||'\n').map((l,j)=>{
            let rawL=l
            if(view._vim._options.list)
                l+='$'
            if(j==vc.r)
                /*if(view._vim.imInput)
                    l=
                        l.substring(0,vc.c)+
                        view._vim.imInput+
                        l.substring(vc.c)*/
                if(vc.c==l.length)
                    l+=' '
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
                        string:l.substring(start,end)
                    })
                    if(j==vc.r&&start<=vc.c&&vc.c<end)
                        cursorViewRow=viewRowsCount
                    viewRowsCount++
                    i=end
                }
                function calcEnd(i){
                    for(
                        let rowWidth=0;
                        i<l.length&&rowWidth+width(l[i])<=targetWidth;
                        rowWidth+=width(l[i++])
                    );
                    return i
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
