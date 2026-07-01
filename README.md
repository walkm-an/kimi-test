# weather-cli

基于 Node.js 原生 ESM 的命令行天气查询工具。

## 功能

- 查询城市实时天气（温度、天气状况、湿度、风速）
- 查询未来 24 小时逐小时天气预报
- 查询未来 7 天逐日天气预报
- 查询当前空气质量（AQI、PM2.5、PM10）

## 技术栈

- Node.js ≥ 18（使用原生 `fetch` 和 ESM）
- 零运行时第三方依赖
- 天气数据来自 [Open-Meteo](https://open-meteo.com/)

## 安装

```bash
# 进入项目目录后
npm link
```

或直接通过 `node bin/weather.js` 运行。

## 使用

```bash
# 默认输出完整报告（当前 + 24h + 7d + 空气质量）
node bin/weather.js 北京
weather 北京

# 只显示当前天气
weather --current 北京

# 当前 + 未来 24 小时
weather --hourly 上海

# 当前 + 未来 7 天
weather --daily 广州

# 当前 + 空气质量
weather --aqi 成都
```

## 示例输出

```text
📍 北京 当前天气
   晴，26°C
   湿度 75%，风速 5 km/h

🕐 未来 24 小时预报
   00:00  晴  25.8°C  风速 4.6 km/h
   01:00  多云  24.5°C  风速 3.2 km/h
   ...

📅 未来 7 天预报
   07-01  小雨  21.5°C ~ 31.1°C
   07-02  晴  23.2°C ~ 35.1°C
   ...

🌫️ 空气质量
   AQI 155（中度污染）
   PM2.5 111.5 μg/m³，PM10 115.5 μg/m³
```

## 测试

```bash
# 运行所有单元测试
node test/geocode.test.js
node test/weather.test.js
node test/airquality.test.js
node test/formatter.test.js
node test/index.test.js
```

## 项目结构

```text
.
├── bin/
│   └── weather.js        # 可执行入口
├── src/
│   ├── index.js          # CLI 主流程
│   ├── geocode.js        # 地理编码
│   ├── weather.js        # 天气数据
│   ├── airquality.js     # 空气质量数据
│   ├── codes.js          # WMO 天气代码映射
│   └── formatter.js      # 输出格式化
├── test/                 # 单元测试
├── package.json
├── README.md
└── WEATHER-PLAN.md       # 项目规划
```

## 边界说明

- 不查询历史天气
- 不自动定位，需手动输入城市名
- 固定摄氏度与公里/小时，不支持单位切换
- 空气质量仅展示当前值，不展示小时/天级变化
- 需要网络连接，无需 API Key

## License

MIT
