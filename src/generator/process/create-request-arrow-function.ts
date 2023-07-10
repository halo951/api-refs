import type { IApi } from '../../intf/IApi'
import type { JSONSchema7 } from 'json-schema'
import type { IConfig } from '../../intf/IConfig'

import { pascalCase } from 'change-case'
import { jsonSchemaToTsInterface } from '../../utils/json-schema-to-ts-interface'

/** 创建接口名 */
const createIntfName = (functionName: string, intfType: string, index: number = 0): string => {
    return `I${pascalCase(functionName)}${pascalCase(intfType)}${index > 0 ? index : ''}`
}

/** 创建注释 */
const createComment = (comment: Array<string | [string, string]>): string => {
    let description: Array<string> = []
    for (const c of comment) {
        if (c === undefined) continue
        if (typeof c === 'string') description.push(c)
        else description.push(`@${c[0]} ${c[1]}`)
    }
    return description.join('\n')
}

/** 向 schema 添加注释 */
const appendComment = (schema: JSONSchema7, comment: Array<string | [string, string]>): void => {
    schema.description = createComment(comment)
}

/**
 * 创建参数接口
 * @param api 接口
 * @param functionName 方法名
 * @returns
 */
const createFunctionParamsIntf = async (
    api: IApi,
    functionName: string
): Promise<{ code: Array<string>; refs: Array<{ key: string; intf: string }> }> => {
    // 生成的代码
    const code: Array<string> = []
    // 名称, 类型引用
    const refs: Array<{ key: string; intf: string }> = []
    if (api.requestObject.params) {
        appendComment(api.requestObject.params, [
            `request params | ${api.comment.name}`,
            '',
            ['function', functionName],
            api.pathParams ? ['description', '存在 url path params'] : undefined
        ])
        const intf: string = createIntfName(functionName, 'params')
        const params: string = await jsonSchemaToTsInterface(api.requestObject.params, intf)
        code.push(params)
        refs.push({ key: 'params', intf })
    }
    if (api.requestObject.body) {
        appendComment(api.requestObject.body.data, [
            `request body | ${api.comment.name}`,
            '',
            ['function', functionName],
            ['ContentType', api.requestObject.body.type]
        ])
        const intf: string = createIntfName(functionName, 'data')
        const data: string = await jsonSchemaToTsInterface(api.requestObject.body.data, intf)
        code.push(data)
        refs.push({ key: 'data', intf })
    }
    if (api.requestObject.header) {
        appendComment(api.requestObject.body.data, [
            `request header | ${api.comment.name}`,
            '',
            ['function', functionName]
        ])
        const intf: string = createIntfName(functionName, 'header')
        const headers: string = await jsonSchemaToTsInterface(api.requestObject.header, intf)
        code.push(headers)
        refs.push({ key: 'headers', intf })
    }
    if (api.requestObject.cookie) {
        appendComment(api.requestObject.cookie, [
            `request cookie | ${api.comment.name}`,
            '',
            ['function', functionName]
        ])
        const intf: string = createIntfName(functionName, 'cookie')
        const cookie: string = await jsonSchemaToTsInterface(api.requestObject.cookie, intf)
        code.push(cookie)
        refs.push({ key: 'cookie', intf })
    }
    if (api.requestObject.auth) {
        code.push(`export type IAuth = { username: string; password: string }`)
        refs.push({ key: 'auth', intf: 'IAuth' })
    }
    return { code, refs }
}

/** 创建响应接口 */
const createFunctionResponseInterface = async (
    api: IApi,
    functionName: string,
    config: IConfig
): Promise<{ code: Array<string>; refs: Array<string> }> => {
    // 生成的代码
    const code: Array<string> = []
    // 类型引用
    const refs: Array<string> = []
    const ro = api.responseObject ?? []
    for (let n = 0, len = ro.length; n < len; n++) {
        const { statusCode, statusName, type, data } = ro[n]
        if (config.output.responseOnlySuccess && Number(statusCode) >= 400) {
            continue
        }
        if (type !== 'json') {
            continue
        }
        appendComment(data, [
            `response | ${api.comment.name}`,
            '',
            ['function', functionName],
            ['status', `(${statusCode}) ${statusName}`],
            ['responseType', type]
        ])
        const intf: string = createIntfName(functionName, 'response', n)
        const response = await jsonSchemaToTsInterface(data, intf)
        code.push(response)
        refs.push(intf)
    }
    for (const { type } of ro) {
        switch (type) {
            case 'binary':
                refs.push('void')
                break
            case 'xml':
            case 'raw':
            case 'html':
                refs.push('string')
                break
            default:
                break
        }
    }
    return { code, refs }
}

/** 创建方法注释 */
const createFunctionComment = (api: IApi): string => {
    const authors = api.comment.author
        .map((a) => {
            if (a.name && a.email) return `${a.name} <${a.email}>`
            return a.name ?? a.email
        })
        .join(' ')

    let functionComment: string = [
        api.comment.name,
        '',
        ['link', api.comment.link],
        ['description', api.comment.desc],
        ['tags', api.comment.tags?.join('、 ')],
        ['updateAt', api.comment.updateAt],
        ['author', authors]
    ]
        .filter((c) => !(c instanceof Array) || (!!c[1] && c[1] !== ''))
        .map((c) => ` * ${c instanceof Array ? `@${c[0]} ${c[1]}` : c}`)
        .join('\n')
    functionComment = `/** \n${functionComment}\n */`
    return functionComment
}

