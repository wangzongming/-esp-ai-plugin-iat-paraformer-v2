# esp-ai-plugin-iat-paraformer-v2 [![npm](https://img.shields.io/npm/v/esp-ai-plugin-iat-paraformer-v2.svg)](https://www.npmjs.com/package/esp-ai-plugin-iat-paraformer-v2) [![npm](https://img.shields.io/npm/dm/esp-ai-plugin-iat-paraformer-v2.svg?style=flat)](https://www.npmjs.com/package/esp-ai-plugin-iat-paraformer-v2)

让 `ESP-AI` 支持阿里云的 `paraformer-realtime-v2` 服务。

paraformer-realtime-v2 文档： https://help.aliyun.com/zh/model-studio/websocket-for-paraformer-real-time-service?spm=a2c4g.11186623.0.0.2a702c4dB8nrzt

# 安装
在你的 `ESP-AI` 项目中执行下面命令
```bash
npm i esp-ai-plugin-iat-paraformer-v2
```

# 使用 
```js
const espAi = require("esp-ai"); 

espAi({
    ... 

    // 配置使用插件并且为插件配置api-key
    iat_server: "esp-ai-plugin-iat-paraformer-v2",
    iat_config: { 
        // https://help.aliyun.com/zh/model-studio/get-api-key?spm=a2c4g.11186623.0.0.2de054e0qf2WWm
        api_key: "sk-xxx",
        vad_first: 10000, // 未说话前等待说话的静默时间 
        vad_course: 800, // 说话后等待的静默时间
        vocabulary_id: "", // 热词id 
        // language_hints: [] // 语音，默认自动识别，可选项： zh: 中文  en: 英文  ja: 日语  yue: 粤语  ko: 韩语 
    },

    
    // 引入插件
    plugins: [ 
        require("esp-ai-plugin-iat-paraformer-v2")
    ]
});
```
 