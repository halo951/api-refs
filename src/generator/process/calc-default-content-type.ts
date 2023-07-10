import type { IApi } from '../../intf/IApi'

/** 计算项目中需要生成的接口的默认 content-type */
export const calcDefaultContentType = (apis: Array<IApi>): string => {
    return apis
        .reduce((total, api) => {
            if (api.requestObject.body?.type) {
                const ct = total.find(([contentType]) => contentType === api.requestObject.body.type)
                if (ct) {
                    ct[1] += 1
                } else {
                    total.push([api.requestObject.body.type, 1])
                }
            }
            return total
        }, [] as Array<[string, number]>)
        .sort((a, b) => b[1] - a[1])[0][0]
}
