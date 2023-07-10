import type { IApi } from '../../intf/IApi'
import type { IConfig } from '../../intf/IConfig'

import np from 'node:path/posix'

/** 创建 api 文件 文件头注释 */
export const createApiFileHeaderComment = (apis: Array<IApi>, config: IConfig): string => {
    const projects: Array<string> = apis.reduce((total, api): Array<string> => {
        return total.concat(api.outFile.project)
    }, [])
    const comments: Array<string> = Array.from(new Set(projects)).map((c: string) => `  - ${c} `)
    const outFile: IApi['outFile'] = apis[0]?.outFile ?? { name: '-', map: '-', path: '-', project: [] }
    return [
        `/* <${np.basename(outFile.path)}> ${outFile.name} */`,
        `/* @util <api-refs@${config.version}> */`,
        `/* @datasouce ${config.datasource} */`,
        `/* @total ${apis.length} */`,
        `/* @projects \n ${comments.join('\n')} \n */`,
        '',
        ''
    ].join('\n')
}
