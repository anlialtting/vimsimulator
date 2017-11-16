let
    rollup=require('rollup'),
    skip=[
        'https://cdn.rawgit.com/anliting/module/533c10b65a8b71c14de16f5ed99e466ddf8a2bae/src/esm/moduleLoader.js',
        'https://cdn.rawgit.com/anliting/althea/ea16c0d91285a61063e9251ad1387b7cf4732a39/src/AltheaServer/HttpServer/files/lib/dom.js',
        'https://gitcdn.link/cdn/anliting/simple.js/eae977ecf2a856ecb072259aa63b003d186ba618/src/simple/EventEmmiter.js',
    ]
async function link(input,file){
    let bundle=await rollup.rollup({
        input,
        external:s=>skip.includes(s),
    })
    await bundle.write({
        file,
        format:'es',
        paths:s=>skip.includes(s)&&s,
    })
}
link(`Vim.js`,`Vim.static.js`)
