/** api-refs 工具生成器配置 */
export interface IConfig {
    /**
     * schema 协议路径
     *
     * @default node_modules/api-refs/api-refs.schema.json
     */
    $schema: string

    /**
     * api-refs 工具版本
     */
    version: string

    /**
     * 指定接口文档数据源
     */
    datasource: TDatasource

    /**
     * apifox 数据源配置 (当 datasource 值为 apifox 时, 此配置为必填选项)
     */
    apifox?: IApifoxDatasource

    /**
     * 输出配置
     */
    output?: {
        /**
         * 语言模板
         *
         * @default ts
         */
        language: TLanguage

        /**
         * 导出目录
         *
         * @default ./src/apis/
         */
        dir: string

        /**
         * 是否清理历史文件
         *
         * @default false
         */
        clear?: boolean

        /**
         * 是否添加 index file 公共导出
         *
         * @default true
         */
        appendIndex?: boolean

        /**
         * 是否启用严格模式, 严格模式下, 不允许出现重复的接口定义
         *
         * @default false
         */
        strict?: boolean

        /**
         * 当出现多种响应结果类型时, 是否仅生成响应成功类型 (条件: code < 400)
         *
         * @default false
         */
        responseOnlySuccess?: boolean

        /**
         * 请求工具导入语句 (需要满足 IRequest 接口, 即具备 axios / fetch api 特性)
         *
         * @default import request from '@/utils/request'
         */
        applyImportStatements?: string

        /**
         * 是否导出 commonjs 格式文件
         *
         * @default false
         */
        cjs?: boolean
    }

    /**
     * 调试: 是否打印生成结果的统计信息
     *
     * @default true
     */
    showTotal?: boolean
}

/** (apifox) 缓存目录集合, 用于校验接口文档变化 */
export interface IApifoxCatalog {
    /** 接口文件夹 id 标识 */
    id: number
    /** 接口文件夹名称 (原始文件夹名称, 与apifox一致) */
    name: string
    /** 子目录 */
    children?: Array<IApifoxCatalog>
}

/** (apifox) 参与生成的目录配置 */
export interface IApifoxUsage {
    /** 接口文件夹 id 标识 */
    id: number
    /** 接口文件夹名称 (原始文件夹名称, 与apifox一致) */
    name: string
    /** 目录映射文件名 */
    map?: string
    /** 是否关联当前文件夹下所有的子文件夹 */
    relate?: boolean
}

/** apifox 数据源配置 */
interface IApifoxDatasource {
    /**
     *  @description 登录态 token (关联 apifox 接口信息, 用于隐式访问 apifox api)
     */
    accessToken?: string
    /**
     * @description 哪些项目下的接口参与生成 (注: 允许多个)
     */
    project?: { id: number; name: string } | Array<{ id: number; name: string }>

    /**
     * @description 原始接口列表数据集合, 用于校验选择的项目、接口是否发生过变化, 如果发生了变化, 那么需要提示用户更新引用.
     * @default []
     */
    catalog?: Array<IApifoxCatalog>

    /**
     * @description 指示哪些接口文件夹参与生成
     * @default []
     */
    usage?: Array<IApifoxUsage>

    /**
     * @description 是否移除已废弃的 api
     * @default true
     */
    removeDeprecatedApi?: boolean
}

export type TDatasource = 'apifox'
export type TLanguage = 'ts' | 'js' | 'only-js'
