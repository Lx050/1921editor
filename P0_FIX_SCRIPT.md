# 🚀 P0 紧急修复 - 快速执行脚本

## ⚠️ 执行前准备

```bash
# 1. 备份当前代码
git add .
git commit -m "backup: before P0 fixes"
git branch backup-$(date +%Y%m%d)

# 2. 确保环境变量正确
cd content-backend
cat .env | grep JWT_SECRET
cat .env | grep FEISHU_VERIFICATION_TOKEN
```

---

## 🔧 修复 1: JWT Secret 强制验证

### 文件: `content-backend/src/auth/auth.module.ts`

```bash
# 打开文件
code content-backend/src/auth/auth.module.ts
```

**替换内容**:
```typescript
// 找到 JwtModule.register 部分，替换为：
JwtModule.registerAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret || secret.length < 32) {
      throw new Error('JWT_SECRET must be at least 32 characters');
    }
    return {
      secret,
      signOptions: { expiresIn: '7d' },
    };
  },
  inject: [ConfigService],
}),
```

**测试**:
```bash
# 临时删除 JWT_SECRET 测试
mv .env .env.backup
echo "DATABASE_URL=postgresql://..." > .env
npm run start:dev
# 应该看到错误: JWT_SECRET must be at least 32 characters

# 恢复
mv .env.backup .env
npm run start:dev
```

---

## 🔧 修复 2: Webhook 签名验证

### 文件: `content-backend/src/feishu/feishu-webhook.guard.ts`

```bash
# 完全替换文件内容
cat > content-backend/src/feishu/feishu-webhook.guard.ts << 'EOF'
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class FeishuWebhookGuard implements CanActivate {
  private readonly logger = new Logger(FeishuWebhookGuard.name);

  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    
    const timestamp = request.headers['x-lark-request-timestamp'];
    const nonce = request.headers['x-lark-request-nonce'];
    const signature = request.headers['x-lark-signature'];
    
    // 验证必需头部
    if (!timestamp || !nonce || !signature) {
      this.logger.warn('Missing required headers');
      throw new UnauthorizedException('Missing required headers');
    }
    
    // 防重放攻击：5分钟内有效
    const requestTime = parseInt(timestamp) * 1000;
    const now = Date.now();
    const timeDiff = Math.abs(now - requestTime);
    
    if (timeDiff > 5 * 60 * 1000) {
      this.logger.warn(`Request expired. Time diff: ${timeDiff}ms`);
      throw new UnauthorizedException('Request timestamp expired');
    }
    
    // 验证签名
    const token = this.configService.get<string>('FEISHU_VERIFICATION_TOKEN');
    if (!token) {
      this.logger.error('FEISHU_VERIFICATION_TOKEN not configured');
      throw new UnauthorizedException('Server configuration error');
    }
    
    const body = JSON.stringify(request.body);
    const data = `${timestamp}${nonce}${token}${body}`;
    const expectedSignature = crypto
      .createHash('sha256')
      .update(data)
      .digest('hex');
    
    if (expectedSignature !== signature) {
      this.logger.warn('Invalid signature');
      throw new UnauthorizedException('Invalid signature');
    }
    
    this.logger.log('Webhook signature verified');
    return true;
  }
}
EOF
```

**测试**:
```bash
# 使用 curl 测试错误签名
curl -X POST http://localhost:3001/api/webhook/feishu \
  -H "x-lark-request-timestamp: $(date +%s)" \
  -H "x-lark-request-nonce: test123" \
  -H "x-lark-signature: invalid_signature" \
  -H "Content-Type: application/json" \
  -d '{"type":"url_verification"}'

# 应该返回 401 Unauthorized
```

---

## 🔧 修复 3: 文件上传大小限制

### 文件: `content-backend/src/feishu/feishu-message.handler.ts`

在文件顶部添加常量：
```typescript
export class FeishuMessageHandler {
  private readonly logger = new Logger(FeishuMessageHandler.name);
  private readonly uploadDir = path.join(process.cwd(), 'uploads');
  private readonly MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
```

