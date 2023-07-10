interface ITree<T> {
    /** 原始数据 */
    value: T;
    /**
     * 是否展开
     * @description 仅当 children 不为空时生效
     */
    expand: boolean;
    /** 是否选中 */
    checked: boolean;
    /** 是否关联到父节点 */
    relate?: boolean;
    /** 父节点 (仅 relate 节点包含) */
    parent?: ITree<T>;
    /** 子节点集合 */
    children?: Array<ITree<T>>;
}
interface ITreeSelectOptions<T> {
    /** label 消息 */
    message: string | (() => string) | (() => Promise<string>);
    /** 头部提示 */
    header?: string;
    /** 选项 */
    choices: Array<T>;
    /** 初始值 */
    initial?: Array<T>;
    /** 是否禁用选项 */
    disabled?: (node: ITree<T>) => boolean;
    /** 是否启用关联选项 */
    relate?: boolean;
}
declare const Base: any;
export declare class TreeSelectPrompt<T extends {
    id: unknown;
    name: string;
    relate?: boolean;
    children?: Array<T>;
}> extends Base {
    /** 当前选中值 */
    value: Array<Omit<T, 'children'>>;
    /** 列表 */
    tree: Array<ITree<T>>;
    /** 当前活动行在第几行 */
    active: number;
    /** 分页数据 */
    paging: Array<{
        node: ITree<T>;
        str: string;
    }>;
    /** 是否禁用当前项选中 */
    disabled?: (node: ITree<T>) => boolean;
    /** 是否启用合并选项 */
    relate?: boolean;
    constructor(options: ITreeSelectOptions<T>);
    /** 获取默认状态下, 节点是否展开 */
    getDefaultExpand(choices: Array<T>): boolean;
    /** 原始选项转化节点树 */
    origin2tree(choices: Array<T>, initial: Array<T>): Array<ITree<T>>;
    /** 节点树转化原始选项 */
    tree2origin(value: Array<ITree<T>>, parentIsRelated?: boolean, parentIsChecked?: boolean): Array<Omit<T, 'children'>>;
    /** 上 */
    up(): void;
    /** 下 */
    down(): void;
    /** 左 | 收起 */
    left(): void;
    /** 右 | 展开 */
    right(): void;
    /** 切换选中项 */
    space(): void;
    /** 生成渲染内容 */
    generateList(): string;
    /** 渲染 */
    render(): Promise<void>;
}
export {};
