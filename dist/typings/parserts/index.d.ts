import type { IConfig } from '../intf/IConfig';
import type { IApi } from '../intf/IApi';
/** 通过 ajv 解析配置文件, 并将不符合的属性移除 */
export declare const parseConfig: (configFilePath: string, reset: boolean) => IConfig;
/** 配置输入以及加载需要生成的 apis 集合 */
export declare const inputConfigAndLoadApis: (config: IConfig) => Promise<Array<IApi>>;
