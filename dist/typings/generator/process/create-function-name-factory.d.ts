import type { IApi } from '../../intf/IApi';
/** 创建接口方法名的工厂方法 */
export declare const createFunctionNameFactory: (apis: Array<IApi>) => {
    /**
     * 生成接口方法名
     *
     * @param api api接口
     */
    generate(api: IApi): string;
};
