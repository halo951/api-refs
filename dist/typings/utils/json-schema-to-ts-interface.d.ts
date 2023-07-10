import type { JSONSchema7 } from 'json-schema';
/** 将 jsonSchema 转化成 接口代码 */
export declare const jsonSchemaToTsInterface: (jsonSchema: JSONSchema7, typeName: string) => Promise<string>;
