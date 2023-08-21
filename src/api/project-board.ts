import request from '../utils/axios'
import { AxiosResponse } from 'axios'

/* <project-board.ts> 项目看板 */
/* @util <api-refs@1.0.0-alpha.7> */
/* @datasouce apifox */
/* @total 12 */
/* @projects 
   - [北投](https://www.apifox.cn/web/project/3024468)  
 */

/**
 * request body | 获取项目看板启用状态
 *
 * @function modelConfigQuery
 * @ContentType application/json
 */
export interface IModelConfigQueryData {
    groupCode: string
}

/**
 * response | 获取项目看板启用状态
 *
 * @function modelConfigQuery
 * @status (200) 成功
 * @responseType json
 */
export interface IModelConfigQueryResponse {
    code: string
    result: string
    data: Array<{
        id: number
        modelName: string
        modelSort: number
        modelIsCheck: number
        createTime: string
        updateTime: string
        projectId: string
    }>
    timestamp: string
    traceId: string
}

/**
 * 获取项目看板启用状态
 *
 * @link https://app.apifox.com/link/project/3024468/apis/api-98530503
 * @updateAt 2023-07-27T06:17:34.000Z
 * @author libin<libin@persagy.com>
 */
export const modelConfigQuery = (data: IModelConfigQueryData): Promise<AxiosResponse<IModelConfigQueryResponse>> => {
    return request({
        method: 'POST',
        url: '/api/meos/custom-server/model/config/query',
        data
    })
}

/**
 * request body | 获取项目信息
 *
 * @function decisionProjectInfo
 * @ContentType application/json
 */
export interface IDecisionProjectInfoData {}

/**
 * response | 获取项目信息
 *
 * @function decisionProjectInfo
 * @status (200) 成功
 * @responseType json
 */
export interface IDecisionProjectInfoResponse {
    code: string
    result: string
    data: {
        /**
         * 项目图片
         */
        pictures: Array<string>
        /**
         * 建筑面积
         */
        buildingArea: number
        /**
         * 系统类型
         */
        systemType: string
        /**
         * 用能面积
         */
        energyArea: string
    }
    timestamp: string
    traceId: string
}

/**
 * 获取项目信息
 *
 * @link https://app.apifox.com/link/project/3024468/apis/api-96076447
 * @description 查询项目信息
 * @updateAt 2023-08-16T08:00:48.000Z
 * @author libin<libin@persagy.com>
 */
export const decisionProjectInfo = (
    data: IDecisionProjectInfoData
): Promise<AxiosResponse<IDecisionProjectInfoResponse>> => {
    return request({
        method: 'POST',
        url: '/custom-server/data/decision/project/info',
        data
    })
}

/**
 * request body | 能耗管理
 *
 * @function projectEnergyTrend
 * @ContentType application/json
 */
export interface IProjectEnergyTrendData {
    /**
     * 集团编码
     */
    groupCode: string
    testt1?: string
}

/**
 * response | 能耗管理
 *
 * @function projectEnergyTrend
 * @status (200) 成功
 * @responseType json
 */
export interface IProjectEnergyTrendResponse {
    code: string
    result: string
    data: {
        /**
         * 公区数据
         */
        publicEnergy: {
            /**
             * 同比使用率
             */
            usageRate: string
            /**
             * 今年累计能耗
             */
            energy: string
            /**
             * 去年累计能耗
             */
            lastYearEnergy: string
            /**
             * 月度能耗数据
             */
            monthEnergyList: Array<{
                /**
                 * 月份
                 */
                month: number
                /**
                 * 今年能耗
                 */
                energy: string | null
                /**
                 * 去年能耗
                 */
                lastYearEnergy: string
                /**
                 * 前年能耗
                 */
                beforeLastYearEnergy: null
            }>
        }
        /**
         * 租区数据，结构同公区
         */
        rentalEnergy: {
            /**
             * 同比使用率
             */
            usageRate: string
            /**
             * 今年累计能耗
             */
            energy: string
            /**
             * 去年累计能耗
             */
            lastYearEnergy: string
            /**
             * 月度能耗数据
             */
            monthEnergyList: Array<{
                month: number
                energy: string | null
                lastYearEnergy: string
                beforeLastYearEnergy: null
            }>
        }
    }
    timestamp: string
    traceId: string
}

/**
 * 能耗管理
 *
 * @link https://app.apifox.com/link/project/3024468/apis/api-103298316
 * @updateAt 2023-08-21T02:29:48.000Z
 * @author libin<libin@persagy.com>
 */
