// 从URL中提取 App Token 和 Table ID
const url = 'https://pcn0utfudhj3.feishu.cn/wiki/Gcnnw2yujiqmxXkv5mTc8cftnMc?table=tblO6V58nUVEQX5U&view=vewhRB6Plv';

console.log('🔍 解析飞书表格URL...\n');
console.log('原始URL:', url);
console.log('');

try {
    const urlObj = new URL(url);
    console.log('域名:', urlObj.hostname);
    console.log('路径:', urlObj.pathname);
    console.log('查询参数:', urlObj.search);
    console.log('');

    // 从路径中提取 app_token
    const pathMatch = urlObj.pathname.match(/\/wiki\/([^\/]+)/);
    const appToken = pathMatch ? pathMatch[1] : null;

    // 从查询参数中提取 table_id
    const tableId = urlObj.searchParams.get('table');

    console.log('✅ 提取结果:');
    console.log('App Token:', appToken);
    console.log('Table ID:', tableId);
    console.log('');

    // 与.env中的配置对比
    const envAppToken = 'Gcnnw2yujiqmxXkv5mTc8cftnMc';
    const envTableId = 'tblO6V58nUVEQX5U';

    console.log('📋 与.env配置对比:');
    console.log('App Token 匹配:', appToken === envAppToken ? '✅' : '❌');
    console.log('Table ID 匹配:', tableId === envTableId ? '✅' : '❌');

    if (appToken !== envAppToken) {
        console.log('\n⚠️ App Token 不匹配！');
        console.log('URL中:', appToken);
        console.log('.env中:', envAppToken);
    }

    if (tableId !== envTableId) {
        console.log('\n⚠️ Table ID 不匹配！');
        console.log('URL中:', tableId);
        console.log('.env中:', envTableId);
    }

    // 检查URL格式
    console.log('\n📝 URL格式分析:');
    if (urlObj.pathname.includes('/wiki/')) {
        console.log('✅ 这是一个 Wiki 格式的表格URL');
        console.log('说明: Wiki格式的表格可能需要特殊处理');
    } else if (urlObj.pathname.includes('/base/')) {
        console.log('✅ 这是一个 Base 格式的表格URL');
    } else {
        console.log('❓ 未知的URL格式');
    }

} catch (error) {
    console.error('❌ URL解析失败:', error.message);
}
