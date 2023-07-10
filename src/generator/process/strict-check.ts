import type { IApi } from '../../intf/IApi'
import type { IConfig } from '../../intf/IConfig'

import { point } from '../../utils/point'

/** 严格模式检查 */
export const strictCheck = (apis: Array<IApi>, config: IConfig): void => {
    if (!config.output?.strict) {
        return
    }
    const repetitive: Array<[string, number]> = apis
        .reduce((total, api) => {
            const u = total.find((t) => t[0] === api.url)
            if (u) {
                u[1]++
            } else {
                total.push([api.url, 0])
            }
            return total
        }, [])
        .filter(([, count]) => {
            return count > 0
        })
    if (repetitive.length > 0) {
        for (const [api, count] of repetitive) {
            point.warn(
                `接口 '${api}' 存在重复定义 (出现 ${count} 次), 如果这是符合预期的, 请关闭严格模式(output.strict)后重新生成.`
            )
        }
        process.exit(200)
    }
}
