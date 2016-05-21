window.cppstl={}
cppstl.lower_bound=(array,key)=>{
    let first=0,last=array.length
    while(first!=last){
        var median=Math.floor((first+last)/2)
        if(array[median]<key)
            first=median+1
        else
            last=median
    }
    return first
}
cppstl.upper_bound=(array,key)=>{
    let first=0,last=array.length,median
    while(first!=last){
        median=Math.floor((first+last)/2)
        if(array[median]<=key)
            first=median+1
        else
            last=median
    }
    return first
}
cppstl.partial_sum=input=>{
    let output=input.slice(0)
    for(let i=1;i<output.length;i++)
        output[i]+=output[i-1]
    return output
}
