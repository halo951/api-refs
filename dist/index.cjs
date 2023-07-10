// @ts-nocheck
/**
* api-refs@1.0.0-alpha.4
*
* Copyright (c) 2023 halo951 <https://github.com/halo951>
* Released under MIT License
*
* @build Mon Jul 10 2023 17:32:04 GMT+0800 (中国标准时间)
* @author halo951(https://github.com/halo951)
* @license MIT
*/
'use strict';

const fs = require('node:fs');
const prettier = require('prettier');
const commander = require('commander');
const set = require('set-value');
const get = require('get-value');
const Ajv = require('ajv');
const chalk = require('chalk');
const lite = require('klona/lite');
const Enquirer = require('enquirer-esm');
const boxen = require('boxen');
const singleLineLog = require('single-line-log');
const axios = require('axios');
const np = require('node:path/posix');
const arrayGrouping = require('array-grouping');
const changeCase = require('change-case');
const jsonSchemaToTypescript = require('json-schema-to-typescript');
const fse = require('fs-extra');
const typescript = require('typescript');
const eslint = require('eslint');
const parser = require('@typescript-eslint/parser');
const eslintPlugin = require('@typescript-eslint/eslint-plugin');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

const fs__default = /*#__PURE__*/_interopDefaultCompat(fs);
const prettier__default = /*#__PURE__*/_interopDefaultCompat(prettier);
const set__default = /*#__PURE__*/_interopDefaultCompat(set);
const get__default = /*#__PURE__*/_interopDefaultCompat(get);
const Ajv__default = /*#__PURE__*/_interopDefaultCompat(Ajv);
const chalk__default = /*#__PURE__*/_interopDefaultCompat(chalk);
const Enquirer__default = /*#__PURE__*/_interopDefaultCompat(Enquirer);
const boxen__default = /*#__PURE__*/_interopDefaultCompat(boxen);
const axios__default = /*#__PURE__*/_interopDefaultCompat(axios);
const np__default = /*#__PURE__*/_interopDefaultCompat(np);
const fse__default = /*#__PURE__*/_interopDefaultCompat(fse);
const typescript__default = /*#__PURE__*/_interopDefaultCompat(typescript);
const parser__default = /*#__PURE__*/_interopDefaultCompat(parser);

const name = "api-refs";
const version = "1.0.0-alpha.4";
const type$1 = "module";
const description$1 = "这是一个能够显著提高前端接口管理效率的工具。基于 apifox 的 JSONSchema 规范, 生成前端项目使用的接口调用文件.";
const keywords = [
	"apifox",
	"apifox-generator"
];
const bin = {
	"api-refs": "bin/cli.js",
	ga: "bin/cli.js"
};
const files = [
	"src/*",
	"dist/*",
	"bin/*"
];
const exports$1 = {
	".": {
		"default": "./dist/index.mjs",
		require: "./dist/index.cjs",
		"import": "./dist/index.mjs",
		types: "./dist/typings/index.d.ts"
	}
};
const scripts = {
	clean: "rimraf dist && rimraf typings",
	build: "unbuild && yarn build:schema",
	"build:schema": "typescript-json-schema ./src/intf/IConfig.ts IConfig -o api-refs.schema.json --noExtraProps",
	format: "prettier -w **.ts **.md **.json",
	preview: "unbuild && node ./dist/index.mjs",
	ref: "yarn unlink && yarn link",
	"api-refs": "api-refs"
};
const license = "MIT";
const packageManager = "yarn@1.22.19";
const engines = {
	node: ">= 16"
};
const sideEffects = false;
const author = {
	name: "halo951",
	url: "https://github.com/halo951"
};
const repository = {
	type: "git",
	url: "https://github.com/halo951/api-refs.git"
};
const bugs = {
	url: "https://github.com/halo951/api-refs/issues"
};
const dependencies = {
	"@typescript-eslint/eslint-plugin": "^5.61.0",
	"@typescript-eslint/parser": "^5.61.0",
	ajv: "8.12.0",
	"array-grouping": "1.0.8",
	axios: "1.4.0",
	boxen: "7.1.0",
	chalk: "5.3.0",
	"change-case": "^4.1.2",
	commander: "11.0.0",
	"enquirer-esm": "2.3.6-ext.1",
	eslint: "^8.44.0",
	"fs-extra": "11.1.1",
	"get-value": "3.0.1",
	"json-schema-to-typescript": "13.0.2",
	klona: "^2.0.6",
	prettier: "2.8.8",
	"set-value": "4.1.0",
	"single-line-log": "1.1.2",
	typescript: "^5.1.6"
};
const devDependencies = {
	"@types/eslint": "^8.44.0",
	"@types/fs-extra": "11.0.1",
	"@types/get-value": "3.0.3",
	"@types/gradient-string": "1.1.2",
	"@types/json-schema": "7.0.12",
	"@types/node": "18.15.11",
	"@types/prettier": "2.7.3",
	"@types/set-value": "4.0.1",
	"@types/single-line-log": "1.1.0",
	rimraf: "3.0.2",
	"rollup-plugin-typescript2": "^0.35.0",
	tslib: "2.5.2",
	"typescript-json-schema": "0.58.1",
	unbuild: "^1.2.1"
};
const pkg = {
	name: name,
	version: version,
	type: type$1,
	description: description$1,
	keywords: keywords,
	bin: bin,
	files: files,
	exports: exports$1,
	scripts: scripts,
	license: license,
	packageManager: packageManager,
	engines: engines,
	sideEffects: sideEffects,
	author: author,
	repository: repository,
	bugs: bugs,
	dependencies: dependencies,
	devDependencies: devDependencies
};

const $schema = "http://json-schema.org/draft-07/schema#";
const additionalProperties = false;
const definitions = {
	IApifoxCatalog: {
		additionalProperties: false,
		description: "(apifox) 缓存目录集合, 用于校验接口文档变化",
		properties: {
			children: {
				description: "子目录",
				items: {
					$ref: "#/definitions/IApifoxCatalog"
				},
				type: "array"
			},
			id: {
				description: "接口文件夹 id 标识",
				type: "number"
			},
			name: {
				description: "接口文件夹名称 (原始文件夹名称, 与apifox一致)",
				type: "string"
			}
		},
		type: "object"
	},
	IApifoxDatasource: {
		additionalProperties: false,
		description: "apifox 数据源配置",
		properties: {
			accessToken: {
				description: "登录态 token (关联 apifox 接口信息, 用于隐式访问 apifox api)",
				type: "string"
			},
			catalog: {
				"default": [
				],
				description: "原始接口列表数据集合, 用于校验选择的项目、接口是否发生过变化, 如果发生了变化, 那么需要提示用户更新引用.",
				items: {
					$ref: "#/definitions/IApifoxCatalog"
				},
				type: "array"
			},
			project: {
				anyOf: [
					{
						additionalProperties: false,
						properties: {
							id: {
								type: "number"
							},
							name: {
								type: "string"
							}
						},
						type: "object"
					},
					{
						items: {
							additionalProperties: false,
							properties: {
								id: {
									type: "number"
								},
								name: {
									type: "string"
								}
							},
							type: "object"
						},
						type: "array"
					}
				],
				description: "哪些项目下的接口参与生成 (注: 允许多个)"
			},
			removeDeprecatedApi: {
				"default": true,
				description: "是否移除已废弃的 api",
				type: "boolean"
			},
			usage: {
				"default": [
				],
				description: "指示哪些接口文件夹参与生成",
				items: {
					$ref: "#/definitions/IApifoxUsage"
				},
				type: "array"
			}
		},
		type: "object"
	},
	IApifoxUsage: {
		additionalProperties: false,
		description: "(apifox) 参与生成的目录配置",
		properties: {
			id: {
				description: "接口文件夹 id 标识",
				type: "number"
			},
			map: {
				description: "目录映射文件名",
				type: "string"
			},
			name: {
				description: "接口文件夹名称 (原始文件夹名称, 与apifox一致)",
				type: "string"
			},
			relate: {
				description: "是否关联当前文件夹下所有的子文件夹",
				type: "boolean"
			}
		},
		type: "object"
	},
	TLanguage: {
		"enum": [
			"js",
			"only-js",
			"ts"
		],
		type: "string"
	}
};
const description = "api-refs 工具生成器配置";
const properties = {
	$schema: {
		"default": "node_modules/api-refs/api-refs.schema.json",
		description: "schema 协议路径",
		type: "string"
	},
	apifox: {
		$ref: "#/definitions/IApifoxDatasource",
		description: "apifox 数据源配置 (当 datasource 值为 apifox 时, 此配置为必填选项)"
	},
	datasource: {
		"const": "apifox",
		description: "指定接口文档数据源",
		type: "string"
	},
	output: {
		additionalProperties: false,
		description: "输出配置",
		properties: {
			appendIndex: {
				"default": true,
				description: "是否添加 index file 公共导出",
				type: "boolean"
			},
			applyImportStatements: {
				"default": "import request from '@/utils/request'",
				description: "请求工具导入语句 (需要满足 IRequest 接口, 即具备 axios / fetch api 特性)",
				type: "string"
			},
			cjs: {
				"default": false,
				description: "是否导出 commonjs 格式文件",
				type: "boolean"
			},
			clear: {
				"default": false,
				description: "是否清理历史文件",
				type: "boolean"
			},
			dir: {
				"default": "./src/apis/",
				description: "导出目录",
				type: "string"
			},
			language: {
				$ref: "#/definitions/TLanguage",
				"default": "ts",
				description: "语言模板"
			},
			responseOnlySuccess: {
				"default": false,
				description: "当出现多种响应结果类型时, 是否仅生成响应成功类型 (条件: code < 400)",
				type: "boolean"
			},
			strict: {
				"default": false,
				description: "是否启用严格模式, 严格模式下, 不允许出现重复的接口定义",
				type: "boolean"
			}
		},
		type: "object"
	},
	showTotal: {
		"default": true,
		description: "调试: 是否打印生成结果的统计信息",
		type: "boolean"
	},
	version: {
		description: "api-refs 工具版本",
		type: "string"
	}
};
const type = "object";
const schema = {
	$schema: $schema,
	additionalProperties: additionalProperties,
	definitions: definitions,
	description: description,
	properties: properties,
	type: type
};

