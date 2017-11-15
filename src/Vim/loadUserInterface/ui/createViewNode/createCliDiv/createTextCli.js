import CliPromise from './Cli.js'
import buildPromise from './createTextCli/build.js'
export default(async()=>{
    let[
        Cli,
        build,
    ]=await Promise.all([
        CliPromise,
        buildPromise,
    ])
    function createTextCli(ui){
        return new TextCli(ui)
    }
    function TextCli(ui){
        this._ui=ui
        this._updated=false
        this.cli=new Cli
        this.flush()
    }
    TextCli.prototype.update=function(){
        this._updated=false
    }
    TextCli.prototype.flush=function(){
        if(this._updated)
            return
        this.cli.clear()
        build(
            this.cli,
            this._ui,
            document.activeElement==this._ui._inputTag&&
                this._ui._vim.mode!='cmdline',
            this._ui._vim._options.number
        )
        this.cli.flush()
        this._updated=true
    }
    return createTextCli
})()
