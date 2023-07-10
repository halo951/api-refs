/// <reference types="node" />
/** command loading util */
export default class CommandLoadingUtil {
    str: Array<string>;
    suffix: string;
    duration: number;
    timer: NodeJS.Timer;
    n: number;
    /** 显示 */
    show(): void;
    /** 销毁 */
    destory(): void;
    /** 渲染到命令行 */
    render(): void;
}
/** 执行包含loading过程的异步任务 */
export declare const asyncLoadingTask: <T>(task: Promise<T>, message?: string) => Promise<T>;