const point = {
  step(msg) {
    console.log("\u{1F4CC} " + msg);
  },
  save(msg) {
    console.log(chalk__default.greenBright(chalk__default.bold("\u2699 "), msg));
  },
  header(msg) {
    msg = chalk__default.hex("#11998e")(boxen__default(msg, { borderStyle: "round", padding: 1, margin: 1 }));
    console.log(msg);
  },
  total(msg) {
    console.log(chalk__default.white("\u{1F6A5}", msg));
  },
  message(msg) {
    console.log(chalk__default.green("\u{1F508}", msg));
  },
  warn(msg) {
    console.log(chalk__default.yellow("\u{1F6A7}", msg));
  },
  error(msg) {
    console.log(chalk__default.red("\u{1F47B}", msg));
  },
  success(msg) {
    console.log(chalk__default.white("\u{1F389}", msg));
  },
  query(msg) {
    console.log(chalk__default.yellow("\u{1F50E}", msg));
  }
};

const enquirer = new Enquirer__default();
enquirer.use((vm) => {
  vm.on("keypress", () => {
  });
  vm.on("cancel", () => process.exit(200));
});
const createMessage = (msg) => {
  return function() {
    if (this?.state?.status === "submitted") {
      return chalk__default.gray(msg);
    } else {
      return msg;
    }
  };
};
const createInputTask = async (opt) => {
  const { input, exec, max, maxErrorMessage } = opt;
  let form;
  let res;
  for (let n = 0; n < (max ?? 3); n++) {
    try {
      form = await input();
      if (!exec)
        return form;
      res = await exec(form);
      return res;
    } catch (error) {
      if (n + 1 !== (max ?? 3))
        point.warn(error.message);
    }
  }
  throw new Error(maxErrorMessage ?? "\u5931\u8D25\u6B21\u6570\u8FC7\u591A, \u811A\u672C\u9000\u51FA");
};
const inputText = async (message, initial) => {
  return await createInputTask({
    input: async () => {
      const { text } = await enquirer.prompt({
        type: "text",
        name: "text",
        message: createMessage(message),
        initial
      });
      return text;
    }
  });
};
const inputBoolean = async (message, initial) => {
  return await createInputTask({
    input: async () => {
      const { text } = await enquirer.prompt({
        type: "confirm",
        name: "text",
        message: createMessage(message),
        initial
      });
      return text;
    }
  });
};
const inputSelect = async (message, choices, initial) => {
  return await createInputTask({
    input: async () => {
      const { text } = await enquirer.prompt({
        type: "select",
        name: "text",
        message: createMessage(message),
        initial,
        choices
      });
      return text;
    }
  });
};
const inputMultiFileNameForm = async (message, form) => {
  return await createInputTask({
    input: async () => {
      const { text } = await enquirer.prompt({
        type: "form",
        name: "text",
        message: createMessage(message),
        choices: form,
        validate(value) {
          const failed = Object.entries(value).reduce((fail, [k, v]) => {
            const name = form.find((item) => item.name.toString() === k)?.message ?? k;
            const val = `${v}`;
            if (val.trim() === "") {
              fail.push([name, "\u7F3A\u5C11\u5FC5\u586B\u9879"].join(": "));
            } else if (/^\.|[\\\\/:*?\"<>|]/gim.test(val)) {
              fail.push([name, `'${v}' \u6587\u4EF6\u547D\u540D\u4E0D\u7B26\u5408\u547D\u540D\u89C4\u5219`].join(": "));
            }
            return fail;
          }, []);
          if (failed.length) {
            return [`\u{1F6A7} \u6821\u9A8C\u5931\u8D25`, chalk__default.yellow(failed.join("\n"))].join("\n");
          }
          return true;
        }
      });
      for (const key in text) {
        if (!text[key] || text[key] === "") {
          text[key] = form.find((f) => f.name === key)?.message;
        }
      }
      return text;
    }
  });
};

class CommandLoadingUtil {
  constructor() {
    this.str = ["\u2588", "\u2587", "\u2586", "\u2585", "\u2584", "\u2583", "\u2582", "\u2581", "\u2582", "\u2583", "\u2584", "\u2585", "\u2587"].map((s) => {
      return chalk__default.hex("#409EFF")(s);
    });
    this.suffix = "\u52A0\u8F7D\u4E2D...";
    this.duration = 120;
    this.n = 0;
  }
  /** 显示 */
  show() {
    this.timer = setInterval(() => this.render(), this.duration);
  }
  /** 销毁 */
  destory() {
    singleLineLog.stdout("");
    clearInterval(this.timer);
  }
  /** 渲染到命令行 */
  render() {
    const index = this.n % this.str.length;
    const out = `${this.str[index]}  ${this.suffix}`;
    singleLineLog.stdout(out);
    this.n++;
  }
}
const asyncLoadingTask = async (task, message) => {
  const util = new CommandLoadingUtil();
  util.suffix = message ?? util.suffix;
  try {
    util.show();
    return await task;
  } finally {
    util.destory();
  }
};

const Base = Enquirer__default.Prompt;
const count = (arr) => (arr ?? []).length;
class TreeSelectPrompt extends Base {
  constructor(options) {
    super(options);
    this.tree = [];
    this.active = 0;
    this.paging = [];
    this.value = options.initial ?? [];
    this.disabled = options.disabled;
    this.relate = options.relate;
    this.tree = this.origin2tree(options.choices ?? [], options.initial ?? []);
    this.on("keypress", () => {
    });
    this.on("cancel", () => process.exit(200));
    this.on("submit", () => {
      let { size } = this.state;
      this.clear(size);
      this.restore();
      return true;
    });
  }
  /** 获取默认状态下, 节点是否展开 */
  getDefaultExpand(choices) {
    const total = (opts) => {
      let t = 0;
      for (const opt of opts) {
        if (opt.children) {
          t++;
          t += total(opt.children);
        }
      }
      return t;
    };
    return total(choices) < 4;
  }
  /** 原始选项转化节点树 */
  origin2tree(choices, initial) {
    let value = [];
    let defaultexpand = this.getDefaultExpand(choices);
    for (const item of choices) {
      let selected = initial.find((i) => i.id === item.id);
      let n = {
        value: item,
        expand: false,
        checked: !!selected
      };
      if (item.children?.length) {
        n.expand = defaultexpand;
        n.children = this.origin2tree(item.children, initial);
        if (this.relate) {
          n.children.unshift({
            relate: true,
            checked: false,
            parent: n
          });
        }
      }
      value.push(n);
    }
    return value;
  }
  /** 节点树转化原始选项 */
  tree2origin(value, parentIsRelated, parentIsChecked) {
    let out = [];
    const skip = !!(parentIsRelated && parentIsChecked);
    for (const item of value) {
      if (item.relate)
        continue;
      if (item.children) {
        const relate = item.children?.find((c) => c.relate);
        const isRelated = !!relate?.checked;
        const hasUnSelect = !!item.children?.some((c) => !c.relate && !c.checked);
        const disabled = this.disabled?.(item);
        if (!isRelated && item.checked && !skip && !disabled) {
          out.push(item.value);
        }
        if (isRelated && !hasUnSelect && !skip && !disabled) {
          out.push({ ...item.value, relate: true });
        }
        out = out.concat(this.tree2origin(item.children, isRelated, !hasUnSelect));
      } else if (item.checked && !skip) {
        out.push(item.value);
      }
    }
    return out;
  }
  /** 上 */
  up() {
    if (this.active > 0) {
      this.active--;
    } else {
      this.active = this.paging.length - 1;
    }
    this.render();
  }
  /** 下 */
  down() {
    if (this.active <= this.paging.length - 1) {
      this.active++;
    } else {
      this.active = 0;
    }
    this.render();
  }
  /** 左 | 收起 */
  left() {
    const n = this.paging.find((_, i) => i === this.active);
    const close = (node) => {
      if (!node)
        return;
      node.expand = false;
      if (node.children) {
        for (const c of node.children)
          close(c);
      }
    };
    close(n?.node);
    this.render();
  }
  /** 右 | 展开 */
  right() {
    const n = this.paging.find((n2, i) => i === this.active);
    if (n && count(n.node.children) > 0) {
      n.node.expand = true;
    }
    this.render();
  }
  /** 切换选中项 */
  space() {
    const select = (n2, state, forceDeep) => {
      if (this.disabled?.(n2))
        return;
      n2.checked = state;
      if (!n2.children?.length)
        return;
      const relate = n2.children.find((c) => c.relate);
      if (!relate || relate.checked || forceDeep) {
        for (const c of n2.children) {
          if (!c.relate || forceDeep) {
            select(c, state, forceDeep);
          }
        }
      }
    };
    const check = (list) => {
      for (const item of list) {
        if (this.disabled && !this.disabled(item)) {
          continue;
        }
        const { children } = item;
        if (!children)
          continue;
        const relateChecked = (children.find((c) => c.relate) ?? { checked: true }).checked;
        if (relateChecked) {
          const hasUnSelect = children.some((c) => !c.relate && !c.checked);
          item.checked = !hasUnSelect;
        }
        check(children);
      }
    };
    const n = this.paging.find((_, i) => i === this.active);
    if (n) {
      select(n.node, !n.node.checked, false);
      if (n.node.relate && n.node.checked) {
        select(n.node.parent, true, true);
      }
    }
    check(this.tree);
    this.value = this.tree2origin(this.tree);
    this.render();
  }
  /** 生成渲染内容 */
  generateList() {
    const a = ["+", "-", "\u2193"];
    const s = [chalk__default.white("\u2B21"), chalk__default.blue("\u2B22"), "", chalk__default.yellowBright("\u2B22")];
    const point = (tree, zIndex = 0) => {
      for (const node of tree) {
        let str = [];
        let index = this.paging.length;
        let prefix = "";
        str.push(new Array(zIndex).fill("  ").join(""));
        if (node.expand) {
          prefix = a[2];
        } else if (count(node.children) > 0) {
          prefix = a[0];
        } else {
          prefix = a[1];
        }
        str.push(prefix);
        if (!this.disabled?.(node)) {
          str.push(node.checked ? node.relate ? s[3] : s[1] : s[0]);
          str.push(" ");
        }
        if (node.relate) {
          str.push(`(${chalk__default[node.checked ? "yellow" : "white"]("\u5173\u8054\u4E0A\u4E00\u7EA7")})`);
        } else {
          str.push(node.value.name);
        }
        let o = str.join(" ");
        this.paging.push({
          node,
          str: index === this.active ? chalk__default.bgGray(o) : o
        });
        if (node.expand && count(node.children) > 0) {
          point(node.children ?? [], zIndex + 1);
        }
      }
    };
    this.paging = [];
    point(this.tree);
    return this.paging.map((p) => p.str).join("\n");
  }
  /** 渲染 */
  async render() {
    let { size } = this.state;
    let prompt = "";
    let header = await this.header();
    if (header?.length) {
      header = chalk__default.hex("#11998e")(boxen__default(header, { borderStyle: "round", padding: 1, margin: 1 }));
    }
    let prefix = await this.prefix();
    let separator = await this.separator();
    let message = await this.message();
    if (this.options.promptLine !== false) {
      prompt = [prefix, message, separator, ""].join(" ");
      this.state.prompt = prompt;
    }
    let help = await this.error() || await this.hint();
    let body = await this.generateList();
    let footer = await this.footer();
    if (help && !prompt.includes(help))
      prompt += " " + help;
    this.clear(size);
    this.write([prompt, header, body, footer].filter(Boolean).join("\n"));
    this.write(this.margin[2]);
    this.restore();
  }
}

const request = axios__default.create({
  baseURL: "https://api.apifox.cn",
  headers: {
    Origin: "https://www.apifox.cn",
    "X-Client-Mode": "web",
    "X-Client-Version": "2.3.2-alpha.5",
    "X-Device-Id": "O2zeTrkS-P5Pp-6ORU-ZGmY-fGOS74J3BDcN",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
  },
  params: { locale: "zh-CN" }
});
request.interceptors.response.use((response) => {
  if (!response.data.success) {
    throw new Error(`'${response.request.url}' \u8BF7\u6C42\u5931\u8D25`);
  }
  response.data = response.data.data;
  return response;
}, (err) => {
  let errMsg = `'${err.config?.url}' \u8BF7\u6C42\u5931\u8D25, \u9519\u8BEF\u7801: ${err.code}. \u8BF7\u68C0\u67E5\u7F51\u7EDC\u8BBE\u7F6E, \u5173\u95ED\u4EE3\u7406\u6216vpn.`;
  point.error("\n" + errMsg);
  process.exit(200);
});
const apis$1 = {
  /** 登录 */
  async login(form) {
    return await request({ method: "POST", url: "/api/v1/login", data: form });
  },
  /** 加载用户所有的组织 */
  async userTeams(token) {
    return request({
      url: "/api/v1/user-teams",
      headers: { Authorization: token }
    });
  },
  /** 加载用户所有的项目 */
  async userProjects(token) {
    return request({
      url: "/api/v1/user-projects",
      headers: { Authorization: token }
    });
  },
  async projectMembers(token, projectId, teamId) {
    return request({
      url: "/api/v1/project-members",
      headers: { Authorization: token, "X-Project-Id": projectId },
      params: { teamId }
    });
  },
  /** 加载项目文件夹、接口结构树 */
  async apiTreeList(token, projectId) {
    return request({
      url: "/api/v1/api-tree-list",
      headers: { Authorization: token, "X-Project-Id": projectId }
    });
  },
  /** 加载接口详情 */
  async apiDetails(token, projectId) {
    return request({
      url: "/api/v1/api-details",
      headers: { Authorization: token, "X-Project-Id": projectId }
    });
  },
  /** 加载 api Schema 引用 */
  async apiSchemas(token, projectId) {
    return request({
      url: "/api/v1/api-schemas",
      headers: { Authorization: token, "X-Project-Id": projectId }
    });
  }
};

const mergeArray = (origin, isDeduped) => {
  let output = [];
  for (const arr of origin) {
    for (const n of arr ?? []) {
      if (!output.some((o) => isDeduped(o, n))) {
        output.push(n);
      }
    }
  }
  return output;
};
const parametersToJSONSchema7 = (params) => {
  const schema = {
    type: "object",
    properties: {},
    required: []
  };
  if (!params?.length)
    return void 0;
  for (const { name, type, description, example, required } of params) {
    schema.properties[name] = {
      type,
      description,
      default: example
    };
    if (required) {
      schema.required.push(name);
    }
  }
  return schema;
};
const mappingJSONSchemaRef = (schema, refs) => {
  if (!schema.definitions)
    schema.definitions = {};
  for (const { id, jsonSchema } of refs) {
    schema.definitions[id] = jsonSchema;
  }
  return schema;
};

const filterUsedApi = (tree, used, otherUsed) => {
  if (used.id === -1) {
    return tree.filter((node) => node.type === "apiDetail").map((node) => {
      return {
        node,
        paths: []
      };
    });
  }
  const findCheckedFolder = (cTree, parent) => {
    let output;
    for (const node of cTree) {
      const id = Number(node.key.split(".")[1]);
      if (node.type === "apiDetailFolder") {
        if (id === used.id) {
          output = [...parent, node];
          break;
        }
        const folder2 = findCheckedFolder(node.children, parent.concat(node));
        if (folder2) {
          output = folder2;
          break;
        }
      }
    }
    return output;
  };
  const deepApi = (cTree, parent) => {
    let output = [];
    for (const node of cTree.children) {
      const id = Number(node.key.split(".")[1]);
      if (node.type === "apiDetail") {
        output.push({ node, paths: parent });
      } else if (!otherUsed.some((u) => u.id === id) && used.relate) {
        output = output.concat(deepApi(node, parent.concat(node)));
      }
    }
    return output;
  };
  const folder = findCheckedFolder(tree, []);
  if (folder?.length) {
    const last = folder[folder.length - 1];
    return deepApi(last, folder);
  }
  return [];
};
const transformRequestObject = (detail, schemas, projectName) => {
  const { commonParameters, parameters } = detail;
  const isDeduped = (a, b) => a.id === b.id;
  const mergedParameters = {
    query: mergeArray([commonParameters?.path, commonParameters?.query, parameters?.path, parameters?.query], isDeduped),
    // @chagne 2023年7月10日 11:01:50 变更: 考虑到实际使用场景, cookie 和 header的公共参数最好是方法方法实例内写入, 这里可以忽略
    cookie: parameters?.cookie,
    header: parameters?.header
  };
  let auth;
  if (detail.auth) {
    switch (detail.auth.type) {
      case "noauth":
      case void 0:
        break;
      case "apikey":
        if (!detail.auth.apikey)
          break;
        mergedParameters[detail.auth.apikey.in].push({
          id: "Auth",
          name: detail.auth.apikey.key,
          required: false,
          description: "Auth",
          type: "string",
          enable: true,
          example: detail.auth.apikey.value
        });
        break;
      case "bearer":
        if (!detail.auth.bearer)
          break;
        mergedParameters.header.push({
          id: "Auth",
          name: "Authorization",
          required: false,
          description: "Auth",
          type: "string",
          enable: true,
          example: detail.auth.bearer.token
        });
        break;
      case "basic":
        auth = detail.auth.basic;
        break;
      default:
        point.warn(`\u8BF7\u6CE8\u610F, \u9879\u76EE <${projectName}> \u4E0B\u7684\u63A5\u53E3 '${detail.path}' \u914D\u7F6E\u7684 Auth \u7C7B\u578B\u4E0D\u53D7\u652F\u6301`);
        break;
    }
  }
  const requestObject = {
    /** header 参数 */
    header: parametersToJSONSchema7(mergedParameters.header),
    /** cookie 参数 */
    cookie: parametersToJSONSchema7(mergedParameters.cookie),
    /** params 参数 */
    params: parametersToJSONSchema7(mergedParameters.query),
    /** auth 鉴权 (一般接口不定义, 算是预留吧) */
    auth,
    /** body 参数 */
    body: void 0
  };
  if (requestObject.header)
    requestObject.header.additionalProperties = true;
  if (detail.requestBody) {
    switch (detail.requestBody.type) {
      case "multipart/form-data":
      case "application/x-www-form-urlencoded":
        requestObject.body = {
          type: detail.requestBody.type,
          data: parametersToJSONSchema7(detail.requestBody.parameters)
        };
        break;
      case "application/json":
      case "application/x-msgpack":
      case "application/xml":
        requestObject.body = {
          type: detail.requestBody.type,
          data: mappingJSONSchemaRef(detail.requestBody.jsonSchema, schemas)
        };
        break;
      case "text/plain":
        requestObject.body = {
          type: detail.requestBody.type,
          data: {
            type: "string",
            description: detail.requestBody.description,
            default: detail.requestBody.example
          }
        };
        break;
      default:
        requestObject.body = {
          type: detail.requestBody.type,
          data: {}
        };
        break;
    }
  }
  return requestObject;
};
const transformResponseObject = (detail, responseOnlySuccess, schemas) => {
  const { responses } = detail;
  const responseObject = [];
  for (const resp of responses) {
    if (responseOnlySuccess && Number(resp.code) >= 400) {
      continue;
    }
    responseObject.push({
      statusCode: resp.code,
      statusName: resp.name,
      type: resp.contentType,
      data: mappingJSONSchemaRef(resp.jsonSchema, schemas)
    });
  }
  return responseObject;
};
const transformToIApi = (opts) => {
  const { projectId, projectName, project, used, apis, output, removeDeprecatedApi } = opts;
  const { details, schemas, projectMembers } = project;
  const { dir, responseOnlySuccess, language } = output;
  const out = [];
  for (const api of apis) {
    let outFile;
    let method;
    let url;
    let requestObject;
    let responseObject;
    let comment;
    let pathParams;
    let fn = used.map ?? used.name;
    if ([".ts", ".js"].includes(np__default.extname(fn))) {
      fn = np__default.basename(fn, np__default.extname(fn));
    }
    fn += `.${language === "ts" ? "ts" : "js"}`;
    const id = Number(api.node.key.split(".")[1]);
    const detail = details.find((d) => d.id === id);
    if (removeDeprecatedApi && ["deprecated", "obsolete"].includes(detail.status)) {
      continue;
    }
    const authors = projectMembers.filter((m) => [detail.creatorId, detail.editorId, detail.responsibleId].includes(m.userId)).map((m) => {
      return { name: m.nickname };
    });
    outFile = {
      name: used.name,
      map: used.map ?? used.name,
      path: np__default.normalize(np__default.join(dir, fn)),
      project: [`[${projectName}](https://www.apifox.cn/web/project/${projectId})`]
    };
    method = detail.method.toLowerCase();
    url = detail.path;
    requestObject = transformRequestObject(detail, schemas, projectName);
    responseObject = transformResponseObject(detail, responseOnlySuccess, schemas);
    comment = {
      /** 接口名称 */
      name: detail.name,
      /** 上次更新时间 */
      updateAt: detail.updatedAt,
      /** 文件夹路径 (中文) */
      folder: "/" + api.paths.map((f) => f.name).join("/"),
      /** 描述信息 */
      desc: detail.description,
      /** 接口文档链接 */
      link: `https://app.apifox.com/link/project/${projectId}/apis/api-${id}`,
      /** 标签 */
      tags: detail.tags,
      /** 接口状态 */
      status: detail.status,
      /** 作者 */
      author: authors
    };
    if (/[\$]{0,1}\{.+?\}/.test(url)) {
      pathParams = url.match(/[\$]{0,1}\{(.+?)\}/g).map((s) => s.match(/[\$]{0,1}\{(.+?)\}/)[1]);
      url = url.replace(/[\$]{0,1}\{(.+?)\}/, (_, $1) => "${" + $1 + "}");
    }
    out.push({ outFile, method, url, requestObject, responseObject, comment, pathParams });
  }
  return out;
};
const transform = (options, config, projects) => {
  let output = [];
  for (const projectId in options) {
    const project = options[projectId];
    const projectName = projects.find((p) => Number(p.id) === Number(projectId))?.name;
    const usage = config.apifox?.usage ?? [];
    const removeDeprecatedApi = config.apifox.removeDeprecatedApi !== false;
    for (const used of usage) {
      const otherUsed = usage.filter((u) => u !== used);
      const apis = filterUsedApi(project.treeList, used, otherUsed);
      output = output.concat(transformToIApi({
        projectId,
        projectName,
        project,
        used,
        apis,
        output: config.output,
        removeDeprecatedApi
      }));
    }
  }
  return output;
};

const inputLoginForm = async () => {
  return await createInputTask({
    input: async () => {
      const loginType = await inputSelect("\u9009\u62E9apifox\u767B\u5F55\u65B9\u5F0F", ["\u90AE\u7BB1", "\u624B\u673A\u53F7"], "\u90AE\u7BB1");
      let input;
      if (loginType === "\u624B\u673A\u53F7") {
        input = await enquirer.prompt({
          type: "form",
          name: "form",
          message: createMessage("launch login..."),
          choices: [
            { name: "account", message: "\u624B\u673A\u53F7 (+86):" },
            { name: "password", message: "\u5BC6\u7801" }
          ],
          result(value) {
            value.account = "+86 " + value.account;
            value.mobile = value.account;
            value.loginType = "MobilePassword";
            return value;
          }
        });
      } else {
        input = await enquirer.prompt({
          type: "form",
          name: "form",
          message: createMessage("launch login..."),
          choices: [
            { name: "account", message: "\u8D26\u53F7/\u90AE\u7BB1" },
            { name: "password", message: "\u5BC6\u7801" }
          ],
          result(value) {
            value.loginType = "EmailPassword";
            return value;
          }
        });
      }
      return input.form;
    },
    exec: async (form) => {
      const res = await apis$1.login(form);
      return res.data.accessToken;
    }
  });
};
const checkFolderIsChanged = (n, o) => {
  const flat = (tree) => {
    const out = [];
    return tree.reduce((list, current) => {
      list.push(current);
      if (current.children) {
        let children = flat(current.children);
        return [...list, ...children];
      } else {
        return list;
      }
    }, out);
  };
  const a = flat(n);
  const b = flat(o);
  const differenceSet = a.filter((i1) => {
    return !b.some((i2) => i2.id === i1.id);
  });
  return differenceSet.length > 0;
};
const parset = async (config) => {
  let token;
  let projects;
  if (!config.apifox)
    config.apifox = {};
  if (!config.apifox.accessToken) {
    config.apifox.accessToken = await inputLoginForm();
  }
  token = config.apifox.accessToken;
  const [res1, res2] = await asyncLoadingTask(Promise.all([apis$1.userTeams(token), apis$1.userProjects(token)]), "\u6B63\u5728\u52A0\u8F7D\u53EF\u9009\u9879\u76EE...");
  if (config.apifox.project instanceof Array) {
    projects = config.apifox.project;
  } else if (config.apifox.project?.id) {
    projects = [config.apifox.project];
  } else {
    projects = [];
  }
  projects = projects.filter((o) => !!res2.data.find((n) => n.id === o.id));
  if (projects.length === 0) {
    const tree = res1.data.map((node) => {
      return {
        id: node.id,
        name: node.name,
        children: res2.data.filter((proj) => proj.teamId === node.id).map((proj) => {
          return { id: proj.id, name: proj.name };
        })
      };
    });
    projects = await new TreeSelectPrompt({
      message: "\u9009\u62E9\u9879\u76EE",
      choices: tree,
      disabled: (node) => !!node.children
    }).run();
  }
  if (projects.length === 0) {
    point.warn("\u672A\u9009\u62E9\u4EFB\u4F55\u9879\u76EE, \u7A0B\u5E8F\u9000\u51FA");
    process.exit(200);
  }
  config.apifox.project = projects.length > 1 ? projects : projects[0];
  const origin = {};
  const getTeamId = (projectId) => {
    return res2.data.find((proj) => proj.id === Number(projectId)).teamId;
  };
  for (const { id: projectId } of projects) {
    const [r1, r2, r3, r4] = await asyncLoadingTask(Promise.all([
      apis$1.apiTreeList(token, projectId),
      apis$1.apiDetails(token, projectId),
      apis$1.apiSchemas(token, projectId),
      apis$1.projectMembers(token, projectId, getTeamId(projectId))
    ]), `\u6B63\u5728\u83B7\u53D6 '${chalk__default.green(res2.data.find((p) => p.id === projectId)?.name)}' \u9879\u76EE\u63A5\u53E3\u6570\u636E...`);
    origin[projectId] = {
      treeList: r1.data,
      details: r2.data,
      schemas: r3.data,
      projectMembers: r4.data
    };
  }
  const treeList = Object.values(origin).reduce((all, { treeList: treeList2 }) => all.concat(treeList2), []);
  const transformFolder = (tree) => {
    let folders = [];
    for (const node of tree) {
      if (node.type !== "apiDetailFolder")
        continue;
      let catalog2;
      if (node.folder) {
        catalog2 = {
          id: node.folder.id,
          name: node.folder.name
        };
      } else if (node.id) {
        catalog2 = { id: node.id, name: node.name };
      }
      if (!catalog2)
        continue;
      if (node.children.length) {
        const children = transformFolder(node.children);
        if (children.length)
          catalog2.children = children;
      }
      folders.push(catalog2);
    }
    return folders;
  };
  const appendRootFolder = (catalog2, tree) => {
    if (tree.some((node) => node.type === "apiDetail")) {
      catalog2.unshift({ id: -1, name: "(\u6839\u76EE\u5F55)" });
    }
  };
  const catalog = transformFolder(treeList);
  appendRootFolder(catalog, treeList);
  point.step("\u68C0\u67E5\u914D\u7F6E");
  const changed = checkFolderIsChanged(catalog, config.apifox.catalog ?? []);
  let usage = config.apifox.usage ?? [];
  if (usage.length === 0 || changed) {
    usage = await new TreeSelectPrompt({
      message: "\u9009\u62E9\u53C2\u4E0E\u751F\u6210\u7684\u63A5\u53E3\u6587\u4EF6\u5939",
      choices: lite.klona(catalog),
      header: changed ? chalk__default.yellow("\u{1F6A7} ", chalk__default.white("apifox \u6587\u6863\u53D1\u751F\u4E86\u53D8\u5316, \u8BF7\u91CD\u65B0\u786E\u8BA4\u751F\u6210\u5185\u5BB9")) : void 0,
      initial: config.apifox.usage ?? [],
      relate: true
    }).run();
  }
  for (const u of usage) {
    delete u["children"];
  }
  if (usage.find((u) => typeof u.map === "undefined")) {
    const originUsage = config.apifox.usage ?? [];
    const map = await inputMultiFileNameForm("\u8BBE\u7F6E\u63A5\u53E3\u6620\u5C04\u6587\u4EF6\u540D (Tips: \u9700\u8981\u9075\u5FAA\u6587\u4EF6\u547D\u540D\u89C4\u5219, \u91CD\u590D\u547D\u540D\u5C06\u751F\u6210\u5230\u540C\u4E00\u6587\u4EF6\u5185)", usage.map((u) => {
      return {
        name: u.id,
        message: u.name,
        initial: originUsage.find((ou) => ou.id === u.id)?.map
      };
    }));
    for (const u of usage) {
      u.map = map[u.id];
    }
  }
  config.apifox.catalog = catalog;
  config.apifox.usage = usage;
  const details = Object.values(origin).reduce((total, { details: details2 }) => {
    return [...total, ...details2];
  }, []);
  if (config.apifox.removeDeprecatedApi === void 0 && details.find((d) => ["deprecated", "obsolete"].includes(d.status))) {
    const strategy = await inputSelect("\u5B58\u5728\u5E9F\u5F03\u63A5\u53E3, \u8BBE\u7F6E\u5E9F\u5F03\u63A5\u53E3\u5904\u7406\u7B56\u7565 (\u5305\u542B: \u5C06\u5E9F\u5F03\u3001\u5DF2\u5E9F\u5F03 \u6807\u8BB0)", ["\u79FB\u9664", "\u4FDD\u7559"], "\u79FB\u9664");
    config.apifox.removeDeprecatedApi = strategy === "\u79FB\u9664";
  }
  point.step("\u539F\u59CB\u6570\u636E\u8F6C\u6362");
  return transform(origin, config, projects);
};

const isUndefined = (val) => typeof val === "undefined";

const upgrade = {};

const parsets = {
  apifox: parset
};
const initialConfig = () => {
  return {
    $schema: "./api-refs.schema.json",
    version: pkg.version,
    datasource: "apifox"
    // Tips: 如果后面集成了多个平台, 这里需要改成留空
  };
};
const readyJsonSync = (jsonFilePath, parseFailed) => {
  try {
    if (!fs__default.existsSync(jsonFilePath))
      return parseFailed;
    let jsonData = fs__default.readFileSync(jsonFilePath, {
      encoding: "utf-8"
    });
    jsonData = prettier__default.format(jsonData, { parser: "json" });
    return JSON.parse(jsonData);
  } catch (error) {
    return parseFailed;
  }
};
const parseConfig = (configFilePath, reset) => {
  const config = reset ? initialConfig() : readyJsonSync(configFilePath, initialConfig());
  const instance = new Ajv__default({
    allowUnionTypes: true,
    allErrors: true,
    messages: false
  });
  instance.validateSchema(schema);
  if (!instance.validate(schema, config)) {
    const skipRules = ["required"];
    for (const { instancePath, keyword, params } of instance.errors ?? []) {
      if (skipRules.includes(keyword))
        continue;
      const key = instancePath.split("/").filter((s) => s !== "").concat([params.additionalProperty]).join(".");
      if (upgrade[key]) {
        set__default(config, key, upgrade[key](get__default(config, key)));
      } else {
        set__default(config, key, void 0);
      }
    }
  }
  return config;
};
const findSchemaFilePath = (schema2) => {
  const dirs = [
    "./api-refs.schema.json",
    "node_modules/api-refs/api-refs.schema.json",
    "api-refs/api-refs.schema.json"
  ];
  const url = `https://unpkg.com/api-refs@${pkg.version}/api-refs.schema.json`;
  if (schema2 && fs__default.existsSync(schema2))
    return schema2;
  const dir = dirs.find((dir2) => fs__default.existsSync(dir2));
  return dir || url;
};
const inputConfigAndLoadApis = async (config) => {
  let next = false;
  point.step("\u68C0\u67E5\u5DE5\u5177\u7248\u672C");
  config.$schema = findSchemaFilePath(config.$schema);
  if (!config.version) {
    point.warn(`\u914D\u7F6E\u4E2D, \u7F3A\u5C11 'version', \u65E0\u6CD5\u6821\u9A8C\u662F\u5426\u56E0\u5DE5\u5177\u66F4\u65B0\u5BFC\u81F4\u751F\u6210\u7ED3\u679C\u5DEE\u5F02, \u8BF7\u77E5\u6089~`);
    config.version = pkg.version;
  } else {
    const [x1] = config.version.split(".");
    const [x2] = pkg.version.split(".");
    if (x1 !== x2) {
      next = await inputBoolean("api-refs \u5DE5\u5177\u53D1\u73B0\u5927\u7248\u672C\u66F4\u65B0, \u65B0\u7248\u672C\u751F\u6210\u7ED3\u679C\u53EF\u80FD\u4E0E\u65E7\u7248\u672C\u4EA7\u751F\u8F83\u5927\u5DEE\u5F02, \u662F\u5426\u7EE7\u7EED\u751F\u6210?");
      if (!next)
        process.exit();
    }
  }
  point.step("\u8BBE\u7F6E\u751F\u6210\u7B56\u7565");
  let output = {};
  if (config.output) {
    output = config.output;
  }
  if (isUndefined(output.language)) {
    output.language = await inputSelect("\u9009\u62E9\u751F\u6210\u8BED\u8A00\u6A21\u677F", ["ts", "js", "only-js"], "ts");
  }
  if (isUndefined(output.dir)) {
    output.dir = await inputText("\u8F93\u5165\u5BFC\u51FA\u76EE\u5F55", "./src/apis");
  }
  if (isUndefined(output.appendIndex)) {
    output.appendIndex = await inputBoolean("\u9009\u62E9\u662F\u5426\u6DFB\u52A0 index file \u516C\u5171\u5BFC\u51FA", true);
  }
  if (isUndefined(output.applyImportStatements)) {
    output.applyImportStatements = await inputText("\u8BBE\u7F6E\u5BFC\u5165\u8BED\u53E5 (\u5982\u679C\u4E0D\u9700\u8981\u4FEE\u6539\u53EF\u5FFD\u7565)", "import request from '@/utils/request'");
  }
  config.output = output;
  point.step("\u52A0\u8F7D\u6570\u636E\u6E90");
  if (!config.datasource) {
    config.datasource = await inputSelect("\u9009\u62E9\u6570\u636E\u6E90", ["apifox"], "apifox");
  }
  const parset = parsets[config.datasource];
  const apis = await parset(config);
  return apis;
};

const parseImportStatement = (importStatement = `import request from '@/utils/request'`) => {
  const isImportStatement = /import.+?from[ ]{1,}['"](.+?)['"]/.test(importStatement);
  const isRequireStatement = /[const|let|var] .+?=[ ]{0,}require\(.+?\)/.test(importStatement);
  const matchUtil = (req, statmentType) => {
    const util = req.match(/\{(.+?)\}/) ? req.match(/\{(.+?)\}/)[1] : req;
    if (util.split(",").length > 1) {
      point.error(`${statmentType} \u8BED\u53E5\u4EC5\u5141\u8BB8\u5BFC\u5165\u4E00\u4E2A\u53D8\u91CF, \u8BF7\u68C0\u67E5\u914D\u7F6E\u9879 'output.applyImportStatements'`);
    }
    return util;
  };
  if (isImportStatement) {
    const [, req] = importStatement.match(/import(.+?)from ['"](.+?)['"]/);
    return { requestUtil: matchUtil(req, "import"), importStatement };
  } else if (isRequireStatement) {
    const [, req] = importStatement.match(/[const|let|var] (.+?)=[ ]{0,}require\(.+?\)/);
    return { requestUtil: matchUtil(req, "require"), importStatement };
  } else {
    point.error("import \u8BED\u53E5\u89E3\u6790\u5931\u8D25, \u8BF7\u68C0\u67E5\u914D\u7F6E\u9879 'output.applyImportStatements' ");
    process.exit(200);
  }
};

const calcDefaultContentType = (apis) => {
  return apis.reduce((total, api) => {
    if (api.requestObject.body?.type) {
      const ct = total.find(([contentType]) => contentType === api.requestObject.body.type);
      if (ct) {
        ct[1] += 1;
      } else {
        total.push([api.requestObject.body.type, 1]);
      }
    }
    return total;
  }, []).sort((a, b) => b[1] - a[1])[0][0];
};

const strictCheck = (apis, config) => {
  if (!config.output?.strict) {
    return;
  }
  const repetitive = apis.reduce((total, api) => {
    const u = total.find((t) => t[0] === api.url);
    if (u) {
      u[1]++;
    } else {
      total.push([api.url, 0]);
    }
    return total;
  }, []).filter(([, count]) => {
    return count > 0;
  });
  if (repetitive.length > 0) {
    for (const [api, count] of repetitive) {
      point.warn(`\u63A5\u53E3 '${api}' \u5B58\u5728\u91CD\u590D\u5B9A\u4E49 (\u51FA\u73B0 ${count} \u6B21), \u5982\u679C\u8FD9\u662F\u7B26\u5408\u9884\u671F\u7684, \u8BF7\u5173\u95ED\u4E25\u683C\u6A21\u5F0F(output.strict)\u540E\u91CD\u65B0\u751F\u6210.`);
    }
    process.exit(200);
  }
};

const RESEVED_KEYWORD_MAP = [
  "abstract",
  "arguments",
  "await",
  "boolean",
  "break",
  "byte",
  "case",
  "catch",
  "char",
  "class",
  "const",
  "continue",
  "debugger",
  "default",
  "delete",
  "do",
  "double",
  "else",
  "enum",
  "eval",
  "export",
  "extends",
  "false",
  "final",
  "finally",
  "float",
  "for",
  "function",
  "goto",
  "if",
  "implements",
  "import",
  "in",
  "instanceof",
  "int",
  "interface",
  "let",
  "long",
  "native",
  "new",
  "null",
  "package",
  "private",
  "protected",
  "public",
  "return",
  "short",
  "static",
  "super",
  "switch",
  "synchronized",
  "this",
  "throw",
  "throws",
  "transient",
  "true",
  "try",
  "typeof",
  "var",
  "void",
  "volatile",
  "while",
  "with",
  "yield",
  // ts 保留关键字
  "interface",
  "enum",
  "implements",
  "extends",
  "namespace",
  "module",
  "async",
  "in",
  "of",
  "symbol",
  "never"
];

const urlLastParagraph = (url) => {
  const paragraphs = url.split("/");
  const paragraph = paragraphs.reverse().reduce((out, paragraph2) => {
    if (out)
      return out;
    if (/[\$]{0,1}\{.+?\}/.test(paragraph2))
      return null;
    return paragraph2;
  }, null);
  return paragraph;
};
const splitLongNameByPath = (str, max) => {
  const tmp = str.split("/");
  if (tmp.length > max) {
    return tmp.slice(tmp.length - max, tmp.length).join("/");
  } else {
    return str;
  }
};
const splitLongCamelCaseNameByPath = (str, max) => {
  const tmp = str.split("/");
  let count = 0;
  let out = [];
  for (let n = tmp.length - 1; n >= 0; n--) {
    if (count >= max)
      break;
    const block = tmp[n];
    const matched = block.match(/(?![a-z0-9])/g);
    count += matched?.length ?? 0;
    out.unshift(block);
  }
  return out.join("/");
};
const formatNameSuffixByDuplicate = (name, duplicate) => {
  if (!duplicate[name]) {
    duplicate[name] = 1;
  } else {
    duplicate[name]++;
  }
  if (duplicate[name] === 1) {
    return name;
  } else {
    const newName = name + (duplicate[name] - 1);
    if (duplicate[newName]) {
      return formatNameSuffixByDuplicate(name, duplicate);
    } else {
      return newName;
    }
  }
};
const formatNameByDisabledKeyword = (name, method) => {
  try {
    if (RESEVED_KEYWORD_MAP.includes(name))
      throw new Error("\u5360\u7528\u4E86\u7CFB\u7EDF\u5173\u952E\u5B57");
    return name;
  } catch (error) {
    return changeCase.camelCase(method + "_" + name);
  }
};
const checkApisHasSingleWordOrDuplicatedName = (apis) => {
  let names = /* @__PURE__ */ new Set();
  let paragraph;
  for (let api of apis) {
    paragraph = urlLastParagraph(api.url);
    if (!paragraph)
      continue;
    if (names.has(paragraph) || !/[A-Z-]/.test(paragraph)) {
      return true;
    }
    names.add(paragraph);
  }
  return false;
};
const createFunctionNameFactory = (apis) => {
  const duplicate = {};
  const repeatedUrlTail = checkApisHasSingleWordOrDuplicatedName(apis);
  return {
    /**
     * 生成接口方法名
     *
     * @param api api接口
     */
    generate(api) {
      const { method, url } = api;
      return [
        // 1. (预处理) 当尾段url不重复时, 生成更简短的命名
        (str) => !repeatedUrlTail ? urlLastParagraph(str) ?? str : str,
        // 2. (预处理) 移除路径中的 Restful Api 参数
        (str) => str.replace(/[\$]{0,1}\{.+?\}/g, ""),
        // 3. (预处理) 裁剪超长路径名
        (str) => splitLongNameByPath(str, 3),
        // 4. (预处理) 裁剪接口命名词汇超过3个单词的命名
        (str) => splitLongCamelCaseNameByPath(str, 3),
        // 5. 删除路径中的起始斜杠(/)
        (str) => str.replace(/^[\/]+/g, ""),
        // 6. 将 Relative Path 的分隔符(/) 转化为下划线
        (str) => str.replace(/[\/]+/g, "_"),
        // 7. 转换为驼峰格式命名
        (str) => changeCase.camelCase(str),
        // 8. (后处理) 处理路径命名的Js关键词占用
        (str) => formatNameByDisabledKeyword(str, method),
        // 9. (后处理) 重复接口路径处理
        (str) => formatNameSuffixByDuplicate(str, duplicate)
      ].reduce((name, format) => format(name), url);
    }
  };
};

const prettierConfig = {
  singleQuote: true,
  printWidth: 120,
  tabWidth: 4,
  semi: false,
  trailingComma: "none"
};

const JSONSchemaGenerateOptions = {
  additionalProperties: false,
  bannerComment: "",
  declareExternallyReferenced: false,
  enableConstEnums: false,
  maxItems: -1,
  strictIndexSignatures: true,
  style: prettierConfig,
  unreachableDefinitions: false,
  unknownAny: false
};
const deepFix = (jsonSchema, transform) => {
  const deep = (schema) => {
    if (typeof schema === "boolean")
      return;
    transform(schema);
    switch (schema.type) {
      case "object":
        for (const key in schema.properties) {
          const property = schema.properties[key];
          deep(property);
        }
        break;
      case "array":
        for (const item of schema.items instanceof Array ? schema.items : [schema.items]) {
          deep(item);
        }
        break;
    }
  };
  deep(jsonSchema);
};
const jsonSchemaToTsInterface = (jsonSchema, typeName) => {
  deepFix(jsonSchema, (schema) => {
    if (!!schema.description) {
      schema.description += `

`;
    } else {
      schema.description = "";
    }
    if (schema.title) {
      schema.description += `@name ${schema.title}
`;
      delete schema.title;
    }
    if (schema.default) {
      schema.description += `@default ${schema.default}
`;
      delete schema.default;
    }
    if (schema.examples) {
      schema.description += `@examples ${schema.examples}
`;
      delete schema.examples;
    }
    schema.description = schema.description.trim();
  });
  return jsonSchemaToTypescript.compile(jsonSchema, typeName, JSONSchemaGenerateOptions);
};

const createIntfName = (functionName, intfType, index = 0) => {
  return `I${changeCase.pascalCase(functionName)}${changeCase.pascalCase(intfType)}${index > 0 ? index : ""}`;
};
const createComment = (comment) => {
  let description = [];
  for (const c of comment) {
    if (c === void 0)
      continue;
    if (typeof c === "string")
      description.push(c);
    else
      description.push(`@${c[0]} ${c[1]}`);
  }
  return description.join("\n");
};
const appendComment = (schema, comment) => {
  schema.description = createComment(comment);
};
const createFunctionParamsIntf = async (api, functionName) => {
  const code = [];
  const refs = [];
  if (api.requestObject.params) {
    appendComment(api.requestObject.params, [
      `request params | ${api.comment.name}`,
      "",
      ["function", functionName],
      api.pathParams ? ["description", "\u5B58\u5728 url path params"] : void 0
    ]);
    const intf = createIntfName(functionName, "params");
    const params = await jsonSchemaToTsInterface(api.requestObject.params, intf);
    code.push(params);
    refs.push({ key: "params", intf });
  }
  if (api.requestObject.body) {
    appendComment(api.requestObject.body.data, [
      `request body | ${api.comment.name}`,
      "",
      ["function", functionName],
      ["ContentType", api.requestObject.body.type]
    ]);
    const intf = createIntfName(functionName, "data");
    const data = await jsonSchemaToTsInterface(api.requestObject.body.data, intf);
    code.push(data);
    refs.push({ key: "data", intf });
  }
  if (api.requestObject.header) {
    appendComment(api.requestObject.body.data, [
      `request header | ${api.comment.name}`,
      "",
      ["function", functionName]
    ]);
    const intf = createIntfName(functionName, "header");
    const headers = await jsonSchemaToTsInterface(api.requestObject.header, intf);
    code.push(headers);
    refs.push({ key: "headers", intf });
  }
  if (api.requestObject.cookie) {
    appendComment(api.requestObject.cookie, [
      `request cookie | ${api.comment.name}`,
      "",
      ["function", functionName]
    ]);
    const intf = createIntfName(functionName, "cookie");
    const cookie = await jsonSchemaToTsInterface(api.requestObject.cookie, intf);
    code.push(cookie);
    refs.push({ key: "cookie", intf });
  }
  if (api.requestObject.auth) {
    code.push(`export type IAuth = { username: string; password: string }`);
    refs.push({ key: "auth", intf: "IAuth" });
  }
  return { code, refs };
};
const createFunctionResponseInterface = async (api, functionName, config) => {
  const code = [];
  const refs = [];
  const ro = api.responseObject ?? [];
  for (let n = 0, len = ro.length; n < len; n++) {
    const { statusCode, statusName, type, data } = ro[n];
    if (config.output.responseOnlySuccess && Number(statusCode) >= 400) {
      continue;
    }
    if (type !== "json") {
      continue;
    }
    appendComment(data, [
      `response | ${api.comment.name}`,
      "",
      ["function", functionName],
      ["status", `(${statusCode}) ${statusName}`],
      ["responseType", type]
    ]);
    const intf = createIntfName(functionName, "response", n);
    const response = await jsonSchemaToTsInterface(data, intf);
    code.push(response);
    refs.push(intf);
  }
  for (const { type } of ro) {
    switch (type) {
      case "binary":
        refs.push("void");
        break;
      case "xml":
      case "raw":
      case "html":
        refs.push("string");
        break;
    }
  }
  return { code, refs };
};
const createFunctionComment = (api) => {
  const authors = api.comment.author.map((a) => {
    if (a.name && a.email)
      return `${a.name} <${a.email}>`;
    return a.name ?? a.email;
  }).join(" ");
  let functionComment = [
    api.comment.name,
    "",
    ["link", api.comment.link],
    ["description", api.comment.desc],
    ["tags", api.comment.tags?.join("\u3001 ")],
    ["updateAt", api.comment.updateAt],
    ["author", authors]
  ].filter((c) => !(c instanceof Array) || !!c[1] && c[1] !== "").map((c) => ` * ${c instanceof Array ? `@${c[0]} ${c[1]}` : c}`).join("\n");
  functionComment = `/** 
${functionComment}
 */`;
  return functionComment;
};
const transformFunctionParamsRefCode = (paramsRefs) => {
  let paramsRefCode = ``;
  let deconstructExpression = ``;
  if (paramsRefs.length > 2) {
    paramsRefCode = `options: {
            ${paramsRefs.map(({ key, intf }) => `${key}: ${intf}`).join("; \n")}
        }`;
    deconstructExpression = `const { ${paramsRefs.map((ref) => ref.key).join(", ")} } = options`;
  } else {
    paramsRefCode = paramsRefs.map(({ key, intf }) => `${key}: ${intf}`).join(", ");
  }
  return { paramsRefCode, deconstructExpression };
};
const parseHeader = (paramsRefs, customContentType) => {
  const hasCookie = paramsRefs.some((ref) => ref.key === "cookie");
  const hasHeaders = paramsRefs.some((ref) => ref.key === "headers");
  const kv = [];
  const res = [];
  if (hasCookie) {
    res.push(`const cookieHeader: string = cookieToHeaderValue(cookie)`);
    kv.push(["Cookie", "cookieHeader"]);
  }
  if (customContentType) {
    kv.push(["Content-Type", `'${customContentType}'`]);
  }
  if (kv.length) {
    if (!hasHeaders) {
      res.push(`const headers: { [key:string]: any } = {}`);
    }
    for (const [key, value] of kv)
      res.push(`headers['${key}'] = ${value}`);
  }
  return res.length ? res.join("\n") : null;
};
const parsePathParams = (api) => {
  if (api.pathParams) {
    return `const { ${api.pathParams.join(", ")} } = params`;
  }
  return;
};
const parseRequestOptions = (api, paramsRefs) => {
  const options = [];
  if (api.method)
    options.push(`method: '${api.method.toUpperCase()}'`);
  if (api.url) {
    if (api.pathParams) {
      options.push(`url: \`${api.url}\``);
    } else {
      options.push(`url: '${api.url}'`);
    }
  }
  for (const { key } of paramsRefs) {
    if (key === "cookie")
      continue;
    options.push(key);
  }
  return options;
};
const createFunctionCode = (api, functionName, requestUtil, paramsRefs, responseRef, defaultContentType) => {
  const customContentType = api.requestObject.body?.type !== defaultContentType ? api.requestObject.body?.type : void 0;
  const functionComment = createFunctionComment(api);
  const { paramsRefCode, deconstructExpression } = transformFunctionParamsRefCode(paramsRefs);
  const resultRefCode = `Promise<${responseRef.join(" | ")}>`;
  const prefixCode = [
    deconstructExpression,
    parsePathParams(api),
    parseHeader(paramsRefs, customContentType)
  ].filter((c) => !!c);
  if (customContentType && !paramsRefs.some((ref) => ref.key === "headers")) {
    paramsRefs.push({ key: "headers", intf: `{ key: string }: any` });
  }
  const requestOptionsCode = parseRequestOptions(api, paramsRefs);
  const functionCode = `
    ${functionComment}
    export const ${functionName} = (${paramsRefCode}): ${resultRefCode} => {
        ${prefixCode.join("\n")}
        return ${requestUtil}({
            ${requestOptionsCode.join(", \n")}
        })
    }
    `.trim();
  return functionCode;
};
const createRequestArrowFunction = async (opt) => {
  const { functionName, requestUtil, api, config, defaultContentType } = opt;
  const { code: paramsIntfCode, refs: paramsRefs } = await createFunctionParamsIntf(api, functionName);
  const { code: responseIntfCode, refs: responseRef } = await createFunctionResponseInterface(api, functionName, config);
  const functionCode = createFunctionCode(api, functionName, requestUtil, paramsRefs, responseRef, defaultContentType);
  return [...paramsIntfCode, ...responseIntfCode, functionCode].filter((line) => line && line !== "").join("\n");
};

const createApiFileHeaderComment = (apis, config) => {
  const projects = apis.reduce((total, api) => {
    return total.concat(api.outFile.project);
  }, []);
  const comments = Array.from(new Set(projects)).map((c) => `  - ${c} `);
  const outFile = apis[0]?.outFile ?? { name: "-", map: "-", path: "-", project: [] };
  return [
    `/* <${np__default.basename(outFile.path)}> ${outFile.name} */`,
    `/* @util <api-refs@${config.version}> */`,
    `/* @datasouce ${config.datasource} */`,
    `/* @total ${apis.length} */`,
    `/* @projects 
 ${comments.join("\n")} 
 */`,
    "",
    ""
  ].join("\n");
};

const lint = (name, code) => {
  try {
    const linter = new eslint.Linter();
    linter.defineParser("@typescript-eslint/parser", parser__default);
    linter.defineRules(eslintPlugin.rules);
    code = linter.verifyAndFix(code, {
      parser: "@typescript-eslint/parser",
      rules: {
        "array-type": [2, { default: "generic" }]
      }
    }).output;
  } catch (error) {
    point.error("typescript parser failure. please check: " + name);
  } finally {
    return code;
  }
};

const transformJs = (code, cjs) => {
  return typescript__default.transpile(code, {
    strict: false,
    target: typescript__default.ScriptTarget.ESNext,
    module: cjs ? typescript__default.ModuleKind.CommonJS : typescript__default.ModuleKind.ESNext,
    project: process.cwd(),
    declaration: true
  });
};
const transformDts = (code) => {
  const transformers = typescript__default.getTransformers({
    target: typescript__default.ScriptTarget.ESNext,
    module: typescript__default.ModuleKind.ESNext,
    declaration: true
  });
  return typescript__default.transpileModule(code, {
    compilerOptions: {
      target: typescript__default.ScriptTarget.ESNext,
      module: typescript__default.ModuleKind.ESNext,
      declaration: true
    },
    transformers: {
      before: transformers.declarationTransformers
    }
  }).outputText;
};
const format = (code, parser) => {
  try {
    return prettier__default.format(code, { parser, ...prettierConfig });
  } catch (error) {
    return code;
  }
};
const write = (path, code, parser) => {
  code = format(code, parser);
  fse__default.writeFileSync(path, code ?? "");
};
const writeFile = (path, code, config) => {
  const dir = np__default.dirname(path);
  if (config.output.clear && fse__default.existsSync(dir))
    fse__default.removeSync(dir);
  if (!fse__default.existsSync(dir))
    fse__default.mkdirSync(dir, { recursive: true });
  let js;
  let dts;
  const dirname = np__default.dirname(path);
  const basename = np__default.basename(path, np__default.extname(path));
  code = lint(path, code);
  switch (config.output.language) {
    case "js":
      js = transformJs(code, config.output.cjs);
      dts = transformDts(code);
      write(np__default.join(dirname, basename + ".js"), js, "babel");
      write(np__default.join(dirname, basename + ".d.ts"), dts, "typescript");
      break;
    case "only-js":
      js = transformJs(code, config.output.cjs);
      write(np__default.join(dirname, basename + ".js"), js, "babel");
      break;
    case "ts":
    default:
      write(path, code, "typescript");
      break;
  }
};

const createIndexFile = (groupApi, config) => {
  const indexFilePath = np__default.normalize(np__default.join(config.output.dir, "index.ts"));
  const importStatements = [];
  const outputStatements = ["export const apis = {"];
  for (const group of groupApi) {
    const { name, map, project } = group[0].outFile;
    importStatements.push(`import * as ${map} from './${map}'`);
    outputStatements.push(`  /**`);
    outputStatements.push(`   * <\u6587\u4EF6\u5939> ${name}`);
    outputStatements.push(`   * @total (\u63A5\u53E3\u6570) ${group.length}`);
    outputStatements.push(`   * @projects`);
    for (const proj of project) {
      outputStatements.push(`   *   - ${proj}`);
    }
    outputStatements.push(`   */`);
    outputStatements.push(`  ${map},`);
  }
  outputStatements.push("}");
  return {
    indexFilePath,
    code: importStatements.join("\n") + "\n" + outputStatements.join("\n")
  };
};

const FUNCTION_COOKIE_INJECT = `
/** \u5C06 cookie \u8F6C\u5316\u6210 header \u53C2\u6570 */
const cookieToHeaderValue = (cookies: { [key: string]: any }): string => {
    return Object.entries(cookies)
        .map(([k, v]) => k + '=' + v)
        .join('; ')
}
`;
const generate = async (apis, config) => {
  point.step("\u5F00\u59CB\u751F\u6210");
  const groupApi = arrayGrouping.GroupBy(apis, (a, b) => a.outFile.path === b.outFile.path);
  const { requestUtil, importStatement } = parseImportStatement(config.output?.applyImportStatements);
  const defaultContentType = calcDefaultContentType(apis);
  const cache = [];
  for (const group of groupApi) {
    strictCheck(group, config);
    const factory = createFunctionNameFactory(group);
    const path = group[0].outFile.path;
    const content = [];
    content.push(importStatement);
    content.push(``);
    content.push(createApiFileHeaderComment(group, config));
    if (group.some((api) => api.requestObject?.cookie)) {
      content.push(FUNCTION_COOKIE_INJECT);
    }
    content.push("\n\n");
    for (const api of group) {
      const functionName = factory.generate(api);
      const code = await createRequestArrowFunction({
        requestUtil,
        functionName,
        defaultContentType,
        api,
        config
      });
      content.push(code);
    }
    cache.push([path, content.join("\n\n")]);
  }
  point.step("\u5F00\u59CB\u5199\u5165\u5230\u6587\u4EF6");
  if (config.output.appendIndex) {
    const { indexFilePath, code } = createIndexFile(groupApi, config);
    cache.push([indexFilePath, code]);
  }
  for (const [path, content] of cache)
    writeFile(path, content, config);
  if (config.showTotal !== false) {
    point.total("\u751F\u6210\u7EDF\u8BA1");
    const total = groupApi.map((group) => {
      const { path, project } = group[0].outFile;
      return { path, project: project.join("\n"), ["apis total"]: group.length };
    });
    console.table(total);
  }
  point.success("\u5199\u5165\u5B8C\u6210");
};

const DEFAULT_CONFIG_FILE_NAME = "api-refs.config.json";
let configFilePath;
let config;
let apis;
process.addListener("exit", (code) => {
  if (code === 200 && config && configFilePath) {
    const output = prettier__default.format(JSON.stringify(config), {
      parser: "json",
      ...prettierConfig
    });
    fs__default.writeFileSync(configFilePath, output, { encoding: "utf-8" });
    point.save("\u914D\u7F6E\u5DF2\u4FDD\u5B58");
    process.exit(0);
  }
});
commander.program.name(pkg.name).version(pkg.version).description(pkg.description).helpOption(void 0, "\u67E5\u770B\u5E2E\u52A9").option("-r, --reset <reset project>", "\u662F\u5426\u91CD\u7F6E\u914D\u7F6E\u6587\u4EF6").option("-c, --config <config file path>", "\u6307\u5B9A\u4F7F\u7528\u7684\u914D\u7F6E\u6587\u4EF6").action(async ({ reset, config: customConfigPath }) => {
  configFilePath = customConfigPath ?? DEFAULT_CONFIG_FILE_NAME;
  const hasConfigFile = fs__default.existsSync(configFilePath);
  if (!hasConfigFile) {
    const isCreate = await inputBoolean("\u7F3A\u5C11\u914D\u7F6E\u6587\u4EF6\u662F\u5426\u521B\u5EFA", true);
    if (!isCreate) {
      point.warn("\u7528\u6237\u62D2\u7EDD\u521B\u5EFA\u914D\u7F6E\u6587\u4EF6, \u7A0B\u5E8F\u9000\u51FA");
      process.exit();
    }
  }
  config = parseConfig(configFilePath, reset);
  apis = await inputConfigAndLoadApis(config);
  await generate(apis, config);
  process.exit(200);
}).parse();
