import type { JSONSchema7 } from 'json-schema'
import type { ISchema, IParameters } from './intf'

/** 对象数组合并, 并根据指定条件去重 */
export const mergeArray = <T>(origin: Array<Array<T>>, isDeduped: (a: T, b: T) => boolean): Array<T> => {
    let output: Array<T> = []
    for (const arr of origin) {
        for (const n of arr ?? []) {
            if (!output.some((o) => isDeduped(o, n))) {
                output.push(n)
            }
        }
    }
    return output
}

/** 将 参数格式转化成 JSONSchema7 格式 */
export const parametersToJSONSchema7 = (
    params: Array<Omit<IParameters, 'id' | 'enable'>>,
    options: {
        /** 是否跳过空示例值
         *
         * @description apifox 的 application/x-www-form-urlencoded 表单数据结构, 默认会给出来一个空的 example 属性, 此时会导致后续的生成出错. 需要通过变量控制保持同步
         */
        skipNullExample?: boolean
    } = {}
): JSONSchema7 | undefined => {
    const schema: JSONSchema7 = {
        type: 'object',
        properties: {},
        required: []
    }
    if (!params?.length) return undefined
    for (const { name, type, description, example, required } of params) {
        schema.properties[name] = {
            type: type,
            description: description,
            default: options.skipNullExample && example === '' ? undefined : example
        }
        if (required) {
            schema.required.push(name)
        }
    }
    return schema
}

/** 映射 JSONSchemaRef 引用 */
export const mappingJSONSchemaRef = (schema: JSONSchema7, refs: Array<ISchema>): JSONSchema7 => {
    if (!schema) return {}
    if (!schema.definitions) schema.definitions = {}
    // 映射整个对象都是引用的
    if (schema.$ref) {
        const refId: string = schema.$ref.split('/').pop()
        const { jsonSchema } = refs.find((ref) => ref.id.toString() === refId)
        Object.assign(schema, jsonSchema)
        delete schema.$ref
    }

    for (const { id, name, jsonSchema } of refs) {
        jsonSchema.title = name
        schema.definitions[id] = jsonSchema
    }

    return schema
}
