import type { IConfig } from '../../intf/IConfig'
import type { BuiltInParserName, LiteralUnion } from 'prettier'

import np from 'node:path/posix'
import fse from 'fs-extra'
import prettier from 'prettier'
import typescript from 'typescript'

import { lint } from '../../utils/lint'
import prettierConfig from '../../utils/prettier.config'

const transformJs = (code: string, cjs?: boolean): string => {
    return typescript.transpile(code, {
        strict: false,
        target: typescript.ScriptTarget.ESNext,
        module: cjs ? typescript.ModuleKind.CommonJS : typescript.ModuleKind.ESNext,
        project: process.cwd(),
        declaration: true
    })
}

const transformDts = (code: string): string => {
    const transformers = (typescript as any).getTransformers({
        target: typescript.ScriptTarget.ESNext,
        module: typescript.ModuleKind.ESNext,
        declaration: true
    })
    return typescript.transpileModule(code, {
        compilerOptions: {
            target: typescript.ScriptTarget.ESNext,
            module: typescript.ModuleKind.ESNext,
            declaration: true
        },
        transformers: {
            before: transformers.declarationTransformers
        }
    }).outputText
}

const format = (code: string, parser: LiteralUnion<BuiltInParserName>): string => {
    try {
        return prettier.format(code, { parser, ...prettierConfig })
    } catch (error) {
        return code
    }
}

const write = (path: string, code: string, parser: LiteralUnion<BuiltInParserName>): void => {
    code = format(code, parser)
    fse.writeFileSync(path, code ?? '')
}

/** 写入到文件 */
export const writeFile = (path: string, code: string, config: IConfig): void => {
    const dir: string = np.dirname(path)
    // ? 清理旧文件
    if (config.output.clear && fse.existsSync(dir)) fse.removeSync(dir)
    // ? 创建新文件夹
    if (!fse.existsSync(dir)) fse.mkdirSync(dir, { recursive: true })
    let js!: string
    let dts!: string
    const dirname: string = np.dirname(path)
    const basename: string = np.basename(path, np.extname(path))
    // > 执行 eslint 检查, 避免生成代码因为接口文档内容因素导致报错
    code = lint(path, code)
    // > 转换代码格式及导出
    switch (config.output.language) {
        case 'js':
            js = transformJs(code, config.output.cjs)
            dts = transformDts(code)
            write(np.join(dirname, basename + '.js'), js, 'babel')
            write(np.join(dirname, basename + '.d.ts'), dts, 'typescript')
            break
        case 'only-js':
            js = transformJs(code, config.output.cjs)
            write(np.join(dirname, basename + '.js'), js, 'babel')
            break
        case 'ts':
        default:
            write(path, code, 'typescript')
            break
    }
}
