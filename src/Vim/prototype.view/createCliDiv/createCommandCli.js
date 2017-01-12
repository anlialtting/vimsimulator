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
                cli.appendChild('')
            }else if(vim.mode=='insert'){
                cli.clear()
                cli.appendChild('-- INSERT --')
            }else if(vim.mode=='visual'){
                cli.clear()
                cli.appendChild('-- VISUAL --')
            }else if(vim.mode=='visual-block'){
                cli.clear()
                cli.appendChild('-- VISUAL BLOCK --')
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
        }
    }
    return createCommandDiv
})
