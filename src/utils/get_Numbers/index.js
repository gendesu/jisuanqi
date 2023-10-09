export function get_Numbers(string){
    let mae =0
    let list = []
    console.log(string)
    for(let i = 0;i<string.length;i++){
        if(parseFloat(string[i])<10||string[i]=='.'){
        }else{
            console.log(1)
            list.push(parseFloat(string.slice(mae,i)))
            mae=i+1
        }
    }
    list.push(parseFloat(string.slice(mae)))
    return list
}