module.export=count_rows_string
function count_rows_string(countOfColsPerRow,string){
    let
        row_currentLine=0,
        col_currentRow=0
    for(let i=0;i<string.length;i++){
        let width
        if(string[i]==='\t'){
            width=8-col_currentRow%8
        }else if(string.charCodeAt(i)<0xff){
            width=1
        }else
            width=2
        if(col_currentRow+width>countOfColsPerRow){
            row_currentLine++
            col_currentRow=0
        }
        col_currentRow+=width
    }
    return row_currentLine+1
}
