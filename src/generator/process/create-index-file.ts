import type { IApi } from '../../intf/IApi'
import type { IConfig } from '../../intf/IConfig'

import np from 'node:path/posix'

/** 创建 index file */
export const createIndexFile = (
    groupApi: Array<Array<IApi>>,
    config: IConfig
): { indexFilePath: string; code: string } => {
    const indexFilePath: string = np.normalize(np.join(config.output.dir, 'index.ts'))
    const importStatements: Array<string> = []
    const outputStatements: Array<string> = ['export const apis = {']
    // 生成导入路径
    for (const group of groupApi) {
        // @ 定义输出文件目录
        const { name, map } = group[0].outFile
        const projects = group
            .map((api) => api.outFile?.project)
            .reduce((set, projects) => {
                for (const proj of projects ?? []) set.add(proj)
                return set
            }, new Set())
        importStatements.push(`import * as ${map} from './${map}'`)
        outputStatements.push(`  /**`)
        outputStatements.push(`   * <文件夹> ${name}`)
        outputStatements.push(`   * @total (接口数) ${group.length}`)
        outputStatements.push(`   * @projects`)
        for (const proj of Array.from(projects)) {
            outputStatements.push(`   *   - ${proj}`)
        }
        outputStatements.push(`   */`)
        outputStatements.push(`  ${map},`)
    }
    outputStatements.push('}')
    // 生成导出及注释
    return {
        indexFilePath,
        code: importStatements.join('\n') + '\n' + outputStatements.join('\n')
    }
}
