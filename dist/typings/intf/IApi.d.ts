import { Method, HttpStatusCode } from 'axios';
import { JSONSchema7 } from 'json-schema';
export type IRequestParamType<T = 'string' | 'number' | 'array'> = {
    /** 参数名 */
    name: string;
    /** 描述/description/备注 */
    desc?: string;
    /** 参数类型 */
    type: T;
    /** 是否必填 */
    required: boolean;
    /** 默认值 */
    default: unknown;
};
/** 接口信息 */
export interface IApi {
    /** 输出到哪个文件 */
    outFile: {
        /** 文件夹名 */
        name: string;
        /** 映射文件名 */
        map: string;
        /** 输出文件目录 */
        path: string;
        /** 包含哪些项目下的接口 */
        project: Array<string>;
    };
    /** 请求方式 */
    method: Method;
    /** url */
    url: string;
    /**
     * 请求参数对象
     *
     * @description 生成逻辑:
     *  - `method:get` && `仅包含params` 时: 生成 `req.get('/', {})` 格式
     *  - `method:post` && `仅包含 body` 时, 生成 `req.post('/', {})` 格式
     *  - 其他情况下, 使用 `req({ ... })` 格式生成
     *  - 如果同时存在, params, body 时, 参数格式采用 `{ params: {}, data: {}}` 格式
     */
    requestObject: {
        /**
         * header 参数
         *
         * @description 如果某个接口的`Content-Type` 与 其他接口不一致, 那么这个接口应该在header中指明包含此属性
         */
        header?: JSONSchema7;
        /**
         * cookie 参数
         *
         * @description
         *  - 生成时, 将合并到 header 中生成.
         */
        cookie?: JSONSchema7;
        /** params 参数 */
        params?: JSONSchema7;
        /** body 参数 */
        body?: {
            type: 'multipart/form-data' | 'application/x-www-form-urlencoded' | 'application/json' | 'application/x-msgpack' | 'text/plain' | string;
            /** 请求对象列表 */
            data?: JSONSchema7;
        };
        /** auth 鉴权 (一般接口不定义, 算是预留吧) */
        auth?: {
            username: string;
            password: string;
        };
    };
    /**
     * 响应值对象 (Array)
     *
     * @description 如果包含了 base 属性, 则将 base 属性映射到当前响应对象下.
     */
    responseObject: Array<{
        /** 响应状态码 */
        statusCode: typeof HttpStatusCode;
        /** 名称 (响应描述) */
        statusName?: string;
        /**
         * 数据格式
         *
         * @description 'xml' | 'raw' | 'html' 响应值类型为 `string (文本)`, binary 则 return void (提示用户在请求工具中实现文件下载功能)
         */
        type: 'json' | 'xml' | 'raw' | 'html' | 'binary';
        /** 响应数据结构 */
        data?: JSONSchema7;
    }>;
    /** 注释信息 */
    comment: {
        /** 接口名称 */
        name: string;
        /** 上次更新时间 */
        updateAt: string;
        /** 文件夹路径 */
        folder?: string;
        /** 描述信息 */
        desc?: string;
        /** 文档链接 */
        link?: string;
        /** 标签 */
        tags?: Array<string>;
        /** 作者 */
        author: Array<{
            name?: string;
            email?: string;
        }>;
        /** 接口状态 */
        status: 'developing' | 'testing' | 'released' | 'deprecated' | 'unknown' | string;
    };
    /**
     * 是否包含路径参数
     *
     * @description 包含时, 附加解构逻辑
     */
    pathParams: Array<string> | false;
}