export const projectEnergyTrend = (
    data: IProjectEnergyTrendData
): Promise<AxiosResponse<IProjectEnergyTrendResponse>> => {
    return request({
        method: 'POST',
        url: '/custom-server/data/decision/project/energy/trend',
        data
    })
}

/**
 * request body | 供能及能耗分析
 *
 * @function energyAndCoolPTrend
 * @ContentType application/json
 */
export interface IEnergyAndCoolPTrendData {
    /**
     * 集团编码
     */
    groupCode: string
}

/**
 * response | 供能及能耗分析
 *
 * @function energyAndCoolPTrend
 * @status (200) 成功
 * @responseType json
 */
export interface IEnergyAndCoolPTrendResponse {
    code: string
    result: string
    data: {
        /**
         * 能耗数据
         */
        totalEnergy: {
            /**
             * 同比使用率
             */
            usageRate: string
            /**
             * 今年累计能耗
             */
            energy: string
            /**
             * 去年累计能耗
             */
            lastYearEnergy: string
            /**
             * 月度数据
             */
            monthEnergyList: Array<{
                /**
                 * 月份
                 */
                month: number
                /**
                 * 今年能耗
                 */
                energy: string | null
                /**
                 * 去年能耗
                 */
                lastYearEnergy: string
                /**
                 * 前年能耗
                 */
                beforeLastYearEnergy: null
            }>
        }
        /**
         * 供能数据
         */
        totalCoolP: {
            /**
             * 同比使用率
             */
            usageRate: string
            /**
             * 今年累计能耗
             */
            energy: string
            /**
             * 去年累计能耗
             */
            lastYearEnergy: string
            /**
             * 月度数据
             */
            monthEnergyList: Array<{
                month: number
                energy: string | null
                lastYearEnergy: string
                beforeLastYearEnergy: null
            }>
        }
    }
    timestamp: string
    traceId: string
}

/**
 * 供能及能耗分析
 *
 * @link https://app.apifox.com/link/project/3024468/apis/api-103301616
 * @updateAt 2023-08-16T08:01:46.000Z
 * @author libin<libin@persagy.com>
 */
export const energyAndCoolPTrend = (
    data: IEnergyAndCoolPTrendData
): Promise<AxiosResponse<IEnergyAndCoolPTrendResponse>> => {
    return request({
        method: 'POST',
        url: '/custom-server/data/decision/project/energyAndCoolP/trend',
        data
    })
}

/**
 * request body | 能效指标
 *
 * @function projectEfficiencyInfo
 * @ContentType application/json
 */
export interface IProjectEfficiencyInfoData {
    /**
     * 集团编码
     */
    groupCode: string
}

/**
 * response | 能效指标
 *
 * @function projectEfficiencyInfo
 * @status (200) 成功
 * @responseType json
 */
export interface IProjectEfficiencyInfoResponse {
    code: string
    result: string
    data: Array<{
        /**
         * 系统Id
         */
        systemId: string
        /**
         * 系统名
         */
        systemName: string
        /**
         * 平均cop
         */
        cop: number
    }>
    timestamp: string
    traceId: string
}

/**
 * 能效指标
 *
 * @link https://app.apifox.com/link/project/3024468/apis/api-98687094
 * @updateAt 2023-08-16T08:01:50.000Z
 * @author libin<libin@persagy.com>
 */
export const projectEfficiencyInfo = (
    data: IProjectEfficiencyInfoData
): Promise<AxiosResponse<IProjectEfficiencyInfoResponse>> => {
    return request({
        method: 'POST',
        url: '/custom-server/data/decision/project/efficiency/info',
        data
    })
}

/**
 * request body | 节碳分析
 *
 * @function carbonReductionInfo
 * @ContentType application/json
 */
export interface ICarbonReductionInfoData {
    /**
     * 集团编码
     */
    groupCode: string
}

/**
 * response | 节碳分析
 *
 * @function carbonReductionInfo
 * @status (200) 成功
 * @responseType json
 */
export interface ICarbonReductionInfoResponse {
    code: string
    result: string
    data: Array<{
        /**
         * 日期, 格式: yyyyMMdd
         */
        time: string
        /**
         * 总节碳量, 单位: kgCO2
         */
        totalCarbon: number
        /**
         * 地源热泵节碳量, 单位: kgCO2
         */
        gshpCarbon: number
        /**
         * 光伏节碳量, 单位: kgCO2
         */
        pvCarbon: number
        /**
         * 节能管控节碳量, 单位: kgCO2
         */
        energyControlCarbon: number
    }>
    timestamp: string
    traceId: string
}

