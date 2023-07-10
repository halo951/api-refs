import chalk from 'chalk'
import { stdout } from 'single-line-log'

/** command loading util */
export default class CommandLoadingUtil {
    str: Array<string> = ['█', '▇', '▆', '▅', '▄', '▃', '▂', '▁', '▂', '▃', '▄', '▅', '▇'].map((s) => {
        return chalk.hex('#409EFF')(s)
    })

    suffix: string = '加载中...'

    duration: number = 120

    timer!: NodeJS.Timer

    n: number = 0

    /** 显示 */
    show(): void {
        this.timer = setInterval(() => this.render(), this.duration)
    }

    /** 销毁 */
    destory(): void {
        stdout('')
        clearInterval(this.timer)
    }

    /** 渲染到命令行 */
    render(): void {
        const index: number = this.n % this.str.length
        const out: string = `${this.str[index]}  ${this.suffix}`
        // > output
        stdout(out)
        this.n++
    }
}

/** 执行包含loading过程的异步任务 */
export const asyncLoadingTask = async <T>(task: Promise<T>, message?: string): Promise<T> => {
    const util: CommandLoadingUtil = new CommandLoadingUtil()
    util.suffix = message ?? util.suffix
    try {
        util.show()
        return await task
    } finally {
        util.destory()
    }
}
