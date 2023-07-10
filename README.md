<h2 style='text-align:center'>api-refs (原: apifox-generator)</h2>

<br />

> 这是一个能够显著提高前端接口管理效率的工具。基于 apifox 的 JSONSchema 规范, 生成前端项目使用的接口调用文件.

## About

-   🚀 **效率提升** 自动化完成前端接口对接工作, 减少接口对接的工作量.
-   🍼 **类型提示** 生成结果完美还原接口文档类型, 能够显著降低开发阶段代码拼写错误的产生.
-   📖 **配置简单** 配置文件提供了 `JSONSchema` 支持, 能够及时检测配置错误、或工具更新产生的配置差异.
-   ✈ **及时性** 可观测接口文档变化, 结合 git 工具, 可在每次生成后, 实时反馈接口文档的变化.
-   📌**一致性** 通过一致的代码结构, 减少不同代码风格产生的差异, 有利于大体量项目场景的长期维护.
-   **其他**

    -   module support: `cjs`、 `esm`
    -   更完善地参数类型支持: `params`, `data`, `header`, `cookie`, `auth`

## Support (逐步更新支持)

-   apifox [✔]
-   apipost []
-   swagger []

## Usage

1. 安装

```bash
yarn add api-refs --dev
# or
npm install api-refs
```

2. 增加快捷命令 (package.json)

> Tips: 可根据需要指定其他命令名

```
{
    "scripts": {
        "api:ref": "api-refs"
    },
}
```

3. 生成 (首次生成时, 需要遵循提示进行简单配置)

```bash
yarn api:ref
```

4. 其他一些命令参数

```bash
# 一般生成, 首次生成需配置
yarn api:ref
# 查看帮助
yarn api:ref -h
# 重新生成配置文件
yarn api:ref -r
# 指定配置文件 (当同一项目使用多个文档内接口可能会用到, 但不建议这么使用)
yarn api:ref -c < config file path >
# 覆盖配置信息
yarn api:ref -s < key > < value >

# 生成请求工具文件 (request.ts)
yarn api:ref ir
```

## Config

> [TIPS] 为了照顾大多数的使用场景的使用体验, 小部分兼容性配置需要手工设置, 具体可参考接口参数

-   [interface](./dist/typings/intf/IConfig.d.ts)
-   [schema](./api-refs.config.json)

## FAQ

### 1. 如何指定自定义请求工具 ?

默认情况下, 建议使用 `axios`, 并将实例放置到 `@/utils/request` 文件内. 如果你的项目不满足上述条件, 可以通过以下方式自定义请求工具.

-   首先, 自定义请求工具需要继承 `axios` 实例, 或具备与 `axios` 相同的 api.

-   修改生成配置 `api-refs.config.json`, 通过 `output.applyImportStatements` 字段指定请求工具路径

-   重新生成

### 2. 接口文档交付问题

一般做存档使用时, 建议统一管理`apifox`即可, 但如果需要文档形式的接口文档时, 可使用 apifox 进行文档导出, 还是比较便捷和规范的.

### 3. 关于生成策略

原定的计划是准备生成 ast 语法树, 然后在转化成代码的, 实验了一下, 发现这样做会使生成逻辑增大 2 倍, 所以还是改回了原来的基于文本拼接方式生成. 当然了, 这种方式虽然在代码量以及性能上面略有优势, 但可能会牺牲一定的稳定性, 所以如果生成失败的情况下, 请尝试调整接口文档的设计, 并重新生成即可.
