const Lark = require('@larksuiteoapi/node-sdk');
const https = require('https');

async function diagnose() {
    console.log('🔍 深度诊断飞书应用配置...\n');

    const appId = 'cli_a9cca040e5f89bcb';
    const appSecret = 'E51FjrmxjqFBsHMdoCJ4edcCm8eOGhfK';
    const appToken = 'V9ORbOdvYax8ANs072Cc7AoQnQh';
    const tableId = 'tblQrscswfqgfY9A';

    try {
        // 1. 手动获取 tenant_access_token
        console.log('1️⃣ 获取 tenant_access_token...');
        const tokenData = JSON.stringify({
            app_id: appId,
            app_secret: appSecret
        });

        const tokenPromise = new Promise((resolve, reject) => {
            const options = {
                hostname: 'open.feishu.cn',
                port: 443,
                path: '/open-apis/auth/v3/tenant_access_token/internal',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': tokenData.length
                }
            };

            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => { data += chunk; });
                res.on('end', () => { resolve(JSON.parse(data)); });
            });

            req.on('error', reject);
            req.write(tokenData);
            req.end();
        });

        const tokenRes = await tokenPromise;
        console.log('Token 响应:', JSON.stringify(tokenRes, null, 2));

        if (tokenRes.code !== 0) {
            console.log('\n❌ 获取 token 失败！');
            console.log('这说明 App ID 或 App Secret 不正确');
            return;
        }

        const accessToken = tokenRes.tenant_access_token;
        console.log('\n✅ Token 获取成功');
        console.log('Token (前30字符):', accessToken.substring(0, 30) + '...');

        // 2. 使用 token 直接调用 API
        console.log('\n2️⃣ 使用 token 直接访问表格...');

        const apiPromise = new Promise((resolve, reject) => {
            const options = {
                hostname: 'open.feishu.cn',
                port: 443,
                path: `/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records?page_size=1`,
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            };

            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => { data += chunk; });
                res.on('end', () => {
                    console.log('HTTP 状态码:', res.statusCode);
                    console.log('响应头:', JSON.stringify(res.headers, null, 2));
                    resolve(JSON.parse(data));
                });
            });

            req.on('error', reject);
            req.end();
        });

        const apiRes = await apiPromise;
        console.log('\nAPI 响应:', JSON.stringify(apiRes, null, 2));

        if (apiRes.code === 0) {
            console.log('\n✅✅✅ 成功！表格可以访问！');
            console.log('记录数:', apiRes.data?.items?.length || 0);
        } else if (apiRes.code === 99991663) {
            console.log('\n❌ 错误 99991663: 应用未安装到当前租户');
            console.log('\n解决方案:');
            console.log('1. 飞书开发者后台 → 应用发布');
            console.log('2. 或在"测试企业与人员"中添加当前组织');
        } else if (apiRes.code === 403 || apiRes.code === 99991661) {
            console.log('\n❌ 权限错误');
            console.log('可能原因:');
            console.log('1. 应用权限未发布');
            console.log('2. 表格不在应用可访问范围');
        } else {
            console.log('\n❌ 其他错误');
            console.log('错误码:', apiRes.code);
            console.log('错误消息:', apiRes.msg);
        }

    } catch (error) {
        console.error('\n❌ 诊断失败:', error.message);
        console.error(error);
    }
}

diagnose();
