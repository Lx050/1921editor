/**
 * 后端调试脚本
 * 运行方式：node debug-backend.js
 * 用于检查后端数据库中的文章数据
 */

const { createConnection } = require('typeorm');
const { Article } = require('./content-backend/src/entities/article.entity');
const { User } = require('./content-backend/src/entities/user.entity');

async function debugDatabase() {
    console.log('🔍 开始调试数据库...\n');

    let connection;
    try {
        // 创建数据库连接（使用应用的配置）
        connection = await createConnection({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: '1234',
            database: 'layout_assembly',
            entities: [Article, User],
            synchronize: false,
            logging: false
        });

        console.log('✅ 数据库连接成功');

        // 1. 检查所有用户
        console.log('\n👥 检查用户数据:');
        const users = await connection.query('SELECT id, name, feishu_id, tenant_id, created_at FROM users ORDER BY created_at DESC');
        console.log(`找到 ${users.length} 个用户:`);
        users.forEach((user, index) => {
            console.log(`  ${index + 1}. ${user.name} (ID: ${user.id}, 租户: ${user.tenant_id})`);
        });

        // 2. 检查所有文章
        console.log('\n📄 检查文章数据:');
        const articles = await connection.query(`
            SELECT id, title, status, owner_id, tenant_id, created_at, updated_at
            FROM articles
            ORDER BY created_at DESC
        `);
        console.log(`找到 ${articles.length} 篇文章:`);
        articles.forEach((article, index) => {
            console.log(`  ${index + 1}. ${article.title}`);
            console.log(`      ID: ${article.id}`);
            console.log(`      状态: ${article.status}`);
            console.log(`      所有者: ${article.owner_id}`);
            console.log(`      租户: ${article.tenant_id}`);
            console.log(`      创建时间: ${article.created_at}`);
            console.log(`      更新时间: ${article.updated_at}`);
            console.log('');
        });

        // 3. 检查特定用户的文章
        if (users.length > 0) {
            const latestUser = users[0];
            console.log(`\n🔍 检查最新用户 ${latestUser.name} 的文章:`);
            const userArticles = articles.filter(article => article.owner_id === latestUser.id);
            console.log(`用户 ${latestUser.name} 有 ${userArticles.length} 篇文章:`);
            userArticles.forEach((article, index) => {
                console.log(`  ${index + 1}. ${article.title} (${article.status})`);
            });
        }

        // 4. 检查租户隔离
        console.log('\n🏢 检查租户分布:');
        const tenantStats = {};
        articles.forEach(article => {
            if (!tenantStats[article.tenant_id]) {
                tenantStats[article.tenant_id] = [];
            }
            tenantStats[article.tenant_id].push(article);
        });

        Object.entries(tenantStats).forEach(([tenantId, tenantArticles]) => {
            console.log(`  租户 ${tenantId}: ${tenantArticles.length} 篇文章`);
        });

        // 5. 检查草稿状态
        console.log('\n📝 检查草稿状态:');
        const drafts = articles.filter(article => article.status === 'DRAFT');
        console.log(`总共有 ${drafts.length} 篇草稿:`);
        drafts.forEach((draft, index) => {
            console.log(`  ${index + 1}. ${draft.title} (所有者: ${draft.owner_id}, 租户: ${draft.tenant_id})`);
        });

        // 6. 检查最近10分钟的文章
        console.log('\n⏰ 检查最近10分钟创建的文章:');
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
        const recentArticles = articles.filter(article => new Date(article.created_at) > tenMinutesAgo);
        console.log(`最近10分钟创建了 ${recentArticles.length} 篇文章:`);
        recentArticles.forEach((article, index) => {
            const minutesAgo = Math.round((Date.now() - new Date(article.created_at).getTime()) / 60000);
            console.log(`  ${index + 1}. ${article.title} (${minutesAgo} 分钟前)`);
        });

        console.log('\n🎉 数据库调试完成!');

    } catch (error) {
        console.error('❌ 调试过程中发生错误:', error);
    } finally {
        if (connection) {
            await connection.close();
            console.log('🔌 数据库连接已关闭');
        }
    }
}

// 检查环境
function checkEnvironment() {
    console.log('🔧 检查运行环境...');

    // 检查Node.js版本
    console.log(`Node.js版本: ${process.version}`);

    // 检查TypeORM是否可用
    try {
        require('typeorm');
        console.log('✅ TypeORM已安装');
    } catch (error) {
        console.log('❌ TypeORM未安装，请运行: npm install typeorm pg');
        process.exit(1);
    }

    // 检查项目结构
    const fs = require('fs');
    const path = require('path');

    const entityPath = path.join(__dirname, 'content-backend/src/entities');
    if (fs.existsSync(entityPath)) {
        console.log('✅ 实体目录存在');
    } else {
        console.log('❌ 实体目录不存在，请在项目根目录运行此脚本');
        process.exit(1);
    }
}

// 主函数
async function main() {
    console.log('🚀 后端数据库调试工具\n');

    checkEnvironment();

    if (require.main === module) {
        await debugDatabase();
    }
}

module.exports = { debugDatabase };

// 运行主函数
main().catch(error => {
    console.error('💥 脚本执行失败:', error);
    process.exit(1);
});