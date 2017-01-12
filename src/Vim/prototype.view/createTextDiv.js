Promise.all([
    module.shareImport('createTextDiv/htmlEntities.js'),
    module.shareImport('createTextDiv/viewText.js'),
    module.shareImport('createTextDiv/viewCursor.js'),
    module.repository.Cli,
    module.shareImport('charWidth.js'),
]).then(modules=>{
    let
        htmlEntities=   modules[0],
        viewText=       modules[1],
        viewCursor=     modules[2],
        Cli=            modules[3],
        charWidth=      modules[4]
    function createTextDiv(view){
        let vim=view._vim
        let cli=new Cli
        f()
        vim.on('view',f)
        return cli.view.div
        function f(){
            let res=highlight(view,viewText(view))
            cli.clear()
            cli.appendChild(res.string)
            if(!(
                document.activeElement==view._inputTag&&
                'clientCursorRow' in res
            ))
                return
            cli.appendChild({
                child:res.clientCursorChar||' ',
                r:res.clientCursorRow,
                c:res.clientCursorCol,
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
                        stringWidth(row.string.substring(0,viewC))
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
        function stringWidth(s){
            let res=0
            for(let i=0;i<s.length;i++)
                res+=charWidth(s[i])
            return res
        }
    }
    /*function createTextDiv(view){
        let vim=view._vim
        let div=document.createElement('div')
        div.style.fontFamily='monospace'
        div.style.fontSize=`${vim._fontSize}px`
        div.style.lineHeight='1'
        div.style.whiteSpace='pre'
        f()
        vim.on('view',f)
        return div
        function f(){
            div.innerHTML=highlight(view,viewText(view))
        }
    }
    function highlight(view,text){
        let
            vim=view._vim,
            vc=viewCursor(vim),
            res=[]
        text.map(l=>{
            if(!l.rows.length)
                return res.push('')
            l.rows.map(row=>{
                if(!(
                    document.activeElement==view._inputTag&&l.index==vc.r&&(
                        !view.width||
                        row.start<=vc.c&&vc.c<row.end
                    )
                ))
                    return res.push(htmlEntities.encode(row.string))
                let viewC=view.width?vc.c-row.start:vc.c
                res.push(`${
                    htmlEntities.encode(row.string.substring(0,viewC))
                }<span
                    class=cursor
                    style=background-color:black;color:white>${
                    htmlEntities.encode(row.string[viewC])
                }</span>${
                    htmlEntities.encode(row.string.substring(viewC+1))
                }`)
            })
        })
        while(res.length<view.height-1)
            res.push('~')
        return res.map(s=>s+'\n').join('')
    }*/
    return createTextDiv
})
