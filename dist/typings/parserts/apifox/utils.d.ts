import type { JSONSchema7 } from 'json-schema';
import type { ISchema, IParameters } from './intf';
/** 对象数组合并, 并根据指定条件去重 */
export declare const mergeArray: <T>(origin: T[][], isDeduped: (a: T, b: T) => boolean) => T[];
/** 将 参数格式转化成 JSONSchema7 格式 */
export declare const parametersToJSONSchema7: (params: Array<Omit<IParameters, 'id' | 'enable'>>) => JSONSchema7 | undefined;
/** 映射 JSONSchemaRef 引用 */
export declare const mappingJSONSchemaRef: (schema: JSONSchema7, refs: Array<ISchema>) => JSONSchema7;
