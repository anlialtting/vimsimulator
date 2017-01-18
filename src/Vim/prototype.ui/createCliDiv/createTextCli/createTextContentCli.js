let highlightStyle={backgroundColor:'var(--middle-color)'}
Promise.all([
    module.repository.Cli,
    module.shareImport('../../../visualRange.js'),
    module.shareImport('../width.js'),
]).then(modules=>{
    let
        Cli=            modules[0],
        visualRange=    modules[1],
        width=          modules[2]
    function createTextContentCli(view,text,cursor,showCursor){
        let cli=new Cli,rowsCount
        {
            let
                currentRowsCount=0,
                highlightRange=
                    view._vim._mode=='visual'&&visualRange(view._vim)
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
                            highlightRange.s<=rowStart+i&&
                            rowStart+i<highlightRange.e
                        )
                            o.style=highlightStyle
                        cli.appendChild(o)
                    }
                    currentRowsCount++
                })
            })
            rowsCount=currentRowsCount
        }
        if(showCursor)
            cli.appendChild(cursorCli(view,text,cursor))
        return{
            textCli:cli,
            rowsCount,
        }
    }
    function cursorCli(view,text,vc){
        let currentRowsCount=0
        let clientCursor
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
        view._cursor={
            r:clientCursor.row,
            c:clientCursor.col,
        }
        return{
            child:clientCursor.char||' ',
            r:clientCursor.row,
            c:clientCursor.col,
            style:{
                backgroundColor:'var(--foreground-color)',
                color:'var(--background-color)',
            }
        }
    }
    return createTextContentCli
})
