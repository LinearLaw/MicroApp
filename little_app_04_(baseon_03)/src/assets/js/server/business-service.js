
import {request} from "./request.js";
import _config from "../../../config/index.js";

const basePath = _config.serverHost;

/**
 * [contract list 合同列表]
 */
export const contractList = (payload)=>request(`${basePath}/wechat/contract/list`,{
    body:payload,
    method:"GET",
});

/**
 * [contractDetail 合同详情]
 */
export const contractDetail = (payload)=>request(`${basePath}/wechat/contract/detail`,{
    body:payload,
    method:"GET",
});

/**
 * [createPdf 合同生成]
 */
export const createPdf = (payload)=>request(`${basePath}/wechat/contract/createPdf`,{
    body:payload,
    method:"POST",
});
