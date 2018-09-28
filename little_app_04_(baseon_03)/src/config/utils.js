
let utils = {
    //提示信息
    toast (_text,_icon){
        wx.showToast({
            title:_text || "",
            icon:_icon || "none",
            complete:()=>{
              setTimeout(()=>{
                wx.hideToast();
              },1500);
            }
        })
    },
    //查看pdf/doc/excel
    viewDocument(url){
        wx.downloadFile({
            url:  url,
            success: function (res) {
              var Path = res.tempFilePath;//返回的文件临时地址
              wx.openDocument({
                filePath: Path,
                success: function (res) {}
              })
            },
            fail: function (res) {
              console.log("fail",res);
            }
        })
    }
}
export default utils;