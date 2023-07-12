import type { LiteralUnion, BuiltInParserName } from 'prettier'
import { resolve } from 'node:path/posix'
import { writeFileSync } from 'node:fs'

import * as TJS from 'typescript-json-schema'
import prettier from 'prettier'
import prettierConfig from '../src/utils/prettier.config'

const format = (code: string, parser: LiteralUnion<BuiltInParserName>): string => {
    try {
        return prettier.format(code, { parser, ...prettierConfig })
    } catch (error) {
        return code
    }
}

/** 生成 Json Schema 文件 */
export const generateJsonSchema = (): void => {
    const settings: TJS.PartialArgs = {
        noExtraProps: true
    }

    const compilerOptions: TJS.CompilerOptions = {
        strictNullChecks: true
    }

    const program = TJS.getProgramFromFiles([resolve('./src/intf/IConfig.ts')], compilerOptions)

    const schema = TJS.generateSchema(program, 'IConfig', settings)
    // > write
    writeFileSync('./api-refs.schema.json', format(JSON.stringify(schema), 'json'), { encoding: 'utf-8' })
}
