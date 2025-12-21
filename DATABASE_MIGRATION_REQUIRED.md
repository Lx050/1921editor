# 🚨 重要：数据库迁移前的临时修复

## 问题诊断

后端返回 500 错误，原因是：
- `TenantModule` 已被引入到 `AppModule`
- `AuthModule` 依赖 `TenantModule`
- 但数据库中还没有 `tenants` 表
- 导致 TypeORM 无法加载实体，整个应用启动失败

## 解决方案（两种选择）

### 方案 A：立即运行数据库迁移 ✅ 推荐

这将创建所有必需的多租户表结构：

```bash
# 1. 停止后端服务（Ctrl+C）
cd content-backend

# 2. 编译TypeScript
npm run build

# 3. 运行迁移
npm run typeorm migration:run -- -d dist/data-source.js

# 4. 重启后端
npm run start:dev
```

**注意事项:**
- 确保 PostgreSQL 数据库正在运行（端口5433）
- 迁移会自动创建默认租户并迁移现有数据
- 迁移后需要配置默认租户的凭证

### 方案 B：暂时回退多租户更改

如果无法立即运行迁移，可以暂时禁用多租户功能：

#### 步骤 1：移除 TenantModule 依赖

**文件**: `src/app.module.ts`

```diff
- import { TenantModule } from './tenant/tenant.module';

EventEmitterModule.forRoot(),
- TenantModule,
  FeishuModule,
```

#### 步骤 2：恢复原始 AuthModule

**文件**: `src/auth/auth.module.ts`

```diff
- import { TenantModule } from '../tenant/tenant.module';

imports: [
  TypeOrmModule.forFeature([User]),
  FeishuModule,
- TenantModule,
  PassportModule,
```

#### 步骤 3：恢复原始 AuthController

**文件**: `src/auth/auth.controller.ts`

```typescript
import { Controller, Get, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
// 移除 TenantService 导入

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    // 移除 tenantService
  ) {}

  @Get('feishu/login')
  login(@Res() res: Response) {
    const appId = this.configService.get<string>('FEISHU_APP_ID');
    const redirectUri = encodeURIComponent(
      this.configService.get<string>('FEISHU_REDIRECT_URI') ||
        'http://localhost:3001/api/auth/feishu/callback',
    );

    if (!appId) {
      return res.status(500).send('Feishu AppID not configured');
    }

    const url = `https://open.feishu.cn/open-apis/authen/v1/index?app_id=${appId}&redirect_uri=${redirectUri}`;
    res.redirect(url);
  }

  @Get('feishu/callback')
  async callback(@Query('code') code: string, @Res() res: Response) {
    try {
      // 不传递 tenantSlug
      const data = await this.authService.feishuLogin(code);
      const frontendUrl = 'http://localhost:1921';
      res.redirect(
        `${frontendUrl}/auth/callback?token=${data.access_token}&userInfo=${encodeURIComponent(JSON.stringify(data.user))}`,
      );
    } catch (e: any) {
      res.redirect(`http://localhost:1921/?error=${encodeURIComponent(e.message)}`);
    }
  }
}
```

#### 步骤 4：恢复原始 AuthService

**文件**: `src/auth/auth.service.ts`

移除 `TenantService` 依赖和多租户登录逻辑，恢复为简单的版本。

---

## 推荐执行流程

**我强烈建议选择方案 A（运行迁移）**，因为：

1. ✅ 一次性解决问题
2. ✅ 保留所有多租户功能
3. ✅ 迁移是安全的（会备份现有数据）
4. ✅ 可以回滚（如果需要）

### 快速执行指令

```powershell
# 在 content-backend 目录执行
cd c:\Users\Lx050\Desktop\排版\content-backend

# 编译
npm run build

# 运行迁移
npm run typeorm migration:run -- -d dist/data-source.js
```

**迁移成功后**，你应该看到：
```
query: CREATE TABLE "tenants" ...
query: INSERT INTO "tenants" ...
query: ALTER TABLE "users" ADD "tenantId" ...
Migration AddMultiTenancy1703088000000 has been executed successfully.
```

然后重启后端，登录功能就能正常工作了！

---

**创建时间**: 2025-12-21  
**优先级**: 🔥 高 - 立即执行
