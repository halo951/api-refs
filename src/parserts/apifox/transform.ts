import type { Method } from 'axios'
import type { IApi } from '../../intf/IApi'
import type { IConfig } from '../../intf/IConfig'
import type {
    IApiDetail,
    IApiDetailFolder,
    ITree,
    IDetail,
    ITransformOptions,
    IUsedApiDetail,
    IParameters,
    ISchema
} from './intf'

import np from 'node:path/posix'
import { point } from '../../utils/point'

import { mergeArray, parametersToJSONSchema7, mappingJSONSchemaRef } from './utils'

/** 过滤引用的节点树 */
const filterUsedApi = (
    tree: Array<ITree>,
    used: IConfig['apifox']['usage'][0],
    /** 第三位参数用来过滤, 未产生关联的映射路径 */
    otherUsed: IConfig['apifox']['usage']
): Array<IUsedApiDetail> => {
    // ? 过滤根目录
    if (used.id === -1) {
        return tree
            .filter((node: ITree) => node.type === 'apiDetail')
            .map((node: IApiDetail) => {
                return {
                    node,
                    paths: [] as Array<IApiDetailFolder>
                }
            })
    }

    /** 查找选中的文件夹 */
    const findCheckedFolder = (cTree: Array<ITree>, parent: Array<IApiDetailFolder>): Array<IApiDetailFolder> => {
        let output: Array<IApiDetailFolder>
        for (const node of cTree) {
            const id: number = Number(node.key.split('.')[1])
            if (node.type === 'apiDetailFolder') {
                if (id === used.id) {
                    output = [...parent, node]
                    break
                }
                const folder: Array<IApiDetailFolder> = findCheckedFolder(node.children, parent.concat(node))
                if (folder) {
                    output = folder
                    break
                }
            }
        }
        return output
    }

    /** (递归) 将选中的 api tree 过滤并转化为一维数组 */
    const deepApi = (cTree: IApiDetailFolder, parent: Array<IApiDetailFolder>): Array<IUsedApiDetail> => {
        let output: Array<IUsedApiDetail> = []
        for (const node of cTree.children) {
            const id: number = Number(node.key.split('.')[1])
            if (node.type === 'apiDetail') {
                output.push({ node, paths: parent })
            } else if (!otherUsed.some((u) => u.id === id) && used.relate) {
                output = output.concat(deepApi(node, parent.concat(node)))
            }
        }
        return output
    }
    const folder = findCheckedFolder(tree, [])
    if (folder?.length) {
        const last = folder[folder.length - 1]
        return deepApi(last, folder)
    }
    return []
}

/** 转换请求参数对象 */
const transformRequestObject = (
    detail: IDetail,
    schemas: Array<ISchema>,
    projectName: string
): IApi['requestObject'] => {
    const { commonParameters, parameters } = detail
    const isDeduped = (a: IParameters, b: IParameters) => a.id === b.id
    const mergedParameters = {
        query: mergeArray(
            [commonParameters?.path, commonParameters?.query, parameters?.path, parameters?.query],
            isDeduped
        ),
        // @chagne 2023年7月10日 11:01:50 变更: 考虑到实际使用场景, cookie 和 header的公共参数最好是方法方法实例内写入, 这里可以忽略
        cookie: parameters?.cookie,
        header: parameters?.header
    }
    let auth: { username: string; password: string }
    // > parse auth
    if (detail.auth) {
        switch (detail.auth.type) {
            case 'noauth':
            case undefined:
                break
            case 'apikey':
                if (!detail.auth.apikey) break
                mergedParameters[detail.auth.apikey.in].push({
                    id: 'Auth',
                    name: detail.auth.apikey.key,
                    required: false,
                    description: 'Auth',
                    type: 'string',
                    enable: true,
                    example: detail.auth.apikey.value
                })
                break
            case 'bearer':
                if (!detail.auth.bearer) break
                mergedParameters.header.push({
                    id: 'Auth',
                    name: 'Authorization',
                    required: false,
                    description: 'Auth',
                    type: 'string',
                    enable: true,
                    example: detail.auth.bearer.token
                })
                break
            case 'basic':
                auth = detail.auth.basic
                break
            default:
                point.warn(`请注意, 项目 <${projectName}> 下的接口 '${detail.path}' 配置的 Auth 类型不受支持`)
                break
        }
    }

    const requestObject: IApi['requestObject'] = {
        /** header 参数 */
        header: parametersToJSONSchema7(mergedParameters.header),
        /** cookie 参数 */
        cookie: parametersToJSONSchema7(mergedParameters.cookie),
        /** params 参数 */
        params: parametersToJSONSchema7(mergedParameters.query),
        /** auth 鉴权 (一般接口不定义, 算是预留吧) */
        auth: auth,
        /** body 参数 */
        body: undefined
    }

    // fix: 解决 axios 类型限定不兼容问题
    if (requestObject.header) requestObject.header.additionalProperties = true

    if (detail.requestBody) {
        switch (detail.requestBody.type) {
            case 'none':
                break
            case 'multipart/form-data':
            case 'application/x-www-form-urlencoded':
                requestObject.body = {
                    type: detail.requestBody.type,
                    data: parametersToJSONSchema7(detail.requestBody.parameters)
                }
                break
            case 'application/json':
            case 'application/x-msgpack':
            case 'application/xml':
                requestObject.body = {
                    type: detail.requestBody.type,
                    data: mappingJSONSchemaRef(detail.requestBody.jsonSchema, schemas)
                }
                break

            case 'text/plain':
                requestObject.body = {
                    type: detail.requestBody.type,
                    data: {
                        type: 'string',
                        description: detail.requestBody.description,
                        default: detail.requestBody.example
                    }
                }
                break
            default:
                requestObject.body = {
                    type: detail.requestBody.type,
                    data: {
                        type: 'any' as any
                    }
                }
                break
        }
    }

    return requestObject
}

