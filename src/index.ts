import type { IConfig } from './intf/IConfig'
import type { IApi } from './intf/IApi'

import fs from 'node:fs'
import prettier from 'prettier'
import { program } from 'commander'

import pkg from '../package.json'

import { inputConfigAndLoadApis, parseConfig } from './parserts'
import { generate } from './generator'

import { inputBoolean } from './utils/forms'
import { point } from './utils/point'
import prettierConfig from './utils/prettier.config'

/** 默认配置文件名 */
const DEFAULT_CONFIG_FILE_NAME: string = 'api-refs.config.json'

// @ 配置文件路径
let configFilePath!: string
// @ 配置文件
let config!: IConfig
// @ 从数据源中加载到的接口数据集合
let apis!: Array<IApi>

// > 监听程序退出, 并在退出时, 确认是否需要保存配置
process.addListener('exit', (code: number): void => {
    if (code === 200 && config && configFilePath) {
        const output: string = prettier.format(JSON.stringify(config), {
            parser: 'json',
            ...prettierConfig
        })
        fs.writeFileSync(configFilePath, output, { encoding: 'utf-8' })
        point.save('配置已保存')
        process.exit(0)
    }
})

/** api-refs 接口生成命令配置 */
program
    .name(pkg.name)
    .version(pkg.version)
    .description(pkg.description)
    .helpOption(undefined, '查看帮助')
    .option('-r, --reset <reset project>', '是否重置配置文件')
    .option('-c, --config <config file path>', '指定使用的配置文件')
    .action(async ({ reset, config: customConfigPath }) => {
        configFilePath = customConfigPath ?? DEFAULT_CONFIG_FILE_NAME
        const hasConfigFile: boolean = fs.existsSync(configFilePath)

        // ? 如果未检索到配置文件, 且用户拒绝创建配置文件, 则中止应用并退出
        if (!hasConfigFile) {
            const isCreate: boolean = await inputBoolean('缺少配置文件是否创建', true)
            if (!isCreate) {
                point.warn('用户拒绝创建配置文件, 程序退出')
                process.exit()
            }
        }

        // > 解析配置 并 清理不符合格式的参数
        config = parseConfig(configFilePath, reset)

        // > 补全配置 & 并拉取接口数据
        apis = await inputConfigAndLoadApis(config)

        // > 执行生成
        await generate(apis, config)

        // > 执行生成操作
        process.exit(200)
    })
    .parse()
