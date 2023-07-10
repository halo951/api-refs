import type { IApi } from '../../intf/IApi';
import type { IConfig } from '../../intf/IConfig';
export declare const createRequestArrowFunction: (opt: {
    /** 方法名 */
    functionName: string;
    /** 请求工具 */
    requestUtil: string;
    /** 默认的 content-type 属性 */
    defaultContentType: string;
    /** api 接口 */
    api: IApi;
    /** 配置 */
    config: IConfig;
}) => Promise<string>;
