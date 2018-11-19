
import {request} from "./request.js";
import _config from "../../../config/index.js";

const basePath = _config.serverHost;

/**
 * [login 登录]
 */
export const userLogin = (payload)=>request(`${basePath}/wechat/login`,{
    body:payload,
    method:"POST",
});
/**
 * [logout 退出登录]
 */
export const userLogout = (payload)=>request(`${basePath}/wechat/logout`,{
    body:payload,
    method:"POST",
});

/**
 * [sendSms 发送手机验证码]
 */
export const sendSms = (payload)=>request(`${basePath}/wechat/sendSms`,{
    body:payload,
    method:"POST",
});
