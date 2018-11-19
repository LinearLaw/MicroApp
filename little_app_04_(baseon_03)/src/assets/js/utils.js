
import urls from "./utils-main/url-utils.js";
import wxExpansion from "./utils-main/wx-expansion.js";
import {request} from "./server/request.js";
import basic from "./utils-main/basic-util.js";

/**
 * [utils]
 * @attribute urls
 *      {
 *          @function getCurrentPageUrlWithArgs     不需要传参，获取当前url
 *
 *          @function getParamFromUrl       传入url和name，返回在url中这个name对应的值
 *              eg: getParamFromUrl("pages/index?a=123&b=456" , a) => 123
 *
 *          @function getUrlParam 传入url和name, 获取一段url中所有的key，以对象形式返回
 *              eg: pages/index?a=123&b=456 => {a:123,b:456}
 *
 *          @function makeUrlParams 传入对象，返回格式化后的字符串
 *              {a:123,b:456} => ?a=123&b=456
 *      }
 *
 * @attribute wxExpansion
 *      {
 *          @function toast  调用wx.showToast接口，参数1为需要显示的文本，参数2为图标，
 *                  显示后在1.5s后消失
 *          @function viewDocument  传入pdf等文档的url，打开这个文档
 *          @function setStorage 设置storage的值，传入key和value，默认过期时间24小时
 *          @function getStorage 获取storage的值，传入key，有该值返回值，无该值返回undefined
 *      }
 *
 */

let utils = {
    basic,
    wxExpansion,
    urls,
    request
}
export default utils;
