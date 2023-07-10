import Enquirer from 'enquirer-esm';
export declare const enquirer: Enquirer<any>;
export declare const createMessage: (msg: string) => (() => string);
interface ITaskRunner<T, E> {
    /** step1. 输入 */
    input: () => Promise<E>;
    /** step2. (可选) 执行 */
    exec?: (form: E) => T | Promise<T>;
    max?: number;
    maxErrorMessage?: string;
}
/**
 * 创建输入任务执行工具
 *
 * @description 避免 `enquirer` 单次输入失败导致程序中断
 */
export declare const createInputTask: <T, E>(opt: ITaskRunner<T, E>) => Promise<T>;
/** 输入文本 */
export declare const inputText: <T = string>(message: string, initial?: T) => Promise<T>;
/** 输入 boolean 值 */
export declare const inputBoolean: <T = boolean>(message: string, initial?: T) => Promise<T>;
/** 输入 number 值 */
export declare const inputNumber: <T = number>(message: string, initial?: T) => Promise<T>;
/** 输入可选值 */
export declare const inputSelect: <T = string>(message: string, choices: T[], initial?: T) => Promise<T>;
/** 多行表单输入 (文件名) */
export declare const inputMultiFileNameForm: (message: string, form: {
    name: any;
    message: string;
}[]) => Promise<{
    [key: string]: string;
}>;
export {};
