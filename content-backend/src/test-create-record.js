const Lark = require('@larksuiteoapi/node-sdk');

async function testCreateRecord() {
    console.log('🧪 测试创建记录到飞书表格...\n');

    const appId = 'cli_a9cca040e5f89bcb';
    const appSecret = 'E51FjrmxjqFBsHMdoCJ4edcCm8eOGhfK';
    const appToken = 'V9ORbOdvYax8ANs072Cc7AoQnQh';
    const tableId = 'tblQrscswfqgfY9A';

    try {
        const client = new Lark.Client({
            appId,
            appSecret,
            appType: Lark.AppType.SelfBuild,
            domain: Lark.Domain.Feishu,
        });

        // 先获取表格的字段信息
        console.log('1️⃣ 获取表格字段信息...');
        const fieldsRes = await client.bitable.appTableField.list({
            path: {
                app_token: appToken,
                table_id: tableId,
            },
        });

        if (fieldsRes.code === 0) {
            console.log('\n✅ 表格字段:');
            fieldsRes.data?.items?.forEach(field => {
                console.log(`  - ${field.field_name} (${field.type})`);
            });
        } else {
            console.log('❌ 获取字段失败:', fieldsRes.msg);
            return;
        }

        // 尝试创建记录
        console.log('\n2️⃣ 创建测试记录...');
        const createRes = await client.bitable.appTableRecord.create({
            path: {
                app_token: appToken,
                table_id: tableId,
            },
            data: {
                fields: {
                    '姓名': '测试用户_' + Date.now(),
                    '岗位': 'EDITOR',
                    'FeishuID': 'ou_test_' + Date.now(),
                    'Email': 'test@example.com',
                    '最后登录时间': Date.now(),
                    '状态': '激活',
                },
            },
        });

        console.log('\nAPI响应码:', createRes.code);
        console.log('API响应消息:', createRes.msg);

        if (createRes.code === 0) {
            console.log('\n✅ 创建成功！');
            console.log('记录ID:', createRes.data?.record?.record_id);
            console.log('\n请刷新飞书表格查看新记录');
        } else {
            console.log('\n❌ 创建失败');
            console.log('完整响应:', JSON.stringify(createRes, null, 2));

            if (createRes.code === 1254034) {
                console.log('\n⚠️ 字段不存在！');
                console.log('请确保表格中有以下字段:');
                console.log('  - 姓名');
                console.log('  - 岗位');
                console.log('  - FeishuID');
                console.log('  - Email');
            }
        }

    } catch (error) {
        console.error('\n❌ 测试失败:', error.message);
    }
}

testCreateRecord();
