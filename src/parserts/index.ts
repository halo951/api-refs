import type { IConfig, TDatasource, TLanguage } from '../intf/IConfig'
import type { IApi } from '../intf/IApi'

import fs from 'node:fs'
import np from 'node:path/posix'
import set from 'set-value'
import get from 'get-value'
import prettier from 'prettier'
import * as glob from 'glob'
import Ajv, { DefinedError } from 'ajv'
import schema from '../../api-refs.schema.json' assert { type: 'json' }

import { parset as apifox } from './apifox'
import { point } from '../utils/point'
import { isUndefined } from '../utils/is'
import { inputBoolean, inputSelect, inputText } from '../utils/forms'
import { upgrade } from './upgrade'
import { findPackagePath } from '../utils/read-dependency-pkg'
import { fileURLToPath } from 'node:url'

const parsets: { [key: string]: (config: IConfig) => Promise<Array<IApi>> } = {
    apifox
}
const pkgPath: string = findPackagePath(fileURLToPath(import.meta.url)).next().filename

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))

/** 获取初始化配置 */
const initialConfig = (): IConfig => {
    return {
        $schema: './api-refs.schema.json',
        version: pkg.version,
        datasource: 'apifox' // Tips: 如果后面集成了多个平台, 这里需要改成留空
    }
}

/** 读取json文件 */
const readyJsonSync = <T>(jsonFilePath: string, parseFailed: T): T => {
    try {
        if (!fs.existsSync(jsonFilePath)) return parseFailed
        let jsonData: string = fs.readFileSync(jsonFilePath, {
            encoding: 'utf-8'
        })
        // Tips: 增加容错, 尝试通过 prettier 修复格式不正确的json文件
        jsonData = prettier.format(jsonData, { parser: 'json' })
        return JSON.parse(jsonData) as T
    } catch (error) {
        return parseFailed
    }
}

/** 通过 ajv 解析配置文件, 并将不符合的属性移除 */
export const parseConfig = (configFilePath: string, reset: boolean): IConfig => {
    // @ 读取配置文件
    const config: IConfig = reset ? initialConfig() : readyJsonSync(configFilePath, initialConfig())
    // @ 创建验证器
    const instance = new Ajv({
        allowUnionTypes: true,
        allErrors: true,
        messages: false
    })
    // > 校验 schema 协议
    instance.validateSchema(schema)
    // > 处理解析异常 (将出现异常的属性值删除, 方便后续覆盖)
    if (!instance.validate(schema, config)) {
        const skipRules: Array<DefinedError['keyword']> = ['required']
        for (const { instancePath, keyword, params } of (instance.errors ?? []) as Array<DefinedError>) {
            // ? 如果是参数缺失或其他不需要修正的类型, 当出现校验失败时, 不需要删除
            if (skipRules.includes(keyword)) continue
            // 将 `instancePath` 格式转化为 set-value 的 key 值格式
            const key: string = instancePath
                .split('/')
                .filter((s) => s !== '')
                .concat([(params as any).additionalProperty])
                .join('.')
            // ? 判断是否存在 upgrade 逻辑, 存在触发升级操作
            if (upgrade[key]) {
                set(config, key, upgrade[key](get(config, key)))
            } else {
                set(config, key, undefined)
            }
        }
    }
    return config
}

/**
 * 查找 schema 协议文件路径
 *
 * @description 优先查找项目内 schema 文件, 如果pnpm等工具, 可以通过 unpkg 获取 schema 支持
 */
const findSchemaFilePath = (schema: string | undefined): string => {
    const dirs: Array<string> = [
        './api-refs.schema.json',
        'node_modules/api-refs/api-refs.schema.json',
        'api-refs/api-refs.schema.json'
    ]
    const url: string = `https://unpkg.com/api-refs@${pkg.version}/api-refs.schema.json`
    if (schema && fs.existsSync(schema)) return schema
    const dir: string | undefined = dirs.find((dir) => fs.existsSync(dir))
    return dir || url
}

