import chalk from 'chalk'
import Enquirer from 'enquirer-esm'

import { box } from './box'

interface ITree<T> {
    /** 原始数据 */
    value: T

    /**
     * 是否展开
     * @description 仅当 children 不为空时生效
     */
    expand: boolean

    /** 是否选中 */
    checked: boolean

    /** 是否关联到父节点 */
    relate?: boolean
    /** 父节点 (仅 relate 节点包含) */
    parent?: ITree<T>

    /** 子节点集合 */
    children?: Array<ITree<T>>
}

interface ITreeSelectOptions<T> {
    /** label 消息 */
    message: string | (() => string) | (() => Promise<string>)
    /** 头部提示 */
    header?: string
    /** 选项 */
    choices: Array<T>
    /** 初始值 */
    initial?: Array<T>
    /** 是否禁用选项 */
    disabled?: (node: ITree<T>) => boolean
    /** 是否启用关联选项 */
    relate?: boolean
}

const Base: any = Enquirer.Prompt

/** 统计数组长度 */
const count = (arr?: Array<unknown>) => (arr ?? []).length

export class TreeSelectPrompt<
    T extends { id: unknown; name: string; relate?: boolean; children?: Array<T> }
> extends Base {
    /** 当前选中值 */
    value!: Array<Omit<T, 'children'>>
    /** 列表 */
    tree: Array<ITree<T>> = []
    /** 当前活动行在第几行 */
    active: number = 0
    /** 分页数据 */
    paging: Array<{ node: ITree<T>; str: string }> = []

    /** 是否禁用当前项选中 */
    disabled?: (node: ITree<T>) => boolean

    /** 是否启用合并选项 */
    relate?: boolean

    constructor(options: ITreeSelectOptions<T>) {
        super(options as any)
        this.value = options.initial ?? []
        this.disabled = options.disabled
        this.relate = options.relate
        this.tree = this.origin2tree(options.choices ?? [], options.initial ?? [])
        // if user input 'ctrl + c', then exit current process.
        this.on('keypress', () => {})
        this.on('cancel', () => process.exit(200))
        // on submit, and clear screen
        this.on('submit', () => {
            let { size } = this.state
            this.clear(size)
            this.restore()
            return true
        })
    }

    /** 获取默认状态下, 节点是否展开 */
    getDefaultExpand(choices: Array<T>) {
        /** 统计包含子节点的节点数量, 用于调整是否默认展开所有节点 */
        const total = (opts: Array<T>): number => {
            let t: number = 0
            for (const opt of opts) {
                if (opt.children) {
                    t++
                    t += total(opt.children)
                }
            }
            return t
        }
        return total(choices) < 4
    }

    /** 原始选项转化节点树 */
    origin2tree(choices: Array<T>, initial: Array<T>): Array<ITree<T>> {
        let value: Array<ITree<T>> = []
        let defaultexpand: boolean = this.getDefaultExpand(choices)
        // > 将原始节点, 转化为 TreeSelectPrompt 使用的树结构
        for (const item of choices) {
            let selected: T | undefined = initial.find((i) => i.id === item.id)
            let n: ITree<T> = {
                value: item,
                expand: false,
                checked: !!selected
            }
            if (item.children?.length) {
                n.expand = defaultexpand
                n.children = this.origin2tree(item.children, initial)
                // > 添加 relate 选项
                if (this.relate) {
                    n.children.unshift({
                        relate: true,
                        checked: false,
                        parent: n
                    } as unknown as ITree<T>)
                }
            }
            value.push(n)
        }
        return value
    }

    /** 节点树转化原始选项 */
    tree2origin(
        value: Array<ITree<T>>,
        parentIsRelated?: boolean,
        parentIsChecked?: boolean
    ): Array<Omit<T, 'children'>> {
        let out: Array<Omit<T, 'children'>> = []
        const skip: boolean = !!(parentIsRelated && parentIsChecked)

        for (const item of value) {
            // 忽略 relate 节点
            if (item.relate) continue
            if (item.children) {
                const relate = item.children?.find((c) => c.relate)
                const isRelated: boolean = !!relate?.checked
                const hasUnSelect: boolean = !!item.children?.some((c) => !c.relate && !c.checked)
                const disabled: boolean = this.disabled?.(item)
                if (!isRelated && item.checked && !skip && !disabled) {
                    out.push(item.value)
                }
                if (isRelated && !hasUnSelect && !skip && !disabled) {
                    out.push({ ...item.value, relate: true })
                }
                out = out.concat(this.tree2origin(item.children, isRelated, !hasUnSelect))
            } else if (item.checked && !skip) {
                out.push(item.value)
            }
        }
        return out
    }

    /** 上 */
    up(): void {
        if (this.active > 0) {
            this.active--
        } else {
            this.active = this.paging.length - 1
        }
        this.render()
    }

    /** 下 */
    down(): void {
        if (this.active <= this.paging.length - 1) {
            this.active++
        } else {
            this.active = 0
        }
        this.render()
    }

    /** 左 | 收起 */
    left(): void {
        // ? 是否包含子集, 包含则切换子集选中状态
        const n = this.paging.find((_, i) => i === this.active)
        const close = (node?: ITree<T>): void => {
            if (!node) return
            node.expand = false
            if (node.children) {
                for (const c of node.children) close(c)
            }
        }
        // > 关闭 (递归关闭)
        close(n?.node)
        // > render
        this.render()
    }

    /** 右 | 展开 */
    right(): void {
        // ? 是否包含子集, 包含则切换子集选中状态
        const n = this.paging.find((n, i) => i === this.active)
        // > 展开
        if (n && count(n.node.children) > 0) {
            n.node.expand = true
        }
        // > render
        this.render()
    }

    /** 切换选中项 */
    space(): void {
        /** 选中当前节点, 并向下修改关联节点 */
        const select = (n: ITree<T>, state: boolean, forceDeep: boolean): void => {
            // ? 如果当前节点禁用了, 那么不允许选中
            if (this.disabled?.(n)) return
            n.checked = state
            // ? 如果没有子节点, 忽略向下查找操作
            if (!n.children?.length) return
            // ? 如果(包含子节点)节点被选中, 那么展开
            // if (n.checked) n.expand = true
            const relate: ITree<T> | undefined = n.children.find((c) => c.relate)
            // ? 如果没有启用节点关联, 或者节点关联选项被勾选, 那么除了关联节点选项外, 其他节点均被选中
            if (!relate || relate.checked || forceDeep) {
                for (const c of n.children) {
                    if (!c.relate || forceDeep) {
                        select(c, state, forceDeep)
                    }
                }
            }
        }
        /** 从上向下遍历, 修改上级节点状态 */
        const check = (list: Array<ITree<T>>): void => {
            for (const item of list) {
                // ! 当父节点禁用时, 所有子节点选中, 父节点也不选中.
                if (this.disabled && !this.disabled(item as ITree<T>)) {
                    continue
                }
                const { children } = item as ITree<T>
                if (!children) continue
                const relateChecked: boolean = (children.find((c) => c.relate) ?? { checked: true }).checked
                if (relateChecked) {
                    const hasUnSelect: boolean = children.some((c) => !c.relate && !c.checked)
                    item.checked = !hasUnSelect
                }
                // > 遍历子节点
                check(children)
            }
        }
        // ? 是否包含子集, 包含则切换子集选中状态
        const n: { node: ITree<T> } | undefined = this.paging.find((_, i) => i === this.active)
        if (n) {
            select(n.node, !n.node.checked, false)
            if (n.node.relate && n.node.checked) {
                select(n.node.parent as ITree<T>, true, true)
            }
        }
        check(this.tree)
        this.value = this.tree2origin(this.tree)
        this.render()
    }

    /** 生成渲染内容 */
    generateList(): string {
        const a = ['+', '-', '↓'] // +
        const s = [chalk.white('⬡'), chalk.blue('⬢'), '', chalk.yellowBright('⬢')]
        const point = (tree: Array<ITree<T>>, zIndex: number = 0) => {
            for (const node of tree) {
                let str: Array<string> = []
                let index = this.paging.length
                let prefix: string = ''
                str.push(new Array(zIndex).fill('  ').join(''))
                if (node.expand) {
                    prefix = a[2]
                } else if (count(node.children) > 0) {
                    prefix = a[0]
                } else {
                    prefix = a[1]
                }
                str.push(prefix)
                if (!this.disabled?.(node)) {
                    str.push(node.checked ? (node.relate ? s[3] : s[1]) : s[0])
                    str.push(' ')
                }
                if (node.relate) {
                    str.push(`(${chalk[node.checked ? 'yellow' : 'white']('关联上一级')})`)
                } else {
                    str.push(node.value.name)
                }
                let o = str.join(' ')
                this.paging.push({
                    node,
                    str: index === this.active ? chalk.bgGray(o) : o
                })
                if (node.expand && count(node.children) > 0) {
                    point(node.children ?? [], zIndex + 1)
                }
            }
        }
        this.paging = []
        point(this.tree)
        return this.paging.map((p) => p.str).join('\n')
    }

    /** 渲染 */
    async render(): Promise<void> {
        let { size } = this.state
        let prompt = ''
        let header = await this.header()
        if (header?.length) {
            header = box(header, { color: '#11998e' })
        }

        let prefix = await this.prefix()
        let separator = await this.separator()
        let message = await this.message()

        if (this.options.promptLine !== false) {
            prompt = [prefix, message, separator, ''].join(' ')
            this.state.prompt = prompt
        }

        let help = (await this.error()) || (await this.hint())
        let body = await this.generateList()
        let footer = await this.footer()

        if (help && !prompt.includes(help)) prompt += ' ' + help

        this.clear(size)
        this.write([prompt, header, body, footer].filter(Boolean).join('\n'))
        this.write(this.margin[2])
        this.restore()
    }
}