/**
 * 节碳分析
 *
 * @link https://app.apifox.com/link/project/3024468/apis/api-103301017
 * @updateAt 2023-08-16T08:01:23.000Z
 * @author libin<libin@persagy.com>
 */
export const carbonReductionInfo = (
    data: ICarbonReductionInfoData
): Promise<AxiosResponse<ICarbonReductionInfoResponse>> => {
    return request({
        method: 'POST',
        url: '/custom-server/data/decision/project/carbonReduction/info',
        data
    })
}

/**
 * request body | 环境品质
 *
 * @function queryProjectEnvironmentalQuality
 * @ContentType application/json
 */
export interface IQueryProjectEnvironmentalQualityData {
    /**
     * 集团编码
     */
    groupCode: string
    /**
     * 环境类型: 温度Temp 湿度 RH 不传默认温度
     *
     * @default Temp
     */
    envTypeId?: 'Temp' | 'RH'
}

/**
 * response | 环境品质
 *
 * @function queryProjectEnvironmentalQuality
 * @status (200) 成功
 * @responseType json
 */
export interface IQueryProjectEnvironmentalQualityResponse {
    code: string
    result: string
    /**
     * {[key: string]: number | number } 格式
     */
    data: Array<{}>
    timestamp: string
    traceId: string
}

/**
 * 环境品质
 *
 * @link https://app.apifox.com/link/project/3024468/apis/api-96878424
 * @description 查询环境品质
 * @updateAt 2023-08-16T08:01:14.000Z
 * @author libin<libin@persagy.com> qZVi
 */
export const queryProjectEnvironmentalQuality = (
    data: IQueryProjectEnvironmentalQualityData
): Promise<AxiosResponse<IQueryProjectEnvironmentalQualityResponse>> => {
    return request({
        method: 'POST',
        url: '/custom-server/data/decision/project/queryProjectEnvironmentalQuality',
        data
    })
}

/**
 * request body | 能耗分布
 *
 * @function projectEnergyDistribution
 * @ContentType application/json
 */
export interface IProjectEnergyDistributionData {
    /**
     * 集团编码
     */
    groupCode: string
    /**
     * 日期类型, 1:当月 2：当年
     */
    timeType: 1 | 2
}

/**
 * response | 能耗分布
 *
 * @function projectEnergyDistribution
 * @status (200) 成功
 * @responseType json
 */
export interface IProjectEnergyDistributionResponse {
    code: string
    result: string
    data: {
        /**
         * @name 公区能耗
         */
        publicEnergy: string
        /**
         * @name 租区能耗
         */
        rentalEnergy: string
        /**
         * @name 能耗分布
         */
        list: Array<{
            /**
             * @name 分项id
             */
            itemId: string
            /**
             * @name 分项名称
             */
            itemName: string
            /**
             * @name 分项能耗
             */
            energy: string
            /**
             * @name 占比
             */
            rate: string
        }>
    }
    timestamp: string
    traceId: string
}

/**
 * 能耗分布
 *
 * @link https://app.apifox.com/link/project/3024468/apis/api-103301163
 * @updateAt 2023-08-16T08:01:33.000Z
 * @author libin<libin@persagy.com>
 */
export const projectEnergyDistribution = (
    data: IProjectEnergyDistributionData
): Promise<AxiosResponse<IProjectEnergyDistributionResponse>> => {
    return request({
        method: 'POST',
        url: '/custom-server/data/decision/project/energy/distribution',
        data
    })
}

/**
 * request body | 能耗趋势
 *
 * @function projectEnergyTrend1
 * @ContentType application/json
 */
export interface IProjectEnergyTrend1Data {
    /**
     * 集团编码
     */
    groupCode: string
}

/**
 * response | 能耗趋势
 *
 * @function projectEnergyTrend1
 * @status (200) 成功
 * @responseType json
 */
export interface IProjectEnergyTrend1Response {
    code: string
    result: string
    data: {
        /**
         * 公区数据
         */
        publicEnergy?: {
            /**
             * 同比使用率
             */
            usageRate: string
            /**
             * 今年累计能耗
             */
            energy: string
            /**
             * 去年累计能耗
             */
            lastYearEnergy: string
            monthEnergyList: Array<{
                /**
                 * 月份
                 */
                month: number
                /**
                 * 今年能耗
                 */
                energy: string | null
                /**
                 * 去年能耗
                 */
                lastYearEnergy: string
                /**
                 * 前年能耗
                 */
                beforeLastYearEnergy: null
            }>
        }
        /**
         * 租区数据，结构同公区
         */
        rentalEnergy?: {
            usageRate: string
            energy: string
            lastYearEnergy: string
            monthEnergyList: Array<{
                month: number
                energy: string | null
                lastYearEnergy: string
                beforeLastYearEnergy: null
            }>
        }
    }
    timestamp: string
    traceId: string
}

