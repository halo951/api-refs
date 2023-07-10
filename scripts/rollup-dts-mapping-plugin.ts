import { Plugin } from 'rollup'
/** .d.ts 文件目录映射 */
export const dtsMapping = (replace: (fileName: string) => string): Plugin => {
    return {
        name: 'plugin:dts-mapping',
        generateBundle(_, bundle) {
            for (const key in bundle) {
                if (!/\.d\.ts$/.test(key)) continue
                bundle[key].fileName = replace(bundle[key].fileName)
            }
        }
    }
}
