import type { IApi } from '../../intf/IApi'

import { camelCase } from 'change-case'

import { RESEVED_KEYWORD_MAP } from '../data/reseved-keyword'
import { Method } from 'axios'

/** 裁剪获取url段落中最后一段 (非Restful api path部分)  */
const urlLastParagraph = (url: string): string | null => {
    const paragraphs: Array<string> = url.split('/')
    // > 从后向前获取url路径段中, 非Restful Api path 参数部分
    const paragraph: string | null = paragraphs.reverse().reduce((out: string | null, paragraph: string) => {
        if (out) return out
        if (/[\$]{0,1}\{.+?\}/.test(paragraph)) return null
        return paragraph
    }, null)
    return paragraph
}

/**
 * 裁剪超长路径段
 *
 * @description 约定规则: 当多段 url 中段落数(以 / 分隔)超过阈值时, 从后向前裁剪多余部分
 */
const splitLongNameByPath = (str: string, max: number): string => {
    const tmp: Array<string> = str.split('/')
    if (tmp.length > max) {
        return tmp.slice(tmp.length - max, tmp.length).join('/')
    } else {
        return str
    }
}

/**
 * 裁剪超长单词
 *
 * @description 约定规则: 在不破坏单个路径段的情况下, 根据单词数量匹配url, 当超过阈值时, 从后向前裁剪多余的部分
 */
const splitLongCamelCaseNameByPath = (str: string, max: number): string => {
    // 1. 按大写字符做分割符, 分割字符串
    const tmp: Array<string> = str.split('/')
    let count: number = 0
    let out = []
    for (let n = tmp.length - 1; n >= 0; n--) {
        if (count >= max) break
        const block: string = tmp[n]
        // ! 注意这里`非`匹配会多匹配一位, 计算时需减 1
        const matched = block.match(/(?![a-z0-9])/g)
        count += matched?.length ?? 0
        out.unshift(block)
    }
    return out.join('/')
}

/** 格式化接口命名后缀, 避免相同命名冲突 */
const formatNameSuffixByDuplicate = (name: string, duplicate: { [key: string]: number }): string => {
    if (!duplicate[name]) {
        duplicate[name] = 1
    } else {
        duplicate[name]++
    }
    if (duplicate[name] === 1) {
        return name
    } else {
        const newName: string = name + (duplicate[name] - 1)
        // ? 处理仍然重复的情况
        if (duplicate[newName]) {
            return formatNameSuffixByDuplicate(name, duplicate)
        } else {
            return newName
        }
    }
}

/** 格式化接口命名, 避免占用关键字 */
const formatNameByDisabledKeyword = (name: string, method: string): string => {
    try {
        // 校验关键字, 避免占用
        if (RESEVED_KEYWORD_MAP.includes(name)) throw new Error('占用了系统关键字')
        // ? 通过 `@typescript-eslint/typescript-estree` 解析进行二次检查, 避免关键字遗漏
        // ! 2023年7月7日 这里保留这段复杂校验逻辑, 如果后面有需要再添加进来, 现在这个工具依赖的库已经够多了
        // parse(`const ${name} = () => {}`)
        return name
    } catch (error) {
        return camelCase(method + '_' + name)
    }
}

/** 判断 apis 列表中, 最后一段url是否包含单个单词, 或重复项, 如果不包含, 那么执行快速命名  */
const checkApisHasSingleWordOrDuplicatedName = (apis: Array<IApi>): boolean => {
    let names: Set<string> = new Set()
    let paragraph: string | null
    for (let api of apis) {
        // > 从后向前获取url路径段中, 非Restful Api path 参数部分
        paragraph = urlLastParagraph(api.url)

        if (!paragraph) continue

        // ? 判断 set 中是否包含相同的url段落, 或这不存在多个单词 (没有大写单词或 - 分割符)
        if (names.has(paragraph) || !/[A-Z-]/.test(paragraph)) {
            return true
        }

        names.add(paragraph)
    }
    return false
}

/** 清理路径中的 restful 参数 */
const clearRestfulPathParams = (str: string, method: Method): string => {
    const matched: Array<string> | null = str.match(/[\$]{0,1}\{.+?\}/g)
    // TIPS: 针对单个参数的 Restful api, 且非 get/post 方式的情况下, 用方法名替代原参数进行填充
    if (matched?.length === 1 && !['get', 'post'].includes(method.toLowerCase())) {
        return str.replace(/[\$]{0,1}\{.+?\}/g, `_${method.toLowerCase()}`)
    } else {
        return str.replace(/[\$]{0,1}\{.+?\}/g, '')
    }
}

/** 创建接口方法名的工厂方法 */
export const createFunctionNameFactory = (apis: Array<IApi>) => {
    // @ 定义用于记录重复命名的 方法名, 参数接口名, 响应接口名
    const duplicate: { [key: string]: number } = {}

    // @ 尾端url是否重复
    const repeatedUrlTail: boolean = checkApisHasSingleWordOrDuplicatedName(apis)

    return {
        /**
         * 生成接口方法名
         *
         * @param api api接口
         */
        generate(api: IApi): string {
            const { method, url } = api
            // 根据如下步骤, 生成接口方法名
            return [
                // 1. (预处理) 当尾段url不重复时, 生成更简短的命名
                (str: string) => (!repeatedUrlTail ? urlLastParagraph(str) ?? str : str),
                // 2. (预处理) 移除路径中的 Restful Api 参数
                (str: string) => clearRestfulPathParams(str, method),
                // 3. (预处理) 裁剪超长路径名
                (str: string) => splitLongNameByPath(str, 3),
                // 4. (预处理) 裁剪接口命名词汇超过3个单词的命名
                (str: string) => splitLongCamelCaseNameByPath(str, 3),
                // 5. 删除路径中的起始斜杠(/)
                (str: string) => str.replace(/^[\/]+/g, ''),
                // 6. 将 Relative Path 的分隔符(/) 转化为下划线
                (str: string) => str.replace(/[\/]+/g, '_'),
                // 7. 转换为驼峰格式命名
                (str: string) => camelCase(str),
                // 8. (后处理) 处理路径命名的Js关键词占用
                (str: string) => formatNameByDisabledKeyword(str, method),
                // 9. (后处理) 重复接口路径处理
                (str: string) => formatNameSuffixByDuplicate(str, duplicate)
            ].reduce((name: string, format) => format(name), url)
        }
    }
}
