Promise.all([
    module.repository.Cli,
    module.shareImport('viewCursor.js'),
    module.shareImport('../width.js'),
    module.shareImport('../../../visualRange.js'),
]).then(modules=>{
    let
        Cli=            modules[0],
        viewCursor=     modules[1],
        width=          modules[2],
        visualRange=    modules[3]
    function createTextContentCli(view,text,showCursor){
        let cli=new Cli,rowsCount
        {
            let
                currentRowsCount=0,
                highlightRange=visualRange(view._vim)
            text.map(l=>{
                if(!l.rows.length)
                    currentRowsCount++
                l.rows.map(row=>{
                    let rowStart=l.start+row.start
                    for(
                        let i=0,c=0;
                        i<row.string.length;
                        c+=width(row.string[i++])
                    ){
                        let o={
                            child:row.string[i],
                            r:currentRowsCount,
                            c,
                        }
                        if(
                            highlightRange&&
                            highlightRange.s<=rowStart+c&&
                            rowStart+c<highlightRange.e
                        )
                            o.style={backgroundColor:'gray'}
                        cli.appendChild(o)
                    }
                    currentRowsCount++
                })
            })
            rowsCount=currentRowsCount
        }
        if(showCursor)
            cli.appendChild(cursor(view,text))
        return{
            textCli:cli,
            rowsCount,
        }
    }
    function cursor(view,text){
        let currentRowsCount=0
        let vc=viewCursor(view._vim)
        let
            clientCursor
        text.map(l=>{
            if(!l.rows.length)
                currentRowsCount++
            l.rows.map(row=>{
                if(
                    l.index==vc.r&&(
                        !view.width||
                        row.start<=vc.c&&vc.c<row.end
                    )
                ){
                    let viewC=view.width?vc.c-row.start:vc.c
                    clientCursor={
                        row:currentRowsCount,
                        col:width(row.string.substring(0,viewC)),
                        char:row.string[viewC],
                    }
                }
                currentRowsCount++
            })
        })
        return{
            child:clientCursor.char||' ',
            r:clientCursor.row,
            c:clientCursor.col,
            style:{
                backgroundColor:'black',
                color:'white',
            }
        }
    }
    return createTextContentCli
})
