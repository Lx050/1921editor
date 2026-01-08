# 版式装配引擎 (Paiban)

一款高速版式装配引擎，能将无格式的纯文本，一键转化为视觉统一、可直接用于发布平台的HTML代码。

## 项目概览

- **前端**: Vue 3 + Vite + TailwindCSS
- **后端**: NestJS + PostgreSQL
- **部署**: Docker + Nginx
- **生产环境**: http://paiban.lx05.art

## 核心功能

- **智能文本解析** - 自动清理格式并智能分割内容块
- **可视化编辑** - 幕布式工作区，直观的内容类型标记
- **一键生成** - 基于模板的样式应用，输出即用型HTML
- **实时预览** - iframe预览窗口，所见即所得
- **复制即用** - 直接复制HTML代码到135编辑器等平台

## 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动前端开发服务器
npm run dev

# 启动后端开发服务器
cd content-backend
npm run start:dev
```

### Docker 部署

```bash
# 构建并启动所有服务
docker compose up -d --build

# 运行数据库迁移
docker compose run --rm backend npm run migration:run
```

详细的部署指南请参考 [DOCKER_DEPLOYMENT_LOG.md](./DOCKER_DEPLOYMENT_LOG.md)

## 项目结构

```
.
├── src/                    # 前端源代码
│   ├── components/         # Vue 组件
│   ├── stores/            # Pinia 状态管理
│   └── utils/             # 工具函数
├── content-backend/       # 后端源代码 (NestJS)
│   ├── src/
│   │   ├── entities/      # TypeORM 实体
│   │   ├── migrations/    # 数据库迁移
│   │   └── modules/       # 功能模块
│   └── uploads/           # 上传文件目录
├── docker-compose.yml     # Docker 编排配置
├── Dockerfile             # 前端 Docker 镜像
├── nginx.conf             # Nginx 配置
└── Prd.md                 # 产品需求文档
```

## 技术栈

### 前端
- **Vue 3** - 渐进式JavaScript框架
- **Pinia** - Vue状态管理库
- **TailwindCSS** - 实用优先的CSS框架
- **Vite** - 快速的构建工具

### 后端
- **NestJS** - Node.js 企业级框架
- **TypeORM** - TypeScript ORM
- **PostgreSQL** - 关系型数据库
- **JWT** - 身份认证

## 环境配置

复制 `.env.example` 到 `.env` 并配置：

```env
# 数据库配置
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=paiban

# JWT 配置
JWT_SECRET=your_jwt_secret

# 微信公众号配置
WECHAT_APP_ID=your_app_id
WECHAT_APP_SECRET=your_app_secret

# 前端 URL
FRONTEND_URL=http://localhost:5173
```

## 数据库迁移

```bash
# 生成新的迁移
npm run migration:generate -- src/migrations/MigrationName

# 运行迁移
npm run migration:run

# 回滚迁移
npm run migration:revert
```

## 生产部署

### 部署信息

- **域名**: paiban.lx05.art
- **服务器**: 101.42.158.32
- **部署路径**: /root/paiban
- **前端端口**: 127.0.0.1:1922
- **后端端口**: 3001

### 部署步骤

1. 上传代码到服务器 `/root/paiban`
2. 配置环境变量 `.env`
3. 构建并启动服务：
   ```bash
   docker compose up -d --build
   docker compose run --rm backend npm run migration:run
   ```
4. 验证服务状态：
   ```bash
   docker compose ps
   curl -I http://paiban.lx05.art
   ```

### 更新流程

```bash
# 1. 拉取最新代码
cd /root/paiban
git pull

# 2. 重新构建并启动
docker compose build --no-cache backend
docker compose up -d --build

# 3. 运行迁移
docker compose run --rm backend npm run migration:run

# 4. 验证
docker compose ps
```

## 文档

- [产品需求文档 (PRD)](./Prd.md) - 完整的产品设计和架构说明
- [Docker 部署日志](./DOCKER_DEPLOYMENT_LOG.md) - 部署经验和最佳实践
- [公众号图文上传接口文档](./公众号图文上传全流程接口文档.md) - 微信公众号集成

## 许可证

MIT License
