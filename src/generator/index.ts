import type { IApi } from '../intf/IApi'
import type { IConfig } from '../intf/IConfig'

import { GroupBy } from 'array-grouping'

import { point } from '../utils/point'
import { parseImportStatement } from './process/parse-import-statement'
import { calcDefaultContentType } from './process/calc-default-content-type'
import { strictCheck } from './process/strict-check'
import { createFunctionNameFactory } from './process/create-function-name-factory'
import { createRequestArrowFunction } from './process/create-request-arrow-function'
import { createApiFileHeaderComment } from './process/create-api-file-header-comment'
import { writeFile } from './process/write-file'
import { createIndexFile } from './process/create-index-file'

/** 公共的工具方法 */
const FUNCTION_COOKIE_INJECT: string = `
/** 将 cookie 转化成 header 参数 */
const cookieToHeaderValue = (cookies: { [key: string]: any }): string => {
    return Object.entries(cookies)
        .map(([k, v]) => k + '=' + v)
        .join('; ')
}
`

/** 生成 */
export const generate = async (apis: Array<IApi>, config: IConfig): Promise<void> => {
    point.step('开始生成')
    // @ 根据 outFile 对接口进行分组
    const groupApi: Array<Array<IApi>> = GroupBy(apis, (a, b) => a.outFile.path === b.outFile.path)
    // @ 解析导入语句
    const { requestUtil, importStatement } = parseImportStatement(config.output?.applyImportStatements)
    // @ 获取默认的contentType
    const defaultContentType: string = calcDefaultContentType(apis)
    // @ 生成结果缓存
    const cache: Array<[string, string]> = []
    // > 分组遍历生成
    for (const group of groupApi) {
        // > 严格模式检查
        strictCheck(group, config)
        // @ 创建方法名生成器工具 (避免同文件方法命名重复.)
        const factory = createFunctionNameFactory(group)
        // @ 定义输出文件目录
        const path: string = group[0].outFile.path

        // 创建文件正文
        const content: Array<string> = []

        // 写入导入语句
        content.push(importStatement)
        content.push(``)

        // 写入文件头注释
        content.push(createApiFileHeaderComment(group, config))
        // 写入公共的工具方法
        if (group.some((api) => api.requestObject?.cookie)) {
            content.push(FUNCTION_COOKIE_INJECT)
        }
        content.push('\n\n')
        // 将接口信息转化为代码, 并写入到文件
        for (const api of group) {
            try {
                // @ 生成接口方法名
                const functionName: string = factory.generate(api)
                // > 生成接口文件代码
                const code: string = await createRequestArrowFunction({
                    requestUtil,
                    functionName,
                    defaultContentType,
                    api,
                    config
                })
                content.push(code)
            } catch (error) {
                point.error(
                    `生成 '${api.outFile.name}(${api.outFile.map}${
                        config.output?.language === 'ts' ? '.ts' : '.js'
                    })' ${api.comment.folder}/${api.comment.name} <${api.url}> 接口出错`
                )
            }
        }
        // 将生成结果写入到缓存, 然后后面统一导出
        cache.push([path, content.join('\n\n')])
    }

    point.step('开始写入到文件')

    // > 创建 index file
    if (config.output.appendIndex) {
        const { indexFilePath, code } = createIndexFile(groupApi, config)
        cache.push([indexFilePath, code])
    }

    // > 写入结果文件
    for (const [path, content] of cache) writeFile(path, content, config)

    if (config.showTotal !== false) {
        point.total('生成统计')
        const total = groupApi.map((group) => {
            const { path, project } = group[0].outFile
            return { path, project: project.join('\n'), ['apis total']: group.length }
        })
        console.table(total)
    }

    point.success('写入完成')
}
