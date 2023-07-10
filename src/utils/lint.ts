import { Linter } from 'eslint'
import parser from '@typescript-eslint/parser'
import { rules } from '@typescript-eslint/eslint-plugin'

import { point } from './point'

/** 通过 eslint 进行代码格式检查, 并修改数组格式 */
export const lint = (name: string, code: string): string => {
    try {
        const linter = new Linter()
        linter.defineParser('@typescript-eslint/parser', parser as any)
        linter.defineRules(rules as any)
        code = linter.verifyAndFix(code, {
            parser: '@typescript-eslint/parser',
            rules: {
                'array-type': [2, { default: 'generic' }]
            }
        }).output
    } catch (error) {
        point.error('typescript parser failure. please check: ' + name)
    } finally {
        return code
    }
}