/**
 * 能耗趋势
 *
 * @link https://app.apifox.com/link/project/3024468/apis/api-98482114
 * @updateAt 2023-08-16T08:02:42.000Z
 * @author libin<libin@persagy.com>
 */
export const projectEnergyTrend1 = (
    data: IProjectEnergyTrend1Data
): Promise<AxiosResponse<IProjectEnergyTrend1Response>> => {
    return request({
        method: 'POST',
        url: '/custom-server/data/decision/project/energy/trend',
        data
    })
}

/**
 * request body | 获取系统图下拉筛选项
 *
 * @function systemGraphList
 * @ContentType application/json
 */
export interface ISystemGraphListData {
    /**
     * 集团编码
     */
    groupCode: string
}

/**
 * response | 获取系统图下拉筛选项
 *
 * @function systemGraphList
 * @status (200) 成功
 * @responseType json
 */
export interface ISystemGraphListResponse {
    code: string
    result: string
    data: Array<{
        /**
         * 系统id
         */
        systemId: string
        /**
         * 系统名称
         */
        systemName: string
        /**
         * 系统图id
         */
        graphId: string
    }>
    count: number
    timestamp: string
    traceId: string
}

/**
 * 获取系统图下拉筛选项
 *
 * @link https://app.apifox.com/link/project/3024468/apis/api-98156750
 * @updateAt 2023-08-16T08:02:03.000Z
 * @author libin<libin@persagy.com> qZVi
 */
export const systemGraphList = (data: ISystemGraphListData): Promise<AxiosResponse<ISystemGraphListResponse>> => {
    return request({
        method: 'POST',
        url: '/custom-server/data/decision/project/system/graph/list',
        data
    })
}

/**
 * request body | 获取系统图设备运行管理数据
 *
 * @function decisionProjectEquipment
 * @ContentType application/json
 */
export interface IDecisionProjectEquipmentData {
    groupCode: string
}

/**
 * response | 获取系统图设备运行管理数据
 *
 * @function decisionProjectEquipment
 * @status (200) 成功
 * @responseType json
 */
export interface IDecisionProjectEquipmentResponse {
    code: string
    result: string
    data: {
        冷冻水泵: {
            total: number
            code: string
            runing: number
        }
        冷却水泵: {
            total: number
            code: string
            runing: number
        }
        供热水泵: {
            total: number
            code: string
            runing: number
        }
        离心式冷水机组: {
            total: number
            code: string
            runing: number
        }
        冷却塔: {
            total: number
            code: string
            runing: number
        }
        补水泵: {
            total: number
            code: string
            runing: number
        }
    }
    timestamp: string
    traceId: string
}

/**
 * 获取系统图设备运行管理数据
 *
 * @link https://app.apifox.com/link/project/3024468/apis/api-96077958
 * @updateAt 2023-08-16T10:25:43.000Z
 * @author libin<libin@persagy.com>
 */
export const decisionProjectEquipment = (
    data: IDecisionProjectEquipmentData
): Promise<AxiosResponse<IDecisionProjectEquipmentResponse>> => {
    return request({
        method: 'POST',
        url: '/custom-server/data/decision/project/equipment',
        data
    })
}

/**
 * request body | 获取视频信息列表
 *
 * @function projectCameraInfo
 * @ContentType application/json
 */
export interface IProjectCameraInfoData {
    /**
     * 集团编码
     */
    groupCode: string
}

/**
 * response | 获取视频信息列表
 *
 * @function projectCameraInfo
 * @status (200) 成功
 * @responseType json
 */
export interface IProjectCameraInfoResponse {
    code: string
    result: string
    data: Array<{
        deviceSerial?: string
        deviceName?: string
        accessToken?: string
        playUrl?: string
    }>
    timestamp: string
    traceId: string
}

/**
 * 获取视频信息列表
 *
 * @link https://app.apifox.com/link/project/3024468/apis/api-96080434
 * @updateAt 2023-08-16T08:02:20.000Z
 * @author libin<libin@persagy.com>
 */
export const projectCameraInfo = (data: IProjectCameraInfoData): Promise<AxiosResponse<IProjectCameraInfoResponse>> => {
    return request({
        method: 'POST',
        url: '/custom-server/data/decision/project/camera/info',
        data
    })
}
