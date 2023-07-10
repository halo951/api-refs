import type { IApi } from '../../intf/IApi';
import type { IConfig } from '../../intf/IConfig';
import type { ITransformOptions } from './intf';
/** 转换接口原始信息为 IApi 格式 */
export declare const transform: (options: ITransformOptions, config: IConfig, projects: Array<{
    id: number;
    name: string;
}>) => Array<IApi>;
