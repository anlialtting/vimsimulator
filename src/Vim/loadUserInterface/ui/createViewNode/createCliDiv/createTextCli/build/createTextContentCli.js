// chrome 56 bug: cannot be <code>let</code>
var highlightStyle={backgroundColor:'var(--middle-color)'}
Promise.all([
    module.repository.Cli,
    module.repository.stringWidth,
]).then(modules=>{
    let
        Cli=            modules[0],
        stringWidth=    modules[1]
    function calcWidth(a){
        let x=0
        for(let i=0;i<a.length;i++){
            let v=a[i]
            x+=typeof v=='object'?stringWidth(v.child):stringWidth(v)
        }
        return x
    }
    function createTextContentCli(
        text,
        cursor,
        showCursor,
        highlightRange,
        cursorSymbol,
        width
    ){
        let cli=new Cli,rowsCount
        {
            let
                currentRowsCount=0
            text.map(l=>{
                if(!l.rows.length)
                    currentRowsCount++
                l.rows.map(row=>{
                    let rowStart=l.start+row.start
                    for(
                        let i=0,c=0;
                        i<row.string.length;
                        c+=calcWidth(row.string[i++])
                    ){
                        let o=row.string[i]
                        if(typeof o=='string')
                            o={child:o}
                        else
                            o={
                                child:o.child,
                                class:o.class,
                                style:o.style,
                            }
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
            let c=cursorCli(text,cursor,width)
            cli.appendChild(c)
            cli.appendChild({
                child:cursorSymbol,
                r:c.r,
                c:c.c,
            })
        }
        return{
            textCli:cli,
            rowsCount,
        }
    }
    function cursorCli(text,vc,width){
        let currentRowsCount=0
        let clientCursor
        text.map(l=>{
            if(!l.rows.length)
                currentRowsCount++
            l.rows.map(row=>{
                if(
                    l.index==vc.r&&
                    row.start<=vc.c&&vc.c<row.start+row.string.length
                ){
                    let viewC=width?vc.c-row.start:vc.c
                    clientCursor={
                        row:currentRowsCount,
                        col:calcWidth(row.string.slice(0,viewC)),
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
        clientCursor.doc.c=clientCursor.col
        if(clientCursor.doc.class)
            clientCursor.doc.class=`${clientCursor.doc.class} cursor`
        else
            clientCursor.doc.class='cursor'
        return clientCursor.doc
    }
    return createTextContentCli
})
