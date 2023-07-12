import { defineBuildConfig } from 'unbuild'
import { banner } from './scripts/rollup-banner-plugin'
import { generateJsonSchema } from './scripts/generate-json-schema-script'

export default defineBuildConfig({
    entries: ['src/index'],
    clean: true,
    declaration: false,
    rollup: {
        emitCJS: true,
        inlineDependencies: true
    },
    hooks: {
        // 构建开始前, 生成 json schema 文件
        'build:prepare'(): void {
            generateJsonSchema()
        },
        'rollup:options'(_, options): void {
            options.plugins = [
                // 插入banner
                banner(),
                // unbuild 构建插件
                options.plugins
            ]
        }
    }
})