/** 配置输入以及加载需要生成的 apis 集合 */
export const inputConfigAndLoadApis = async (config: IConfig): Promise<Array<IApi>> => {
    let next: boolean = false
    // 1. 版本号
    point.step('检查工具版本')
    config.$schema = findSchemaFilePath(config.$schema)
    if (!config.version) {
        point.warn(`配置中, 缺少 'version', 无法校验是否因工具更新导致生成结果差异, 请知悉~`)
        config.version = pkg.version
    } else {
        // Tips: 当大版本变化时, 提示用户确认是否继续生成.
        const [x1] = config.version.split('.')
        const [x2] = pkg.version.split('.')
        if (x1 !== x2) {
            next = await inputBoolean(
                'api-refs 工具发现大版本更新, 新版本生成结果可能与旧版本产生较大差异, 是否继续生成?'
            )
            if (!next) process.exit()
            config.version = pkg.version
        }
    }

    // 2. 补全生成策略
    point.step('设置生成策略')

    let output: Partial<IConfig['output']> = {}
    if (config.output) {
        output = config.output
    }

    if (isUndefined(output.language)) {
        output.language = await inputSelect<TLanguage>('选择生成语言模板', ['ts', 'js', 'only-js'], 'ts')
    }

    if (isUndefined(output.dir)) {
        output.dir = await inputText('输入导出目录', './src/apis')
    }

    if (isUndefined(output.appendIndex)) {
        output.appendIndex = await inputBoolean('选择是否添加 index file 公共导出', true)
    }

    if (isUndefined(output.applyImportStatements)) {
        // Tips: 尝试通过文件扫描的方式, 创建请求工具导入语句
        const rootPath: string = process.cwd()
        let res: Array<string> = []
        let searchPath: string = output.dir
        let n: number = 0
        // > 通过递归的方式, 逐级扫描文件夹, 找到 request 实例
        while (searchPath !== np.dirname(searchPath) && n < 10) {
            res = glob.sync(`./**/{request,axios}\.{t,j}s`, { cwd: searchPath })
            if (res.length > 0) {
                break
            }
            // > 扫描上级目录
            searchPath = np.dirname(searchPath)
            n++
        }
        const projectPkg: any = fs.readFileSync(np.join(rootPath, 'package.json'), { encoding: 'utf-8' })
        let statement: string = "import axios from 'axios'"
        if (res.length > 0) {
            const requestPath: string = res[0]
            const requestFile: string = fs.readFileSync(np.join(searchPath, requestPath), { encoding: 'utf-8' })
            let importPath: string = np.relative(output.dir, np.join(searchPath, requestPath)).replace(/\\/g, '/')
            importPath = importPath.replace(np.extname(importPath), '')
            if (/export default/.test(requestFile)) {
                statement = `import request from '${importPath}'`
            } else {
                const firstExport: Array<string> | null = requestFile.match(/export const (.+?)[ =]/)
                if (firstExport) {
                    statement = `import { ${firstExport[1]} } from '${importPath}'`
                } else {
                    statement = `import request from '${importPath}'`
                }
            }
        } else {
            if (!projectPkg.dependencies?.axios && !projectPkg.devDependencies?.axios) {
                point.warn('未扫描到合适的请求工具, 将导入默认语句')
                statement = "import request from '@/utils/request'"
            }
        }
        output.applyImportStatements = await inputText('设置导入语句 (可跳过)', statement)
    }

    config.output = output as Required<IConfig['output']>

    // 3. 选择数据源并拉取接口数据
    point.step('加载数据源')
    if (!config.datasource) {
        config.datasource = await inputSelect<TDatasource>('选择数据源', ['apifox'], 'apifox')
    }

    // 4. 根据数据源, 选择不同的 parset 加载及解析数据
    const parset = parsets[config.datasource]
    const apis: Array<IApi> = await parset(config)

    return apis
}
