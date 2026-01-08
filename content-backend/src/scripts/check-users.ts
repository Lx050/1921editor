import { AppDataSource } from '../data-source';
import { User } from '../entities/user.entity';
import { Tenant } from '../entities/tenant.entity';
import { PasswordHashService } from '../services/password-hash.service';

async function checkAndCreateTestUser() {
  await AppDataSource.initialize();
  console.log('数据库连接成功');

  const userRepo = AppDataSource.getRepository(User);
  const tenantRepo = AppDataSource.getRepository(Tenant);
  const passwordHashService = new PasswordHashService();

  // 检查现有用户
  const users = await userRepo.find();
  console.log(`\n现有用户数量: ${users.length}`);
  users.forEach((u) => {
    console.log(`- ${u.email} (${u.name}) - 验证状态: ${u.emailVerified}`);
  });

  // 检查租户
  const tenants = await tenantRepo.find();
  console.log(`\n现有租户数量: ${tenants.length}`);
  tenants.forEach((t) => {
    console.log(`- ${t.name} (${t.slug}) - 邀请码: ${t.inviteCode || '无'}`);
  });

  // 如果没有用户，创建测试用户
  if (users.length === 0) {
    console.log('\n创建测试用户...');

    const tenant = tenants[0];
    if (!tenant) {
      console.error('没有找到租户，请先初始化系统');
      process.exit(1);
    }

    const hashedPassword = await passwordHashService.hash('Test123456');

    const user = userRepo.create({
      tenantId: tenant.id,
      email: 'test@example.com',
      password: hashedPassword,
      name: '测试用户',
      role: 'ADMIN',
      emailVerified: true, // 测试用户自动验证
      isActive: true,
    });

    await userRepo.save(user);
    console.log('\n✅ 测试用户创建成功！');
    console.log('邮箱: test@example.com');
    console.log('密码: Test123456');
    console.log('邀请码: ' + tenant.inviteCode);
  } else {
    console.log('\n已有用户，无需创建测试用户');
  }

  await AppDataSource.destroy();
}

checkAndCreateTestUser().catch(console.error);
