const Lark = require('@larksuiteoapi/node-sdk');

async function testCorrectTable() {
    console.log('🧪 测试正确的表格配置...\n');

    const appId = 'cli_a9cca040e5f89bcb';
    const appSecret = 'E51FjrmxjqFBsHMdoCJ4edcCm8eOGhfK';

    // 使用新的正确配置
    const appToken = 'V9ORbOdvYax8ANs072Cc7AoQnQh';
    const tableId = 'tblQrscswfqgfY9A';

    console.log('配置信息:');
    console.log('  App Token:', appToken);
    console.log('  Table ID:', tableId);
    console.log('');

    try {
        const client = new Lark.Client({
            appId,
            appSecret,
            appType: Lark.AppType.SelfBuild,
            domain: Lark.Domain.Feishu,
        });

        console.log('1️⃣ 测试读取表格...');
        const listRes = await client.bitable.appTableRecord.list({
            path: {
                app_token: appToken,
                table_id: tableId,
            },
            params: {
                page_size: 5,
            },
        });

        console.log('API响应码:', listRes.code);
        console.log('API响应消息:', listRes.msg);

        if (listRes.code === 0) {
            console.log('\n✅ 表格访问成功！');
            console.log('当前记录数:', listRes.data?.items?.length || 0);

            console.log('\n2️⃣ 测试创建记录...');
            const createRes = await client.bitable.appTableRecord.create({
                path: {
                    app_token: appToken,
                    table_id: tableId,
                },
                data: {
                    fields: {
                        '姓名': '测试用户_' + Date.now(),
                        '岗位': 'EDITOR',
                        'FeishuID': 'test_' + Date.now(),
                        'Email': 'test@example.com',
                    },
                },
            });

            if (createRes.code === 0) {
                console.log('✅ 创建记录成功！');
                console.log('记录ID:', createRes.data?.record?.record_id);
                console.log('\n🎉 同步功能可以正常工作了！');
                console.log('\n请检查飞书表格，应该能看到新增的测试记录。');
            } else {
                console.log('❌ 创建记录失败');
                console.log('错误码:', createRes.code);
                console.log('错误消息:', createRes.msg);
            }
        } else {
            console.log('\n❌ 表格访问失败');
            console.log('错误码:', listRes.code);
            console.log('错误消息:', listRes.msg);
        }

    } catch (error) {
        console.error('\n❌ 测试失败:', error.message);
    }
}

testCorrectTable();
