import CliPromise from './Cli.js'
function update(ui,cli){
    let vim=ui._vim
    cli.clear()
    if(vim.mode=='normal'){
        cli.appendChild(vim._modeData.status!=undefined?
            vim._modeData.status
        :
            ''
        )
    }else if(vim.mode=='insert'){
        g('-- INSERT --')
    }else if(vim.mode=='visual'){
        g('-- VISUAL --')
    }else if(vim.mode=='visual-block'){
        g('-- VISUAL BLOCK --')
    }
    cli.appendChild({
        child:cursor(
            ui._vim._cursor.r,
            ui._vim._cursor.c
        ),
        c:ui.width-18
    })
    cli.appendChild({
        child:scroll(
            ui._wrapMethodData._scroll,
            ui._wrapMethodData.text.countOfRows,
            ui.height
        ),
        c:ui.width-4
    })
    cli.flush()
    function cursor(r,c){
        return `${r+1},${c+1}`
    }
    function scroll(s,cr,h){
        let
            top=s==0,
            bot=cr<=s+(h-1)
        if(top&&bot)
            return 'All'
        if(top)
            return 'Top'
        if(bot)
            return 'Bot'
        let n=Math.floor(100*s/(cr-(h-1))).toString()
        return`${' '.repeat(2-n.length)}${n}%`
    }
    function g(s){
        cli.appendChild({child:s,style:{fontWeight:'bold'}})
    }
}
function cmdlineUpdate(ui,cli){
    let vim=ui._vim
    let
        text=vim._modeData.inputBuffer,
        cursor=vim._modeData.cursor.position
    cli.clear()
    cli.appendChild(text)
    cli.appendChild({
        child:
            text.substring(cursor,cursor+1)||' ',
        c:cursor,
        class:'cursor',
    })
    cli.flush()
}
export default(async()=>{
    let Cli=await CliPromise
    function CommandCli(ui){
        this._ui=ui
        this.cli=new Cli
        this.update()
    }
    function createCommandCli(ui){
        return new CommandCli(ui)
    }
    CommandCli.prototype.update=function(){
        let
            ui=this._ui,
            cli=this.cli,
            vim=ui._vim
        if(inNvii(vim.mode))
            update(ui,cli)
        else if(vim.mode=='cmdline')
            cmdlineUpdate(ui,cli)
        function inNvii(v){
            return 0<=[
                'normal',
                'insert',
                'visual',
                'visual-block',
            ].indexOf(v)
        }
    }
    return createCommandCli
})()
