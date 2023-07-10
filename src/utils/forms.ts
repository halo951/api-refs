import chalk from 'chalk'
import Enquirer from 'enquirer-esm'

import { point } from './point'

export const enquirer = new Enquirer<any>()

enquirer.use((vm: typeof enquirer) => {
    vm.on('keypress', () => {})
    // if user input 'ctrl + c', then exit current process.
    vm.on('cancel', () => process.exit(200))
})

export const createMessage = (msg: string): (() => string) => {
    return function (this: any) {
        if (this?.state?.status === 'submitted') {
            return chalk.gray(msg)
        } else {
            return msg
        }
    }
}

interface ITaskRunner<T, E> {
    /** step1. 输入 */
    input: () => Promise<E>
    /** step2. (可选) 执行 */
    exec?: (form: E) => T | Promise<T>
    max?: number
    maxErrorMessage?: string
}

/**
 * 创建输入任务执行工具
 *
 * @description 避免 `enquirer` 单次输入失败导致程序中断
 */
export const createInputTask = async <T, E>(opt: ITaskRunner<T, E>): Promise<T> => {
    const { input, exec, max, maxErrorMessage } = opt
    let form: any
    let res: T
    for (let n = 0; n < (max ?? 3); n++) {
        try {
            form = await input()
            if (!exec) return form
            res = await exec(form)
            return res
        } catch (error) {
            if (n + 1 !== (max ?? 3)) point.warn((error as Error).message)
        }
    }
    throw new Error(maxErrorMessage ?? '失败次数过多, 脚本退出')
}

/** 输入文本 */
export const inputText = async <T = string>(message: string, initial?: T): Promise<T> => {
    return await createInputTask({
        input: async () => {
            const { text } = await enquirer.prompt({
                type: 'text',
                name: 'text',
                message: createMessage(message),
                initial
            })

            return text
        }
    })
}

/** 输入 boolean 值 */
export const inputBoolean = async <T = boolean>(message: string, initial?: T): Promise<T> => {
    return await createInputTask({
        input: async () => {
            const { text } = await enquirer.prompt({
                type: 'confirm',
                name: 'text',
                message: createMessage(message),
                initial
            })
            return text
        }
    })
}

/** 输入 number 值 */
export const inputNumber = async <T = number>(message: string, initial?: T): Promise<T> => {
    return await createInputTask({
        input: async () => {
            const { text } = await enquirer.prompt({
                type: 'snippet',
                name: 'text',
                message: createMessage(message),
                initial,
                validate(value) {
                    return !isNaN(Number(value))
                }
            })
            return Number(text)
        }
    })
}

/** 输入可选值 */
export const inputSelect = async <T = string>(message: string, choices: Array<T>, initial?: T): Promise<T> => {
    return await createInputTask({
        input: async () => {
            const { text } = await enquirer.prompt({
                type: 'select',
                name: 'text',
                message: createMessage(message),
                initial,
                choices
            } as any)
            return text
        }
    })
}

/** 多行表单输入 (文件名) */
export const inputMultiFileNameForm = async (
    message: string,
    form: Array<{ name: any; message: string }>
): Promise<{ [key: string]: string }> => {
    return await createInputTask({
        input: async () => {
            const { text } = await enquirer.prompt({
                type: 'form',
                name: 'text',
                message: createMessage(message),
                choices: form,
                validate(value: any) {
                    // 文件名校验策略
                    const failed = Object.entries(value).reduce((fail, [k, v]) => {
                        const name: string = form.find((item) => item.name.toString() === k)?.message ?? k
                        const val: string = `${v}`
                        if (val.trim() === '') {
                            fail.push([name, '缺少必填项'].join(': '))
                        } else if (/^\.|[\\\\/:*?\"<>|]/gim.test(val)) {
                            fail.push([name, `'${v}' 文件命名不符合命名规则`].join(': '))
                        }
                        return fail
                    }, [] as Array<string>)

                    if (failed.length) {
                        return [`🚧 校验失败`, chalk.yellow(failed.join('\n'))].join('\n')
                    }
                    return true
                }
            })
            for (const key in text) {
                if (!text[key] || text[key] === '') {
                    text[key] = form.find((f) => f.name === key)?.message
                }
            }
            return text
        }
    })
}
