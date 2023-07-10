import type { IApi } from '../../intf/IApi';
/** 计算项目中需要生成的接口的默认 content-type */
export declare const calcDefaultContentType: (apis: Array<IApi>) => string;
