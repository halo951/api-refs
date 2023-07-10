import type { IApi } from '../../intf/IApi'
import type { IApifoxCatalog, IApifoxUsage, IConfig } from '../../intf/IConfig'
import type { IDetail, ITransformOptions } from './intf'

import chalk from 'chalk'
import { klona } from 'klona/lite'

import {
    createInputTask,
    inputSelect,
    createMessage,
    enquirer,
    inputMultiFileNameForm,
    inputBoolean
} from '../../utils/forms'
import { asyncLoadingTask } from '../../utils/loading'
import { TreeSelectPrompt } from '../../utils/tree-select-prompt'
import { point } from '../../utils/point'

import { apis } from './apis'
import { transform } from './transform'

/** 输入账号、密码表单并触发登录操作 */
const inputLoginForm = async (): Promise<string> => {
    return await createInputTask({
        input: async () => {
            const loginType: '手机号' | '邮箱' = await inputSelect('选择apifox登录方式', ['邮箱', '手机号'], '邮箱')
            let input: { form: any }
            if (loginType === '手机号') {
                input = await enquirer.prompt({
                    type: 'form',
                    name: 'form',
                    message: createMessage('launch login...'),
                    choices: [
                        { name: 'account', message: '手机号 (+86):' },
                        { name: 'password', message: '密码' }
                    ],
                    result(value: any) {
                        value.account = '+86 ' + value.account
                        value.mobile = value.account
                        value.loginType = 'MobilePassword'
                        return value
                    }
                })
            } else {
                input = await enquirer.prompt({
                    type: 'form',
                    name: 'form',
                    message: createMessage('launch login...'),
                    choices: [
                        { name: 'account', message: '账号/邮箱' },
                        { name: 'password', message: '密码' }
                    ],
                    result(value: any) {
                        value.loginType = 'EmailPassword'
                        return value
                    }
                })
            }
            return input.form
        },
        exec: async (form) => {
            const res = await apis.login(form)
            return res.data.accessToken
        }
    })
}
/** 检查接口引用是否发生更新
 *
 * @description 先对tree进行扁平化操作, 然后 diff 出差集, 存在差集则发生了更新
 */
const checkFolderIsChanged = (n: Array<IApifoxCatalog>, o: Array<IApifoxCatalog>): boolean => {
    const flat = (tree: Array<IApifoxCatalog>): Array<IApifoxCatalog> => {
        const out: Array<IApifoxCatalog> = []
        return tree.reduce((list, current) => {
            list.push(current)
            if (current.children) {
                let children = flat(current.children)
                return [...list, ...children]
            } else {
                return list
            }
        }, out)
    }
    const a: Array<IApifoxCatalog> = flat(n)
    const b: Array<IApifoxCatalog> = flat(o)
    const differenceSet: Array<IApifoxCatalog> = a.filter((i1) => {
        return !b.some((i2) => i2.id === i1.id)
    })
    return differenceSet.length > 0
}

