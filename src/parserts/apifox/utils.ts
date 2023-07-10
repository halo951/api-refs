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
export const parametersToJSONSchema7 = (params: Array<Omit<IParameters, 'id' | 'enable'>>): JSONSchema7 | undefined => {
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
            default: example
        }
        if (required) {
            schema.required.push(name)
        }
    }
    return schema
}

/** 映射 JSONSchemaRef 引用 */
export const mappingJSONSchemaRef = (schema: JSONSchema7, refs: Array<ISchema>): JSONSchema7 => {
    if (!schema.definitions) schema.definitions = {}
    for (const { id, jsonSchema } of refs) {
        schema.definitions[id] = jsonSchema
    }
    return schema
}
