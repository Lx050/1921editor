import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

async function checkUsers() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userRepository = app.get('UserRepository');

  console.log('🔍 检查数据库中的用户...\n');

  try {
    const users = await userRepository.find({
      where: { tenantId: '00000000-0000-0000-0000-000000000001' },
    });

    console.log(`找到 ${users.length} 个用户:\n`);

    if (users.length === 0) {
      console.log('❌ 数据库中没有用户！');
      console.log('\n这就是为什么表格是空的。');
      console.log('\n解决方案:');
      console.log('1. 退出当前登录');
      console.log('2. 重新扫码登录');
      console.log('3. 登录时会自动创建用户并同步到飞书表格');
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name}`);
        console.log(`   FeishuID: ${user.feishuId}`);
        console.log(`   角色: ${user.role}`);
        console.log(`   Email: ${user.email || '(无)'}`);
        console.log('');
      });

      console.log('✅ 数据库中有用户，但表格是空的');
      console.log('\n可能原因:');
      console.log('1. 同步时出错了（检查上面的日志）');
      console.log('2. 表格的字段名称不匹配');
      console.log('\n让我们手动同步一次...');
    }
  } catch (error) {
    console.error('❌ 查询失败:', error.message);
  }

  await app.close();
}

checkUsers();
