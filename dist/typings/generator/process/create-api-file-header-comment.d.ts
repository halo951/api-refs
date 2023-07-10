import type { IApi } from '../../intf/IApi';
import type { IConfig } from '../../intf/IConfig';
/** 创建 api 文件 文件头注释 */
export declare const createApiFileHeaderComment: (apis: Array<IApi>, config: IConfig) => string;
