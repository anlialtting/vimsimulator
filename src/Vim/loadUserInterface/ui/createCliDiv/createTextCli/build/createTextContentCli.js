// chrome 56 bug: cannot be <code>let</code>
var highlightStyle={backgroundColor:'var(--middle-color)'}
Promise.all([
    module.repository.Cli,
    module.repository.visualRange,
    module.repository.stringWidth,
]).then(modules=>{
    let
        Cli=            modules[0],
        visualRange=    modules[1],
        stringWidth=    modules[2]
    function width(a){
        let x=0
        for(let i=0;i<a.length;i++){
            let v=a[i]
            x+=typeof v=='object'?stringWidth(v.child):stringWidth(v)
        }
        return x
    }
    function createTextContentCli(ui,text,cursor,showCursor){
        let cli=new Cli,rowsCount
        {
            let
                currentRowsCount=0,
                highlightRange=
                    ui._vim._mode=='visual'&&visualRange(ui._vim)
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
                        let o=row.string[i]
                        if(typeof o=='string')
                            o={child:o}
                        o=Object.create(o)
                        o.r=currentRowsCount
                        o.c=c
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
        if(showCursor){
            let c=cursorCli(ui,text,cursor)
            cli.appendChild(c)
            cli.appendChild({
                child:ui._cursorSymbol,
                r:c.r,
                c:c.c,
            })
        }
        return{
            textCli:cli,
            rowsCount,
        }
    }
    function cursorCli(ui,text,vc){
        let currentRowsCount=0
        let clientCursor
        text.map(l=>{
            if(!l.rows.length)
                currentRowsCount++
            l.rows.map(row=>{
                if(
                    l.index==vc.r&&(
                        !ui.width||
                        row.start<=vc.c&&vc.c<row.start+row.string.length
                    )
                ){
                    let viewC=ui.width?vc.c-row.start:vc.c
                    clientCursor={
                        row:currentRowsCount,
                        col:width(row.string.slice(0,viewC)),
                        doc:row.string[viewC],
                    }
                }
                currentRowsCount++
            })
        })
        if(typeof clientCursor.doc!='object')
            clientCursor.doc={child:clientCursor.doc}
        clientCursor.doc=Object.create(clientCursor.doc)
        clientCursor.doc.child=clientCursor.doc.child||' '
        clientCursor.doc.r=clientCursor.row
        clientCursor.doc.c=clientCursor.col,
        clientCursor.doc.style={
            backgroundColor:'var(--foreground-color)',
            color:'var(--background-color)',
        }
        return clientCursor.doc
    }
    return createTextContentCli
})
