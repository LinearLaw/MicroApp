
import {request} from "./request.js";
import _config from "../../../config/index.js";

const basePath = _config.serverHost;


/**
 * [获取ocr签署人信息 ]
 */
export const getOcrInfo = (payload)=>request(`${basePath}/wechat/ocr/index`,{
    body:payload,
    method:"GET",
});

/**
 * [借款COR信息提交]
 */
export const saveLoanSponorOcr = (payload)=>request(`${basePath}/wechat/ocr/saveLoanSponorOcr`,{
    body:payload,
    method:"POST",
});

/**
 * [授信COR信息提交]
 */
export const saveCreditSponorOcr = (payload)=>request(`${basePath}/wechat/ocr/saveCreditSponorOcr`,{
    body:payload,
    method:"POST",
});

/**
 * [股东会COR信息提交]
 */
export const saveShareholderOcr = (payload)=>request(`${basePath}/wechat/ocr/saveShareholderOcr`,{
    body:payload,
    method:"POST",
});
