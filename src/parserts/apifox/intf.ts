import type { HttpStatusCode, Method } from 'axios'
import type { JSONSchema7 } from 'json-schema'

export type IApiDetail = {
    key: string
    type: 'apiDetail'
    name: string
    api: any
}
export type IApiDetailFolder = {
    key: string
    type: 'apiDetailFolder'
    name: string
    children: Array<ITree>
    folder: { docId: number; id: number; name: string; parentId: number; type: 'http' }
}

export interface IUsedApiDetail {
    node: IApiDetail
    paths: Array<IApiDetailFolder>
}

export type ITree = IApiDetail | IApiDetailFolder

export type IParameters = {
    id: string
    name: string
    required: boolean
    description: string
    type: 'string' | 'number' | 'array'
    enable: boolean
    example?: string
}

export type IDetail = {
    id: number
    name: string
    type: 'http'
    serverId: string
    preProcessors: Array<unknown>
    postProcessors: Array<unknown>
    inheritPreProcessors: unknown
    inheritPostProcessors: unknown
    description: string
    operationId: string
    sourceUrl: string
    method: Method
    path: string
    tags: Array<string>
    status: 'developing' | 'testing' | 'released' | 'deprecated' | 'obsolete' | 'unknown' | string
    parameters: {
        path: Array<IParameters>
        query: Array<IParameters>
        cookie: Array<IParameters>
        header: Array<IParameters>
    }

    commonParameters: {
        path: Array<IParameters>
        query: Array<IParameters>
        cookie: Array<IParameters>
        header: Array<IParameters>
    }

    requestBody:
        | {
              type: 'multipart/form-data' | 'application/x-www-form-urlencoded'
              parameters: Array<IParameters>
          }
        | {
              type: 'application/json' | 'application/x-msgpack' | 'application/xml'
              parameters: Array<IParameters>
              jsonSchema: {
                  [key: string]: JSONSchema7
              }
          }
        | {
              type: 'text/plain'
              description: string
              example: string
          }
        | {
              type: 'graphql'
          }
        | {
              type: 'none'
          }

    responses: Array<{
        apiDetailId: number
        code: typeof HttpStatusCode
        contentType:
            | 'json' // json 格式
            | 'xml' // xml 格式
            | 'raw' // 文本格式
            | 'html' // html 格式
            | 'binary' // 文件类型
        createdAt: string
        defaultEnable: boolean
        deletedAt: null
        id: number
        jsonSchema: JSONSchema7
        name: string
        projectId: number
        updatedAt: string
    }>
    responseExamples: Array<unknown>
    codeSamples: Array<unknown>
    auth:
        | { type: 'noauth' }
        | { type: 'apikey'; apikey: { in: 'header' | 'query'; key: string; value: string } }
        | { type: 'bearer'; bearer: { token: string } }
        | { type: 'basic'; basic: { username: string; password: string } }
        | any
    projectId: number
    folderId: number
    ordering: number
    responsibleId: number
    commonResponseStatus: unknown
    advancedSettings: unknown
    customApiFields: unknown
    mockScript: unknown
    createdAt: string
    updatedAt: string
    deletedAt: string
    creatorId: number
    editorId: number
}

export type ISchema = any

export type IProjectMember = {
    nickname: string
    id: number
    projectId: number
    teamId: number
    userId: number
    roleType: number
    createdAt: string
    updatedAt: string
}

export type IResponse = {
    jsonSchema: JSONSchema7
    defaultEnable: boolean
    id: number
    name: string
    apiDetailId: number
    projectId: number
    code: number
    contentType: 'json'
    ordering: 0
    createdAt: string
    updatedAt: string | null
    deletedAt: string | null
}
export interface ITransformOptions {
    /** 项目Id */
    [projectId: string]: {
        /** 结构树 */
        treeList: Array<ITree>
        /** 接口详情 */
        details: Array<IDetail>
        /** schema 协议 */
        schemas: Array<ISchema>
        /** 项目成员 */
        projectMembers: Array<IProjectMember>
    }
}
