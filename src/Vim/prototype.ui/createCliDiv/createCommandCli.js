Promise.all([
    module.repository.Cli
]).then(modules=>{
    let
        Cli=            modules[0]
    function createCommandDiv(vim){
        let cli=new Cli
        f(cli)
        vim.on('view',changed=>{
            if(changed.indexOf('mode')<0)
                return
            f(cli)
        })
        return cli
        function f(cli){
            if(vim.mode=='normal'){
                cli.clear()
                cli.appendChild(vim._modeData.status!=undefined?
                    vim._modeData.status
                :
                    ''
                )
                cli.flush()
            }else if(vim.mode=='insert'){
                cli.clear()
                cli.appendChild('-- INSERT --')
                cli.flush()
            }else if(vim.mode=='visual'){
                cli.clear()
                cli.appendChild('-- VISUAL --')
                cli.flush()
            }else if(vim.mode=='visual-block'){
                cli.clear()
                cli.appendChild('-- VISUAL BLOCK --')
                cli.flush()
            }else if(vim.mode=='cmdline'){
                update(cli)
                vim.on('view',listener)
                function listener(){
                    if(vim.mode=='cmdline')
                        update(cli)
                    else
                        vim.removeListener('view',listener)
                }
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
                    backgroundColor:'black',
                    color:'white',
                }
            })
            cli.flush()
        }
    }
    return createCommandDiv
})
