import type { IApi } from '../../intf/IApi';
import type { IConfig } from '../../intf/IConfig';
/** 创建 index file */
export declare const createIndexFile: (groupApi: Array<Array<IApi>>, config: IConfig) => {
    indexFilePath: string;
    code: string;
};
