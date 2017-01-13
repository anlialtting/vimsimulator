Promise.all([
    module.repository.Cli,
    module.shareImport('createTextCli/viewText.js'),
    module.shareImport('createTextCli/viewCursor.js'),
    module.shareImport('width.js'),
]).then(modules=>{
    let
        Cli=            modules[0],
        viewText=       modules[1],
        viewCursor=     modules[2],
        width=          modules[3],
        refreshTime=    33
    function createTextCli(view){
        let cli=new Cli
        f()
        view.on('update',f)
        setInterval(()=>cli.flush(),refreshTime)
        return cli
        function f(){
            cli.clear()
            build(cli,view,viewText(view,
                view._vim._options.number?view.width-4:view.width
            ),document.activeElement==view._inputTag)
        }
    }
    function build(cli,view,text,showCursor){
        let
            vc=viewCursor(view._vim),
            rowsCount=0,
            numberCli,
            textCli=new Cli,
            clientCursor
        if(view._vim._options.number)
            numberCli=new Cli
        text.map(l=>{
            if(view._vim._options.number)
                numberCli.appendChild({
                    child:pad((l.index+1).toString()),
                    r:rowsCount,
                })
            if(!l.rows.length)
                rowsCount++
            l.rows.map(row=>{
                if(
                    l.index==vc.r&&(
                        !view.width||
                        row.start<=vc.c&&vc.c<row.end
                    )
                ){
                    let viewC=view.width?vc.c-row.start:vc.c
                    clientCursor={
                        row:rowsCount,
                        col:width(row.string.substring(0,viewC)),
                        char:row.string[viewC],
                    }
                }
                textCli.appendChild({
                    child:row.string,
                    r:rowsCount
                })
                rowsCount++
            })
        })
        for(let r=rowsCount;r<view.height-1;r++)
            cli.appendChild({
                child:'~',
                r,
            })
        if(view._vim._options.number)
            cli.appendChild({
                child:numberCli,
            })
        cli.appendChild({
            child:textCli,
            c:view._vim._options.number?4:0,
        })
        if(showCursor&&clientCursor)
            textCli.appendChild({
                child:clientCursor.char||' ',
                r:clientCursor.row,
                c:clientCursor.col,
                style:{
                    backgroundColor:'black',
                    color:'white',
                }
            })
        return cli
        function pad(s){
            return ' '.repeat(3-s.length)+s
        }
    }
    return createTextCli
})
