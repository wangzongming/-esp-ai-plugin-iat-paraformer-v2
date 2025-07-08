const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

module.exports = {
    // 插件名字
    name: "esp-ai-plugin-iat-paraformer-v2",
    // 插件类型 LLM | TTS | IAT
    type: "IAT",
    main({ device_id, session_id, log, devLog, iat_config, onIATText, cb, iatServerErrorCb, logWSServer, logSendAudio, connectServerCb, connectServerBeforeCb, serverTimeOutCb, iatEndQueueCb, getClientAudioConfig = ()=> ({}) }) {
        try {
            let {
                api_key,
                vad_first = 10000,
                vad_course = 5000,
                vocabulary_id = "",
                language_hints = null
            } = iat_config;
            if (!api_key) return log.error(`请配置阿里云esp-ai-plugin-iat-paraformer 的 api_key 参数。`);
            if (vad_first < 3000) {
                vad_first = 3000;
            }
            if (vad_first > 10000) {
                vad_first = 10000;
            }
            if (vad_course < 500) {
                vad_course = 500;
            }

            // 如果关闭后 message 还没有被关闭，需要定义一个标志控制
            let shouldClose = false;
            // 这个标志必须设置
            let iat_server_connected = false;
            // 是否已经说过话了
            let tasked = false;
            const { sample_rate = 16000, format = "pcm", language = "" } = getClientAudioConfig("esp-ai-plugin-iat-paraformer-v2");
 
            // 连接服务器前的回调
            connectServerBeforeCb();

            // 生成32位任务ID
            const TASK_ID = uuidv4().replace(/-/g, '').slice(0, 32);
            const url = 'wss://dashscope.aliyuncs.com/api-ws/v1/inference';

            // 创建WebSocket连接
            const iat_ws = new WebSocket(url, {
                headers: {
                    "Authorization": `bearer ${api_key}`,
                    'X-DashScope-DataInspection': "enable"
                }
            });

            // 注册WebSocket服务器操作
            logWSServer({
                close: () => { 
                    sendFinishTask();
                    shouldClose = true;
                    iat_server_connected = false;
                    iat_ws.close();
                },
                end: () => {
                    sendFinishTask();
                }
            });

            // 连接建立完毕
            iat_ws.on('open', () => {
                if (shouldClose) return;
                // 发送run-task指令
                sendRunTask();
            });

            // 当达到静默时间后会自动执行这个任务
            iatEndQueueCb(() => {
                if (shouldClose) return;
                sendFinishTask();
            });
            // 发送run-task指令
            function sendRunTask() {
                const runTaskMessage = {
                    header: {
                        action: 'run-task',
                        task_id: TASK_ID,
                        streaming: 'duplex'
                    },
                    payload: {
                        task_group: 'audio',
                        task: 'asr',
                        function: 'recognition',
                        model: 'paraformer-realtime-v2',
                        parameters: {
                            sample_rate: sample_rate, 
                            format: format,
                            vocabulary_id, 
                            language_hints, // zh: 中文  en: 英文  ja: 日语  yue: 粤语  ko: 韩语 
                            max_sentence_silence: vad_course,
                        },
                        input: {}
                    }
                };
                if(language){
                    runTaskMessage.payload.parameters.language_hints = [language];
                }
                iat_ws.send(JSON.stringify(runTaskMessage));
            }

            // 发送finish-task指令
            function sendFinishTask() {
                const finishTaskMessage = {
                    header: {
                        action: 'finish-task',
                        task_id: TASK_ID,
                        streaming: 'duplex'
                    },
                    payload: {
                        input: {}
                    }
                };
                iat_ws.send(JSON.stringify(finishTaskMessage));
            }

            let realStr = "";
            // 接收消息处理
            iat_ws.on('message', (data) => {
                if (shouldClose) return;
                const message = JSON.parse(data);

                switch (message.header.event) {
                    case 'task-started':
                        iat_server_connected = true;
                        connectServerCb(true); 
                        setTimeout(() => {
                            if (!tasked && iat_ws.OPEN) {
                                // 结束任务
                                sendFinishTask();
                            }
                        }, vad_first)

                        break;
                    case 'result-generated':
                        realStr = message.payload.output.sentence.text;
                        onIATText && onIATText(realStr);
                        if (realStr) {
                            tasked = true;
                        }
                        break;
                    case 'task-finished':
                        devLog && log.iat_info(`->  IAT 最终结果：${realStr}`);
                        cb({ text: realStr, device_id });
                        connectServerCb(false);
                        onIATText && onIATText(realStr);
                        shouldClose = true;
                        iat_server_connected = false;
                        break;
                    case 'task-failed':
                        console.log(message);
                        iatServerErrorCb(`阿里云DashScope ASR v2 服务错误：${message.header.error_message}`, message.header.error_code);
                        connectServerCb(false);
                        shouldClose = true;
                        iat_server_connected = false;
                        break;
                    default:
                        devLog && log.iat_info(`阿里云DashScope ASR v2 未知事件: ${message.header.event}`);
                }
            });

            // 资源释放
            iat_ws.on('close', () => {
                if (shouldClose) return;
                devLog && log.iat_info("-> 阿里云DashScope ASR v2 服务已关闭：", session_id);
                connectServerCb(false);
            });

            // 建连错误
            iat_ws.on('error', (err) => {
                if (shouldClose) return;
                log.error(`阿里云DashScope ASR v2 服务连接错误: ${err.message}`);
                iatServerErrorCb(err);
                connectServerCb(false);
            });

            // test...
            // let writeStreamMP3 = fs.createWriteStream(path.join(__dirname, `./pcm_output.opus`));
            // 发送音频数据
            function send_pcm(data) {
                if (shouldClose) return;
                if (!iat_server_connected) return;  
                data.length && iat_ws.send(data);
                // console.log('收到音频：', data.length)
                // test...
                // writeStreamMP3.write(data);
            }

            logSendAudio(send_pcm);
        } catch (err) {
            connectServerCb(false);
            console.log(err);
            log.error("阿里云DashScope ASR v2 插件错误：", err);
        }
    }
}