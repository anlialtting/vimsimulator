Promise.all([
    module.repository.Cli,
    module.shareImport('createTextCli/viewText.js'),
    module.shareImport('createTextCli/viewCursor.js'),
    module.shareImport('../width.js'),
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
            let res=g(view,viewText(view,
                view._vim._options.number?view.width-4:view.width
            ))
            cli.clear()
            cli.appendChild({
                child:res.cli,
            })
            if(!(
                document.activeElement==view._inputTag&&
                'clientCursor' in res
            ))
                return
            cli.appendChild({
                child:res.clientCursor.char||' ',
                r:res.clientCursor.row,
                c:(view._vim._options.number?4:0)+res.clientCursor.col,
                style:{
                    backgroundColor:'black',
                    color:'white',
                }
            })
        }
    }
    function g(view,text){
        let
            vc=viewCursor(view._vim),
            rowsCount=0,
            numberCli,
            textCli=new Cli,
            res={
                cli:new Cli,
            }
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
                    res.clientCursor={
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
            res.cli.appendChild({
                child:'~',
                r,
            })
        if(view._vim._options.number)
            res.cli.appendChild({
                child:numberCli,
            })
        res.cli.appendChild({
            child:textCli,
            c:view._vim._options.number?4:0,
        })
        return res
        function pad(s){
            return ' '.repeat(3-s.length)+s
        }
    }
    return createTextCli
})
