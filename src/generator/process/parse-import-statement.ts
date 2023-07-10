import { point } from '../../utils/point'

/**
 * 解析 import 语句中 使用的请求工具
 */
export const parseImportStatement = (
    importStatement: string = `import request from '@/utils/request'`
): { requestUtil: string; importStatement: string } => {
    const isImportStatement: boolean = /import.+?from[ ]{1,}['"](.+?)['"]/.test(importStatement)
    const isRequireStatement: boolean = /[const|let|var] .+?=[ ]{0,}require\(.+?\)/.test(importStatement)
    const matchUtil = (req: string, statmentType: string): string => {
        const util: string = req.match(/\{(.+?)\}/) ? req.match(/\{(.+?)\}/)[1] : req
        if (util.split(',').length > 1) {
            point.error(`${statmentType} 语句仅允许导入一个变量, 请检查配置项 'output.applyImportStatements'`)
        }
        return util
    }
    if (isImportStatement) {
        const [, req] = importStatement.match(/import(.+?)from ['"](.+?)['"]/)
        return { requestUtil: matchUtil(req, 'import'), importStatement }
    } else if (isRequireStatement) {
        const [, req] = importStatement.match(/[const|let|var] (.+?)=[ ]{0,}require\(.+?\)/)
        return { requestUtil: matchUtil(req, 'require'), importStatement }
    } else {
        point.error("import 语句解析失败, 请检查配置项 'output.applyImportStatements' ")
        process.exit(200)
    }
}
