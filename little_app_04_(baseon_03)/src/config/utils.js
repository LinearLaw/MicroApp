
let utils = {
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
    }
}
export default utils;