/** 转换响应对象 */
const transformResponseObject = (
    detail: IDetail,
    responseOnlySuccess: boolean,
    schemas: Array<ISchema>
): IApi['responseObject'] => {
    const { responses } = detail
    const responseObject: IApi['responseObject'] = []
    for (const resp of responses) {
        // ? 指定仅成功响应时, 应过滤失败结构的响应值格式
        if (responseOnlySuccess && Number(resp.code) >= 400) {
            continue
        }
        responseObject.push({
            statusCode: resp.code,
            statusName: resp.name,
            type: resp.contentType,
            data: mappingJSONSchemaRef(resp.jsonSchema, schemas)
        })
    }
    return responseObject
}

const transformToIApi = (opts: {
    projectId: string
    projectName: string
    project: ITransformOptions['']
    used: IConfig['apifox']['usage'][0]
    apis: Array<IUsedApiDetail>
    output: IConfig['output']
    removeDeprecatedApi: boolean
}): Array<IApi> => {
    const { projectId, projectName, project, used, apis, output, removeDeprecatedApi } = opts
    const { details, schemas, projectMembers } = project
    const { dir, responseOnlySuccess, language } = output
    const out: Array<IApi> = []

    for (const api of apis) {
        /** 输出到哪个文件 */
        let outFile!: IApi['outFile']
        /** 请求方式 */
        let method!: Method
        /** url */
        let url!: string
        /** 请求参数对象 */
        let requestObject!: IApi['requestObject']
        /** 响应值对象 (Array) */
        let responseObject!: IApi['responseObject']
        /** 注释信息 */
        let comment!: IApi['comment']
        /** 路径参数 */
        let pathParams!: IApi['pathParams']

        // 文件名 (全路径)
        let fn: string = used.map ?? used.name
        if (['.ts', '.js'].includes(np.extname(fn))) {
            fn = np.basename(fn, np.extname(fn))
        }
        fn += `.${language === 'ts' ? 'ts' : 'js'}`
        const id: number = Number(api.node.key.split('.')[1])
        const detail: IDetail = details.find((d) => d.id === id)

        // ? 如果 api 已标记废弃 或即将废弃, 那么跳过生成
        if (removeDeprecatedApi && ['deprecated', 'obsolete'].includes(detail.status)) {
            continue
        }

        const authors: Array<{ name: string }> = projectMembers
            .filter((m) => [detail.creatorId, detail.editorId, detail.responsibleId].includes(m.userId))
            .map((m) => {
                return { name: m.nickname }
            })

        outFile = {
            name: used.name,
            map: used.map ?? used.name,
            path: np.normalize(np.join(dir, fn)),
            project: [`[${projectName}](https://www.apifox.cn/web/project/${projectId})`]
        }
        method = detail.method.toLowerCase() as Method
        url = detail.path

        requestObject = transformRequestObject(detail, schemas, projectName)
        responseObject = transformResponseObject(detail, responseOnlySuccess, schemas)

        comment = {
            /** 接口名称 */
            name: detail.name,
            /** 上次更新时间 */
            updateAt: detail.updatedAt,
            /** 文件夹路径 (中文) */
            folder: '/' + api.paths.map((f) => f.name).join('/'),
            /** 描述信息 */
            desc: detail.description,
            /** 接口文档链接 */
            link: `https://app.apifox.com/link/project/${projectId}/apis/api-${id}`,
            /** 标签 */
            tags: detail.tags,
            /** 接口状态 */
            status: detail.status,
            /** 作者 */
            author: authors
        }

        if (/[\$]{0,1}\{.+?\}/.test(url)) {
            pathParams = url.match(/[\$]{0,1}\{(.+?)\}/g).map((s) => s.match(/[\$]{0,1}\{(.+?)\}/)[1])
            url = url.replace(/[\$]{0,1}\{(.+?)\}/, (_, $1) => '${' + $1 + '}')
        }

        // append
        out.push({ outFile, method, url, requestObject, responseObject, comment, pathParams })
    }
    return out
}

/** 转换接口原始信息为 IApi 格式 */
export const transform = (
    options: ITransformOptions,
    config: IConfig,
    projects: Array<{ id: number; name: string }>
): Array<IApi> => {
    let output: Array<IApi> = []

    for (const projectId in options) {
        const project = options[projectId]
        const projectName: string = projects.find((p) => Number(p.id) === Number(projectId))?.name
        const usage = config.apifox?.usage ?? []
        const removeDeprecatedApi: boolean = config.apifox.removeDeprecatedApi !== false
        for (const used of usage) {
            const otherUsed = usage.filter((u) => u !== used)
            const apis: Array<IUsedApiDetail> = filterUsedApi(project.treeList, used, otherUsed)
            output = output.concat(
                transformToIApi({
                    projectId,
                    projectName,
                    project,
                    used,
                    apis,
                    output: config.output,
                    removeDeprecatedApi
                })
            )
        }
    }
    return output
}