找到 `downloadFile` 方法，添加大小检查：
```typescript
private async downloadFile(fileKey: string, messageId: string): Promise<Buffer> {
  this.logger.log(`Downloading file: ${fileKey}`);
  
  const response = await this.client.request({
    method: 'GET',
    url: `/open-apis/im/v1/messages/${messageId}/resources/${fileKey}`,
    params: { type: 'file' },
    responseType: 'arraybuffer',
  });
  
  // 检查 Content-Length
  const contentLength = response.headers?.['content-length'];
  if (contentLength) {
    const size = parseInt(contentLength);
    if (size > this.MAX_FILE_SIZE) {
      throw new BadRequestException(
        `File too large: ${(size / 1024 / 1024).toFixed(2)}MB. Max: 50MB`
      );
    }
  }
  
  const buffer = Buffer.from(response.data);
  
  // 二次验证实际大小
  if (buffer.length > this.MAX_FILE_SIZE) {
    throw new BadRequestException(
      `File size exceeds limit: ${(buffer.length / 1024 / 1024).toFixed(2)}MB`
    );
  }
  
  this.logger.log(`File downloaded: ${(buffer.length / 1024).toFixed(2)}KB`);
  return buffer;
}
```

**添加导入**:
```typescript
import { BadRequestException } from '@nestjs/common';
```

---

## 🔧 修复 4: 前端 401 自动跳转

### 文件: `src/utils/api.ts`

```bash
# 完全替换文件内容
cat > src/utils/api.ts << 'EOF'
import axios from 'axios';
import router from '../router';
import { ElMessage } from 'element-plus';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;
    
    if (status === 401) {
      // 清除 token
      sessionStorage.removeItem('token');
      
      // 显示提示
      ElMessage.error('登录已过期，请重新登录');
      
      // 跳转登录页，保存当前路径
      const currentPath = router.currentRoute.value.fullPath;
      if (currentPath !== '/login') {
        router.push({
          path: '/login',
          query: { redirect: currentPath }
        });
      }
    } else if (status === 403) {
      ElMessage.error('没有权限访问该资源');
    } else if (status === 404) {
      ElMessage.error('请求的资源不存在');
    } else if (status >= 500) {
      ElMessage.error('服务器错误，请稍后重试');
    } else if (message) {
      ElMessage.error(message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
EOF
```

**测试**:
```bash
# 1. 清除 token
# 在浏览器 Console 执行:
sessionStorage.removeItem('token')

# 2. 访问需要认证的页面
# 应该自动跳转到登录页
```

---

## ✅ 验证所有修复

```bash
# 1. 重新编译
cd content-backend
npm run build

# 2. 重启服务
npm run start:dev

# 3. 检查日志
# 应该看到:
# - [Bootstrap] Application is running on: http://localhost:3001
# - 没有 JWT_SECRET 相关错误

# 4. 测试 Webhook
curl -X POST http://localhost:3001/api/webhook/feishu \
  -H "x-lark-request-timestamp: 9999999999" \
  -H "x-lark-request-nonce: test" \
  -H "x-lark-signature: invalid" \
  -H "Content-Type: application/json" \
  -d '{}'

# 应该返回: {"statusCode":401,"message":"Request timestamp expired",...}

# 5. 测试前端
cd ..
npm run dev
# 访问 http://localhost:1921
# 清除 token 后访问文章页，应该跳转登录
```

---

## 📝 提交代码

```bash
git add .
git commit -m "fix(security): P0 critical security fixes

- Enforce JWT_SECRET validation
- Complete Feishu webhook signature verification
- Add file upload size limit (50MB)
- Auto redirect to login on 401

Refs: CODE_REVIEW_SUMMARY.md"

git push origin main
```

---

## 🎉 完成检查清单

- [ ] JWT Secret 验证生效
- [ ] Webhook 签名验证完整
- [ ] 文件大小限制生效
- [ ] 401 自动跳转登录
- [ ] 所有测试通过
- [ ] 代码已提交

---

**预计执行时间**: 2.5 小时  
**难度**: ⭐⭐⭐☆☆  
**优先级**: 🔴 P0 - 紧急

**如遇问题，请查看**:
- `CODE_REVIEW_BACKEND.md` - 详细问题说明
- `URGENT_FIX_PLAN.md` - 完整修复计划
