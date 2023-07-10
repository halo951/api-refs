import { AxiosResponse } from 'axios';
export declare const apis: {
    /** 登录 */
    login(form: unknown): Promise<AxiosResponse<any>>;
    /** 加载用户所有的组织 */
    userTeams(token: string): Promise<AxiosResponse<Array<{
        id: number;
        name: string;
        roleType: number;
    }>>>;
    /** 加载用户所有的项目 */
    userProjects(token: string): Promise<AxiosResponse<Array<{
        categoryIds: null | Array<any>;
        description: string;
        grade: unknown;
        icon: string;
        id: number;
        mockRule: {
            rules: Array<unknown>;
            enableSystemRule: boolean;
        };
        name: string;
        ordering: number;
        roleType: number;
        teamId: number;
        type: 'HTTP';
        visibility: 'private';
    }>>>;
    projectMembers(token: string, projectId: number, teamId: number): Promise<AxiosResponse<any, any>>;
    /** 加载项目文件夹、接口结构树 */
    apiTreeList(token: string, projectId: number): Promise<AxiosResponse<any>>;
    /** 加载接口详情 */
    apiDetails(token: string, projectId: number): Promise<AxiosResponse<any>>;
    /** 加载 api Schema 引用 */
    apiSchemas(token: string, projectId: number): Promise<AxiosResponse<any>>;
};
