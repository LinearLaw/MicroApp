
/**
 * wx.request 封装
 * @param {url}
 * @param {obj} obj:{data,header}
 */
const objDefault = {
    method:"GET",
    body:{
        data:{},
        header:{}
    }
}
export const request = (url, obj=objDefault) => {
    const takeToken = {
        "token" : wx.getStorageSync("token")||"",
        "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"
    }
    const header = Object.assign(takeToken,obj.body.header);
    const data = Object.assign({},obj.body.data);
    return new Promise((resolve,reject)=>{
        wx.request({
            url: url, //仅为示例，并非真实的接口地址
            method:obj.method,
            data,
            header,
            success(res) {
                let parseData = {};
                Object.assign(parseData,res.data);
                resolve(parseData);
            },
            fail(err){
                reject(err);
            },
            complete(){
                obj.body.complete && obj.body.complete();
            }
        })
    })
}
