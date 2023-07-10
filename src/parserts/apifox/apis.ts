import axios, { AxiosError, AxiosResponse } from 'axios'
import { point } from '../../utils/point'

const request = axios.create({
    baseURL: 'https://api.apifox.cn',
    headers: {
        Origin: 'https://www.apifox.cn',
        'X-Client-Mode': 'web',
        'X-Client-Version': '2.3.2-alpha.5',
        'X-Device-Id': 'O2zeTrkS-P5Pp-6ORU-ZGmY-fGOS74J3BDcN',
        'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
    },
    params: { locale: 'zh-CN' }
})

request.interceptors.response.use(
    (response) => {
        if (!response.data.success) {
            throw new Error(`'${response.request.url}' 请求失败`)
        }
        response.data = response.data.data
        return response
    },
    (err: AxiosError) => {
        let errMsg: string = `'${err.config?.url}' 请求失败, 错误码: ${err.code}. 请检查网络设置, 关闭代理或vpn.`
        point.error('\n' + errMsg)
        process.exit(200)
    }
)

export const apis = {
    /** 登录 */
    async login(form: unknown): Promise<AxiosResponse<any>> {
        return await request({ method: 'POST', url: '/api/v1/login', data: form })
    },
    /** 加载用户所有的组织 */
    async userTeams(token: string): Promise<AxiosResponse<Array<{ id: number; name: string; roleType: number }>>> {
        return request({
            url: '/api/v1/user-teams',
            headers: { Authorization: token }
        })
    },
    /** 加载用户所有的项目 */
    async userProjects(token: string): Promise<
        AxiosResponse<
            Array<{
                categoryIds: null | Array<any>
                description: string
                grade: unknown
                icon: string
                id: number
                mockRule: { rules: Array<unknown>; enableSystemRule: boolean }
                name: string
                ordering: number
                roleType: number
                teamId: number
                type: 'HTTP'
                visibility: 'private'
            }>
        >
    > {
        return request({
            url: '/api/v1/user-projects',
            headers: { Authorization: token }
        })
    },

    async projectMembers(token: string, projectId: number, teamId: number) {
        return request({
            url: '/api/v1/project-members',
            headers: { Authorization: token, 'X-Project-Id': projectId },
            params: { teamId }
        })
    },

    /** 加载项目文件夹、接口结构树 */
    async apiTreeList(token: string, projectId: number): Promise<AxiosResponse<any>> {
        return request({
            url: '/api/v1/api-tree-list',
            headers: { Authorization: token, 'X-Project-Id': projectId }
        })
    },

    /** 加载接口详情 */
    async apiDetails(token: string, projectId: number): Promise<AxiosResponse<any>> {
        return request({
            url: '/api/v1/api-details',
            headers: { Authorization: token, 'X-Project-Id': projectId }
        })
    },

    /** 加载 api Schema 引用 */
    async apiSchemas(token: string, projectId: number): Promise<AxiosResponse<any>> {
        return request({
            url: '/api/v1/api-schemas',
            headers: { Authorization: token, 'X-Project-Id': projectId }
        })
    }
}
