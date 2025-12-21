const Lark = require('@larksuiteoapi/node-sdk');

async function checkAppPermissions() {
    console.log('🔍 检查飞书应用权限...\n');

    const appId = 'cli_a9cca040e5f89bcb';
    const appSecret = 'E51FjrmxjqFBsHMdoCJ4edcCm8eOGhfK';
    const appToken = 'Gcnnw2yujiqmxXkv5mTc8cftnMc';
    const tableId = 'tblO6V58nUVEQX5U';

    try {
        const client = new Lark.Client({
            appId,
            appSecret,
            appType: Lark.AppType.SelfBuild,
            domain: Lark.Domain.Feishu,
        });

        console.log('测试表格访问...');
        console.log('App Token:', appToken);
        console.log('Table ID:', tableId);
        console.log('');

        // 尝试列出表格记录
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
            console.log('记录数量:', listRes.data?.items?.length || 0);
            console.log('\n🎉 同步功能应该可以正常工作了！');
            console.log('请运行: npx ts-node src/manual-sync.ts');
        } else if (listRes.code === 91402) {
            console.log('\n❌ 错误 91402: 表格不存在或应用无权访问');
            console.log('\n📋 请检查:');
            console.log('1. 飞书开发者后台 → 权限管理 → 确认已开通"多维表格"权限');
            console.log('2. 点击"创建版本"并"发布"使权限生效');
            console.log('3. 或在"测试企业与人员"中添加当前用户');
        } else {
            console.log('\n❌ 其他错误');
            console.log('完整响应:', JSON.stringify(tableRes, null, 2));
        }

    } catch (error) {
        console.error('\n❌ 检查失败:');
        console.error('错误:', error.message);
    }
}

checkAppPermissions();
