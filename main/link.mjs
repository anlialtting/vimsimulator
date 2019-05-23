import fs from'fs'
import rollup from'rollup'
let skip=[]
async function link(input,file){
    let bundle=await rollup.rollup({
        input,
        external:s=>skip.includes(s),
    })
    fs.writeFileSync(
        file,
        `/*${fs.readFileSync('license')}*/${
            (await bundle.generate({
                format:'es',
                paths:s=>skip.includes(s)&&s,
            })).output[0].code
        }`
    )
}
link(`main/Vim.js`,`dist/Vim.js`)
