import devConf from "./dev";
import prodConf from "./prod";
import {merge} from "lodash";

let config = {}
let env = __NODE_ENV__;
if(env === 'dev'){
  merge(config,devConf);
}else if(env === 'production'){
  merge(config,prodConf);
}
//当前处在的环境名
// console.log(__NODE_ENV__);

export default config;
