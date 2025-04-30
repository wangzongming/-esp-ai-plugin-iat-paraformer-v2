
// // 请替换为你的实际 API Key
// const DASHSCOPE_API_KEY = 'sk-xx';


 

/**
 * 查询热词
*/

const axios = require('axios'); 

const url = 'https://dashscope.aliyuncs.com/api/v1/services/audio/asr/customization';
const headers = {
    'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
    'Content-Type': 'application/json'
};

const data = {
    "model": "speech-biasing",
    "input": {
        "action": "list_vocabulary",
        "prefix": null,
        "page_index": 0,
        "page_size": 10
    }
};

axios.post(url, data, { headers })
    .then(response => {
        console.log(response.data);
    })
    .catch(error => {
        if (error.response) {
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
            console.error('Error response headers:', error.response.headers);
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error setting up the request:', error.message);
        }
    });
    




// /**
//  * 创建热词
// */

// const axios = require('axios'); 

// const url = 'https://dashscope.aliyuncs.com/api/v1/services/audio/asr/customization';
// const headers = {
//     'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
//     'Content-Type': 'application/json'
// };

// const data = {
//     "model": "speech-biasing",
//     "input": {
//         "action": "create_vocabulary",
//         "target_model": "paraformer-realtime-v2",
//         "prefix": "testpfx",
//         "vocabulary": [
//             { "text": "来财", "weight": 4, "lang": "zh" },
//             { "text": "再见", "weight": 4, "lang": "zh" },
//             { "text": "电量查询", "weight": 4, "lang": "zh" },
//             { "text": "大点声", "weight": 4, "lang": "zh" },
//             { "text": "小点声", "weight": 4, "lang": "zh" },
//         ]
//     }
// };

// axios.post(url, data, { headers })
//     .then(response => {
//         console.log(response.data);
//     })
//     .catch(error => {
//         if (error.response) {
//             console.error('Error response data:', error.response.data);
//             console.error('Error response status:', error.response.status);
//             console.error('Error response headers:', error.response.headers);
//         } else if (error.request) {
//             console.error('No response received:', error.request);
//         } else {
//             console.error('Error setting up the request:', error.message);
//         }
//     });
    



/**
 * 修改热词
*/

// const axios = require('axios');


// const url = 'https://dashscope.aliyuncs.com/api/v1/services/audio/asr/customization';
// const headers = {
//     'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
//     'Content-Type': 'application/json'
// };

// const data = {
//     "model": "speech-biasing",
//     "input": {
//         "action": "update_vocabulary",
//         "vocabulary_id": "vocab-testpfx-6977ae49f65c4c3db054727cxxxxxxxx",
//         "vocabulary": [
//             //             { "text": "来财", "weight": 4, "lang": "zh" },
//             //             { "text": "再见", "weight": 4, "lang": "zh" },
//             //             { "text": "电量查询", "weight": 4, "lang": "zh" },
//             //             { "text": "大点声", "weight": 4, "lang": "zh" },
//             //             { "text": "小点声", "weight": 4, "lang": "zh" },
//         ]      
//     }
// };

// axios.post(url, data, { headers })
//     .then(response => {
//         console.log(response.data);
//     })
//     .catch(error => {
//         if (error.response) {
//             console.error('Error response data:', error.response.data);
//             console.error('Error response status:', error.response.status);
//             console.error('Error response headers:', error.response.headers);
//         } else if (error.request) {
//             console.error('No response received:', error.request);
//         } else {
//             console.error('Error setting up the request:', error.message);
//         }
//     });
    