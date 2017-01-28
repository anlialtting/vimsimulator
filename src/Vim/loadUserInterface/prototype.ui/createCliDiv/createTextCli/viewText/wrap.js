Promise.all([
    module.shareImport('wrap/line.js'),
    module.shareImport('../../width.js'),
]).then(modules=>{
    let
        line=       modules[0],
        width=      modules[1]
    function wrap(ui,text,targetWidth,vc){
        let
            charCount=0,
            viewRowsCount=0,
            cursorViewRow
        let res=line.lines(text).map((l,j)=>{
            let rawL=l
            l+=ui._vim._options.list?'$':'\n'
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
/*if(j==vc.r&&ui._vim.imInput){
    l=
        l.substring(0,vc.c)+
        ui._vim.imInput+
        l.substring(vc.c)
}*/