/** 解析配置, 并返回需要参与生成的接口数据 */
export const parset = async (config: IConfig): Promise<Array<IApi>> => {
    let token: string
    let projects: Array<{ id: number; name: string }> // Array<[projectId, projectName]>
    if (!config.apifox) config.apifox = {}
    // 1. 检查用户登录
    if (!config.apifox.accessToken) {
        config.apifox.accessToken = await inputLoginForm()
    }
    token = config.apifox.accessToken
    const [res1, res2] = await asyncLoadingTask(
        Promise.all([apis.userTeams(token), apis.userProjects(token)]),
        '正在加载可选项目...'
    )
    // 2. 检查是否已经配置了项目 id
    if (config.apifox.project instanceof Array) {
        projects = config.apifox.project
    } else if (config.apifox.project?.id) {
        projects = [config.apifox.project]
    } else {
        projects = []
    }
    // 2.1 过滤不属于当前用户的项目
    projects = projects.filter((o) => !!res2.data.find((n: any) => n.id === o.id))
    // 2.2 如果用户没有选择项目, 那么引导用户选择
    if (projects.length === 0) {
        const tree = res1.data.map((node) => {
            return {
                id: node.id,
                name: node.name,
                children: res2.data
                    .filter((proj) => proj.teamId === node.id)
                    .map((proj) => {
                        return { id: proj.id, name: proj.name }
                    })
            }
        })
        projects = await new TreeSelectPrompt({
            message: '选择项目',
            choices: tree as Array<{ id: number; name: string }>,
            disabled: (node) => !!node.children
        }).run()
    }
    if (projects.length === 0) {
        point.warn('未选择任何项目, 程序退出')
        process.exit(200)
    }
    // 2.3 赋值更新
    config.apifox.project = projects.length > 1 ? projects : projects[0]

    // 2.3 批量请求接口原始数据
    const origin: ITransformOptions = {}
    const getTeamId = (projectId: number): number => {
        return res2.data.find((proj) => proj.id === Number(projectId)).teamId
    }
    for (const { id: projectId } of projects) {
        const [r1, r2, r3, r4] = await asyncLoadingTask(
            Promise.all([
                apis.apiTreeList(token, projectId),
                apis.apiDetails(token, projectId),
                apis.apiSchemas(token, projectId),
                apis.projectMembers(token, projectId, getTeamId(projectId))
            ]),
            `正在获取 '${chalk.green(res2.data.find((p) => p.id === projectId)?.name)}' 项目接口数据...`
        )
        origin[projectId] = {
            treeList: r1.data,
            details: r2.data,
            schemas: r3.data,
            projectMembers: r4.data
        }
    }
    // @ 获取所有项目的 TreeList
    const treeList = Object.values(origin).reduce((all, { treeList }) => all.concat(treeList), [] as Array<any>)
    // @ 过滤 treeList 中的 接口文件夹, 并按照项目维度, 进行平铺处理
    const transformFolder = (tree: Array<any>): Array<IApifoxCatalog> => {
        let folders: Array<IApifoxCatalog> = []
        for (const node of tree) {
            if (node.type !== 'apiDetailFolder') continue
            let catalog!: IApifoxCatalog
            if (node.folder) {
                catalog = {
                    id: node.folder.id,
                    name: node.folder.name
                }
            } else if (node.id) {
                catalog = { id: node.id, name: node.name }
            }
            if (!catalog) continue
            if (node.children.length) {
                const children = transformFolder(node.children)
                if (children.length) catalog.children = children
            }
            folders.push(catalog)
        }
        return folders
    }
    /** 如果根目录下有接口, 那么目录集合中, 将根目录加进去 */
    const appendRootFolder = (catalog: Array<IApifoxCatalog>, tree: Array<any>): void => {
        if (tree.some((node) => node.type === 'apiDetail')) {
            catalog.unshift({ id: -1, name: '(根目录)' })
        }
    }
    // @ 记录最新的目录结构
    const catalog: Array<IApifoxCatalog> = transformFolder(treeList)

    // 添加根目录
    appendRootFolder(catalog, treeList)

    point.step('检查配置')
    const changed: boolean = checkFolderIsChanged(catalog, config.apifox.catalog ?? [])
    let usage: Array<IApifoxUsage> = config.apifox.usage ?? []
    if (usage.length === 0 || changed) {
        usage = await new TreeSelectPrompt({
            message: '选择参与生成的接口文件夹',
            choices: klona(catalog),
            header: changed ? chalk.yellow('🚧 ', chalk.white('apifox 文档发生了变化, 请重新确认生成内容')) : undefined,
            initial: config.apifox.usage ?? [],
            relate: true
        }).run()
    }

    // > 记录选择的需要生成的文件夹
    for (const u of usage) {
        delete u['children']
    }

    // > 为接口文件添加映射文件名
    if (usage.find((u) => typeof u.map === 'undefined')) {
        const originUsage: Array<IApifoxUsage> = config.apifox.usage ?? []
        const map = await inputMultiFileNameForm(
            '设置接口映射文件名 (Tips: 需要遵循文件命名规则, 重复命名将生成到同一文件内)',
            usage.map((u) => {
                return {
                    name: u.id,
                    message: u.name,
                    initial: originUsage.find((ou) => ou.id === u.id)?.map
                }
            })
        )
        // > 覆盖
        for (const u of usage) {
            u.map = map[u.id]
        }
    }
    // > 记录
    // TIPS: 这里的规则是, 当用户填写完成usgae后再进行保存, 避免未完成 usage 配置情况下更新, 导致无法识别出后续产生的目录变化.
    config.apifox.catalog = catalog
    config.apifox.usage = usage
    // @ 合并一份总的 details 用来检查是否存在废弃接口
    const details: Array<IDetail> = Object.values(origin).reduce((total, { details }) => {
        return [...total, ...details]
    }, [])

    // ? 当存在废弃接口时, 提示用户设置废弃接口处理策略
    if (
        config.apifox.removeDeprecatedApi === undefined &&
        details.find((d) => ['deprecated', 'obsolete'].includes(d.status))
    ) {
        const strategy = await inputSelect(
            '存在废弃接口, 设置废弃接口处理策略 (包含: 将废弃、已废弃 标记)',
            ['移除', '保留'],
            '移除'
        )
        config.apifox.removeDeprecatedApi = strategy === '移除'
    }

    point.step('原始数据转换')
    // > 将原始的接口信息转换成 Array<IApi>
    return transform(origin, config, projects)
}
