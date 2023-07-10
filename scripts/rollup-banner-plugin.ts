import { Plugin } from 'rollup'
import pkg from '../package.json'

/** 编译后置操作, 添加banner */
export const banner = (banner?: string): Plugin => {
    if (!banner) {
        banner = `
            // @ts-nocheck
            /** 
             * ${pkg.name}@${pkg.version}
             * 
             * Copyright (c) ${new Date().getFullYear()} ${pkg.author.name} <${pkg.author.url}>
             * Released under ${pkg.license} License
             * 
             * @build ${new Date()}
             * @author ${pkg.author.name}(${pkg.author.url})
             * @license ${pkg.license}
             */
        `
            .trim()
            .split(/\n/g)
            .map((s) => s.trim())
            .join('\n')
    }
    return {
        name: 'plugin:banner',
        renderChunk(code) {
            return [banner, code].join('\n')
        }
    }
}
