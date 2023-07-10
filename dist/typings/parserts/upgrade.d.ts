/**
 * 升级工具
 *
 * @description 用来处理工具升级后, 与旧版本配置格式差异产生的问题
 */
export declare const upgrade: {
    [key: string]: (old: any) => any;
};