/** 转换方法体引用代码 */
const transformFunctionParamsRefCode = (paramsRefs: Array<{ key: string; intf: string }>) => {
    let paramsRefCode: string = ``
    let deconstructExpression: string = ``
    if (paramsRefs.length > 2) {
        paramsRefCode = `options: {
            ${paramsRefs.map(({ key, intf }) => `${key}: ${intf}`).join('; \n')}
        }`
        deconstructExpression = `const { ${paramsRefs.map((ref) => ref.key).join(', ')} } = options`
    } else {
        paramsRefCode = paramsRefs.map(({ key, intf }) => `${key}: ${intf}`).join(', ')
    }
    return { paramsRefCode, deconstructExpression }
}

/** 如果包含 cookie 参数, 则应解析到header中 */
const parseHeader = (paramsRefs: Array<{ key: string; intf: string }>, customContentType?: string): string | null => {
    const hasCookie: boolean = paramsRefs.some((ref) => ref.key === 'cookie')
    const hasHeaders: boolean = paramsRefs.some((ref) => ref.key === 'headers')
    const kv: Array<[string, string]> = []
    const res: Array<string> = []
    if (hasCookie) {
        res.push(`const cookieHeader: string = cookieToHeaderValue(cookie)`)
        kv.push(['Cookie', 'cookieHeader'])
    }
    if (customContentType) {
        kv.push(['Content-Type', `'${customContentType}'`])
    }
    if (kv.length) {
        if (!hasHeaders) {
            res.push(`const headers: { [key:string]: any } = {}`)
        }
        for (const [key, value] of kv) res.push(`headers['${key}'] = ${value}`)
    }
    return res.length ? res.join('\n') : null
}

/** 解析路径参数, 并添加参数解构表达式 */
const parsePathParams = (api: IApi): string | undefined => {
    if (api.pathParams) {
        return `const { ${api.pathParams.join(', ')} } = params`
    }
    return
}

/** 解析请求参数 */
const parseRequestOptions = (api: IApi, paramsRefs: Array<{ key: string; intf: string }>): Array<string> => {
    const options: Array<string> = []
    if (api.method) options.push(`method: '${api.method.toUpperCase()}'`)
    if (api.url) {
        if (api.pathParams) {
            options.push(`url: \`${api.url}\``)
        } else {
            options.push(`url: '${api.url}'`)
        }
    }
    for (const { key } of paramsRefs) {
        if (key === 'cookie') continue
        options.push(key)
    }
    return options
}
/** 创建方法体代码 */
const createFunctionCode = (
    api: IApi,
    functionName: string,
    requestUtil: string,
    paramsRefs: Array<{ key: string; intf: string }>,
    responseRef: Array<string>,
    defaultContentType: string
): string => {
    // @ 判断是否需要注入当前方法的 content-type
    const customContentType: string | undefined =
        api.requestObject.body?.type !== defaultContentType ? api.requestObject.body?.type : undefined
    // @ 生成方法头注释
    const functionComment: string = createFunctionComment(api)
    // @ 生成方法参数引用
    const { paramsRefCode, deconstructExpression } = transformFunctionParamsRefCode(paramsRefs)
    // @ 生成返回值引用
    const resultRefCode: string = `Promise<${responseRef.join(' | ')}>`
    // @ 生成方法前置代码
    const prefixCode: Array<string> = [
        deconstructExpression,
        parsePathParams(api),
        parseHeader(paramsRefs, customContentType)
    ]
        // filter null value
        .filter((c) => !!c)
    if (customContentType && !paramsRefs.some((ref) => ref.key === 'headers')) {
        paramsRefs.push({ key: 'headers', intf: `{ key: string }: any` })
    }
    // @ 生成方法请求参数
    const requestOptionsCode: Array<string> = parseRequestOptions(api, paramsRefs)

    // @ 生成方法返回值引用
    const functionCode: string = `
    ${functionComment}
    export const ${functionName} = (${paramsRefCode}): ${resultRefCode} => {
        ${prefixCode.join('\n')}
        return ${requestUtil}({
            ${requestOptionsCode.join(', \n')}
        })
    }
    `.trim()
    return functionCode
}

export const createRequestArrowFunction = async (opt: {
    /** 方法名 */
    functionName: string
    /** 请求工具 */
    requestUtil: string
    /** 默认的 content-type 属性 */
    defaultContentType: string
    /** api 接口 */
    api: IApi
    /** 配置 */
    config: IConfig
}): Promise<string> => {
    const { functionName, requestUtil, api, config, defaultContentType } = opt

    // @ 生成方法参数接口
    const { code: paramsIntfCode, refs: paramsRefs } = await createFunctionParamsIntf(api, functionName)
    // @ 生成方法响应接口
    const { code: responseIntfCode, refs: responseRef } = await createFunctionResponseInterface(
        api,
        functionName,
        config
    )
    // @ 生成方法体
    const functionCode: string = createFunctionCode(
        api,
        functionName,
        requestUtil,
        paramsRefs,
        responseRef,
        defaultContentType
    )
    // > 拼接 & 返回
    return [...paramsIntfCode, ...responseIntfCode, functionCode].filter((line) => line && line !== '').join('\n')
}
