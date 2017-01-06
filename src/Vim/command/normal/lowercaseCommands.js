function u(){
    var c=this.textarea.selectionStart
    this.textarea.value=
        this.histories[this.histories.length-1]
    while(
        0<=this.histories.length-1&&
        this.histories[this.histories.length-1]===
        this.textarea.value
    )
        this.histories.pop()
    if(0<=this.histories.length-1)
        this.textarea.value=this.histories[this.histories.length-1]
    this.textarea.selectionStart=c
}
({u})
