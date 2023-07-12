import type { JSONSchema4, JSONSchema7, JSONSchema7Definition } from 'json-schema'
import type { Options as JSONSchemaToTypescriptOptions } from 'json-schema-to-typescript'

import { compile } from 'json-schema-to-typescript'

import prettierConfig from './prettier.config'

const JSONSchemaGenerateOptions: Partial<JSONSchemaToTypescriptOptions> = {
    additionalProperties: false,
    bannerComment: '',
    declareExternallyReferenced: true,
    enableConstEnums: false,
    maxItems: -1,
    strictIndexSignatures: true,
    unreachableDefinitions: false,
    unknownAny: false,
    style: prettierConfig
}

const deepFix = (jsonSchema: JSONSchema7, transform: (schema: JSONSchema7) => void): void => {
    const deep = (schema?: JSONSchema7 | JSONSchema7Definition) => {
        if (!schema || typeof schema === 'boolean') return
        transform(schema)
        // deep
        switch (schema.type) {
            case 'object':
                for (const key in schema.properties) {
                    const property = schema.properties[key]
                    deep(property)
                }
                break
            case 'array':
                for (const item of schema.items instanceof Array ? schema.items : [schema.items]) {
                    deep(item)
                }
                break
            default:
                break
        }
    }
    deep(jsonSchema)
}

/** 将 jsonSchema 转化成 接口代码 */
export const jsonSchemaToTsInterface = (jsonSchema: JSONSchema7, typeName: string): Promise<string> => {
    // Tips: 删除 schema 中的 title 属性, 处理 `json-schema-to-typescript` 生成时, 解析类型出错问题
    deepFix(jsonSchema, (schema: JSONSchema7): void => {
        if (!!schema.description) {
            schema.description += `\n\n`
        } else {
            schema.description = ''
        }
        if (schema.title) {
            schema.description += `@name ${schema.title}\n`
            delete schema.title
        }

        if (schema.pattern) {
            schema.description += `@pattern /${schema.pattern}/\n`
            delete schema.pattern
        }

        if (schema.default) {
            schema.description += `@default ${schema.default}\n`
            delete schema.default
        }
        if (schema.examples) {
            schema.description += `@examples ${schema.examples}\n`
            delete schema.examples
        }
        schema.description = schema.description.trim()
    })
    // 生成 params 参数接口
    return compile(jsonSchema as unknown as JSONSchema4, typeName, JSONSchemaGenerateOptions)
}
