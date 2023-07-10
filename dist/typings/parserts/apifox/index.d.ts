import type { IApi } from '../../intf/IApi';
import type { IConfig } from '../../intf/IConfig';
/** 解析配置, 并返回需要参与生成的接口数据 */
export declare const parset: (config: IConfig) => Promise<Array<IApi>>;
