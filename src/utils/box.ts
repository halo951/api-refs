import chalk from 'chalk'
import stringWidth from 'string-width'

export interface Options {
    /** 文字颜色
     *
     * @default #ffffff
     */
    color?: string

    /** 边框颜色 */
    borderColor?: string
}
const COLOR: string = '#ffffff'
const MARGIN: number = 14

/** 生成盒子 */
const makeBox = (max: number): [string, string] => {
    const line: string = new Array(max + MARGIN).fill('─').join('')
    return [`┌${line}┐`, `└${line}┘`]
}

/** 生成内容 */
const makeContent = (rows: Array<{ text: string; width: number }>, max: number, options: Options): Array<string> => {
    return rows.map(({ text, width }): string => {
        const padding: number = Math.ceil((max + MARGIN - width) / 2)
        const space: string = new Array(padding).fill(' ').join('')
        return `│${space}${chalk.hex(options.color ?? COLOR)(text)}${space}│`
    })
}

export const box = (text: string, options: string | Options) => {
    options = typeof options === 'string' ? { color: options } : options
    // 1. 根据换行符裁切字符串
    const lines: Array<string> = text.split(/\n/g)
    // 2. 计算字符串长度
    const rows: Array<{ text: string; width: number }> = lines.map((text: string) => {
        return { text, width: stringWidth(text) }
    })
    // 3. 取最大值生成盒子
    const max: number = rows.reduce((max: number, row: { width: number }) => {
        return max > row.width ? max : row.width
    }, 0)
    const [start, end] = makeBox(max)
    // 4. 生成内容
    let content: Array<string> = makeContent(rows, max, options)
    // 5. output
    return chalk.hex(options.borderColor ?? options.color ?? COLOR)([start, ...content, end].join('\n'))
}
