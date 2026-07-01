# Node.js ESM 天气查询 CLI 开发计划

## Context

在 `/Users/ppyang/CC/kimi-test` 目录下，仓库已清空并重新 `git init`，处于从零开始状态。用户希望开发一个基于 Node.js 原生 ESM 的命令行天气查询工具，核心需求在原有「实时天气」基础上扩展为：

- 实时天气（温度、天气状况、风力、湿度）
- 未来 24 小时逐小时天气预报
- 未来 7 天逐日天气预报
- 当前空气质量（AQI）

约束条件：尽量使用 Node.js 原生能力，选用国内可访问的免费天气 API，减少第三方运行时依赖。

## Recommended Approach

### API 选型：Open-Meteo

Open-Meteo 完全免费、无需 API Key、支持 HTTPS、在国内可访问，且一个平台同时提供天气预报与空气质量数据，适合本工具：

1. **地理编码**：`https://geocoding-api.open-meteo.com/v1/search?name={城市}&count=1&language=zh`
2. **实时/逐小时/逐日天气**：`https://api.open-meteo.com/v1/forecast?latitude=...&longitude=...&current=...&hourly=...&daily=...&timezone=auto`
3. **空气质量**：`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=...&longitude=...&current=us_aqi,pm10,pm2_5`

### 功能边界（不做）

- 不处理历史天气数据
- 不自动定位，必须显式输入城市名
- 不做单位切换（固定摄氏度、公里/小时）
- 不做 GUI/TUI/Web 界面
- 不做本地缓存或配置文件
- 不做空气质量的小时/天级变化，只展示当前 AQI
- 不做指数退避、限流、API Key 管理
- 不做多语言输出（固定简体中文）

### CLI 行为

- 默认执行 `weather 北京` 输出完整报告：当前天气 + 24 小时预报 + 7 天预报 + 空气质量
- 支持可选标志精简输出：
  - `--current`：只显示当前天气
  - `--hourly`：显示当前天气 + 24 小时预报
  - `--daily`：显示当前天气 + 7 天预报
  - `--aqi`：显示当前天气 + 空气质量
- 无城市参数时输出使用说明并退出码 `1`
- 城市未找到或网络错误时输出友好提示并退出码 `2`

### 技术栈

- Node.js ≥ 18（原生 `fetch`、`Promise`、`URLSearchParams`）
- ESM（`"type": "module"`）
- `process.argv` 原生参数解析
- 零运行时第三方依赖

## Directory Structure

```text
weather-cli/
├── package.json          # ESM 声明、bin 入口、scripts
├── README.md             # 安装、使用、示例
├── bin/
│   └── weather.js        # 可执行入口（shebang + 调用 src/index.js）
└── src/
    ├── index.js          # CLI 参数解析与主流程调度
    ├── geocode.js        # 城市名 → 经纬度
    ├── weather.js        # 调用天气 API（current + hourly + daily）
    ├── airquality.js     # 调用空气质量 API
    ├── codes.js          # WMO 天气代码 → 中文映射
    └── formatter.js      # 终端输出格式化
```

## Critical Files

| 文件 | 职责 |
|---|---|
| `package.json` | 声明 `"type": "module"`、`bin.weather` 指向 `bin/weather.js`；scripts 包含 `start` |
| `bin/weather.js` | `#!/usr/bin/env node`，导入并执行 `src/index.js` |
| `src/index.js` | 解析 `process.argv`；按标志调用对应模块；统一错误处理与退出码 |
| `src/geocode.js` | 请求 Open-Meteo Geocoding，返回 `{ name, latitude, longitude, country }` |
| `src/weather.js` | 请求 `forecast` 接口，获取 `current`、`hourly`（24h）、`daily`（7d）数据 |
| `src/airquality.js` | 请求 `air-quality` 接口，获取当前 `us_aqi`、`pm10`、`pm2_5` |
| `src/codes.js` | WMO 天气代码中文映射字典（晴、多云、小雨等） |
| `src/formatter.js` | 将数据格式化为中文终端输出，含当前、24h、7d、AQI 四个区块 |
| `README.md` | 安装说明、使用示例、API 来源、约束说明 |

## Implementation Phases

### Phase 1: 项目骨架
- 创建目录结构
- 编写 `package.json`（ESM + bin）
- 创建 `bin/weather.js` 并验证可执行

### Phase 2: API 探针
- 用临时脚本验证 Open-Meteo 地理编码、forecast、air-quality 三个接口的返回结构
- 确定 24 小时、7 天时间参数取值方式
- 记录异常响应格式

### Phase 3: 数据获取层
- 实现 `src/geocode.js`
- 实现 `src/weather.js`（current + hourly + daily）
- 实现 `src/airquality.js`

### Phase 4: 输出与映射层
- 实现 `src/codes.js` 中文天气代码表
- 实现 `src/formatter.js`，默认输出四段信息，按标志可精简

### Phase 5: CLI 集成
- 实现 `src/index.js`，串联 geocode → weather + airquality → formatter
- 处理 `--current`、`--hourly`、`--daily`、`--aqi` 标志
- 处理无参数、城市不存在、网络错误

### Phase 6: 测试与文档
- 手动测试：北京、上海、纽约、不存在城市、无参数、网络断开
- 编写 `README.md`

## Verification

- [ ] `node bin/weather.js 北京` 输出：当前天气、24 小时预报、7 天预报、空气质量
- [ ] `node bin/weather.js --current 北京` 只输出当前天气
- [ ] `node bin/weather.js --hourly 上海` 输出当前 + 24 小时
- [ ] `node bin/weather.js --daily 广州` 输出当前 + 7 天
- [ ] `node bin/weather.js --aqi 成都` 输出当前 + 空气质量
- [ ] 无城市参数时提示用法并退出码 `1`
- [ ] 城市不存在时提示「未找到该城市」并退出码 `2`
- [ ] 网络异常时提示「查询失败，请检查网络」并退出码 `2`
- [ ] 所有模块使用 ESM `import/export`
- [ ] 运行时无第三方 npm 依赖
- [ ] `README.md` 包含完整安装与使用说明
