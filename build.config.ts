import { defineBuildConfig } from 'unbuild'
import ts2 from 'rollup-plugin-typescript2'
import { banner } from './scripts/rollup-banner-plugin'
import { dtsMapping } from './scripts/rollup-dts-mapping-plugin'

export default defineBuildConfig({
    entries: ['src/index'],
    clean: true,
    declaration: false,
    rollup: {
        emitCJS: true,
        inlineDependencies: true
    },
    hooks: {
        'rollup:options'(_, options): void {
            options.plugins = [
                // 插入banner
                banner(),
                // 使用自定义的 .d.ts 转化插件
                ts2({ tsconfigDefaults: { emitDeclarationOnly: true } }),
                //  映射 .d.ts 文件路径 (处理存在 src/ 目录外引用导致的.d.ts输出目录层级与预期不一致问题)
                dtsMapping((name: string) => name.replace(/^src/, 'typings')),
                // unbuild 构建插件
                options.plugins
            ]
        }
    }
})
