import type { IApi } from '../intf/IApi';
import type { IConfig } from '../intf/IConfig';
/** 生成 */
export declare const generate: (apis: Array<IApi>, config: IConfig) => Promise<void>;
