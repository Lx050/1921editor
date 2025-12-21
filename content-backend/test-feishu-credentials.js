// 飞书API测试脚本
// 用于验证 AppID 和 AppSecret 是否正确

const https = require('https');

// 从环境变量读取
const FEISHU_APP_ID = process.env.FEISHU_APP_ID || 'cli_a9cca040e5f89bcb';
const FEISHU_APP_SECRET = process.env.FEISHU_APP_SECRET || 'E51FjrmxjqFBsHMdoCJ4edcCm8eOGhfK';

console.log('========== 飞书API凭证测试 ==========');
console.log(`AppID: ${FEISHU_APP_ID}`);
console.log(`AppSecret: ${FEISHU_APP_SECRET.substring(0, 10)}...`);
console.log('');

// 测试：获取 app_access_token
console.log('测试 1: 获取 app_access_token...');

const postData = JSON.stringify({
    app_id: FEISHU_APP_ID,
    app_secret: FEISHU_APP_SECRET
});

const options = {
    hostname: 'open.feishu.cn',
    port: 443,
    path: '/open-apis/auth/v3/app_access_token/internal',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const response = JSON.parse(data);

            console.log(`HTTP状态码: ${res.statusCode}`);
            console.log(`响应码 (code): ${response.code}`);
            console.log(`响应消息 (msg): ${response.msg || 'success'}`);
            console.log('');

            if (response.code === 0 && response.app_access_token) {
                console.log('✅ 测试成功！');
                console.log(`app_access_token: ${response.app_access_token.substring(0, 20)}...`);
                console.log('');
                console.log('结论：飞书 AppID 和 AppSecret 配置正确！');
                console.log('');
                console.log('如果登录仍然失败，问题可能在于：');
                console.log('1. 飞书应用权限配置不足');
                console.log('2. 重定向URI配置错误');
                console.log('3. 用户不在白名单中');
            } else {
                console.log('❌ 测试失败！');
                console.log('');
                console.log('完整响应:');
                console.log(JSON.stringify(response, null, 2));
                console.log('');
                console.log('可能原因：');
                console.log('1. AppID 或 AppSecret 不正确');
                console.log('2. 飞书应用被禁用');
                console.log('3. 网络连接问题');
                console.log('');
                console.log('请检查：');
                console.log('- 飞书开放平台：https://open.feishu.cn/app');
                console.log('- 确认 AppID 和 AppSecret 是否正确');
            }
        } catch (e) {
            console.log('❌ 解析响应失败');
            console.log('原始响应:', data);
            console.log('错误:', e.message);
        }
    });
});

req.on('error', (error) => {
    console.log('❌ 请求失败');
    console.log('错误:', error.message);
    console.log('');
    console.log('可能原因：');
    console.log('1. 网络连接问题');
    console.log('2. DNS解析失败');
    console.log('3. 防火墙阻止');
});

req.write(postData);
req.end();
