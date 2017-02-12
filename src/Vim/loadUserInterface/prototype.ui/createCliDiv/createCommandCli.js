(async()=>{
    let Cli=await module.repository.Cli
    function createCommandDiv(ui){
        let vim=ui._vim
        let cli=new Cli
        f()
        ui.on('modeChange',f)
        return cli
        function f(){
            if(vim.mode=='normal'){
                cli.clear()
                cli.appendChild(vim._modeData.status!=undefined?
                    vim._modeData.status
                :
                    ''
                )
                cli.flush()
            }else if(vim.mode=='insert'){
                g('-- INSERT --')
            }else if(vim.mode=='visual'){
                g('-- VISUAL --')
            }else if(vim.mode=='visual-block'){
                g('-- VISUAL BLOCK --')
            }else if(vim.mode=='cmdline'){
                update(cli)
                ui.on('update',listener)
                function listener(){
                    if(vim.mode=='cmdline')
                        update(cli)
                    else
                        ui.removeListener('update',listener)
                }
            }
            function g(s){
                cli.clear()
                cli.appendChild({child:s,style:{fontWeight:'bold'}})
                cli.flush()
            }
        }
        function update(cli){
            let
                text=vim._modeData.inputBuffer,
                cursor=vim._modeData.cursor.position
            cli.clear()
            cli.appendChild(text)
            cli.appendChild({
                child:
                    text.substring(cursor,cursor+1)||' ',
                c:cursor,
                style:{
                    backgroundColor:'var(--foreground-color)',
                    color:'var(--background-color)',
                }
            })
            cli.flush()
        }
    }
    return createCommandDiv
})()
