import moduleLoader from 'https://cdn.rawgit.com/anliting/module/533c10b65a8b71c14de16f5ed99e466ddf8a2bae/src/esm/moduleLoader.js'
let moduleNode=`https://gitcdn.link/cdn/anliting/module/${
    '0e94e04505484aaf3b367423b36cf426a4242006'
}/node`
export default(async()=>{
    let module=await moduleLoader()
    return module.importByPath(`${moduleNode}/string-width.js`)
})()
