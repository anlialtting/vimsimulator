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
        let vim=view._vim
        let cli=new Cli
        f()
        view.on('update',f)
        setInterval(()=>{
            cli.flush()
        },refreshTime)
        return cli
        function f(){
            let targetWidth=
                view._vim._options.number?view.width-4:view.width
            let res=highlight(view,viewText(view,targetWidth))
            cli.clear()
            cli.appendChild({
                child:res.string,
                c:view._vim._options.number?4:0,
            })
            if(!(
                document.activeElement==view._inputTag&&
                'clientCursorRow' in res
            ))
                return
            cli.appendChild({
                child:res.clientCursorChar||' ',
                r:res.clientCursorRow,
                c:(view._vim._options.number?4:0)+res.clientCursorCol,
                style:{
                    backgroundColor:'black',
                    color:'white',
                }
            })
        }
    }
    function highlight(view,text){
        let
            vim=view._vim,
            vc=viewCursor(vim),
            res=[],
            clientCursorRow,
            clientCursorCol,
            clientCursorChar
        text.map(l=>{
            if(!l.rows.length)
                return res.push('')
            l.rows.map(row=>{
                if(
                    l.index==vc.r&&(
                        !view.width||
                        row.start<=vc.c&&vc.c<row.end
                    )
                ){
                    let viewC=view.width?vc.c-row.start:vc.c
                    clientCursorRow=res.length
                    clientCursorCol=
                        width(row.string.substring(0,viewC))
                    clientCursorChar=row.string[viewC]
                }
                return res.push(row.string)
            })
        })
        while(res.length<view.height-1)
            res.push('~')
        return{
            string:res.map(s=>s+'\n').join(''),
            clientCursorRow,
            clientCursorCol,
            clientCursorChar,
        }
    }
    return createTextCli
})
