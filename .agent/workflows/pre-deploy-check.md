---
description: 部署前 Git 状态检查与同步工作流。在执行部署前自动检查未提交的更改、同步 develop 分支，确保代码是最新状态。
---

# 部署前 Git 状态检查与同步

此工作流在执行 `/deploy-app` 前自动运行，确保代码处于最新、干净的状态。

## 执行流程

### 阶段 1：Git 状态检查

// turbo
1. **检查当前分支**
   ```powershell
   git branch --show-current
   ```
   确认当前工作分支名称

// turbo
2. **检查未提交的更改**
   ```powershell
   git status --porcelain
   ```
   
   **判断逻辑：**
   - ✅ 如果输出为空：无未提交更改，继续流程
   - ⚠️ 如果有输出：存在未提交更改，**终止流程并提示用户**
   
   **提示内容：**
   ```
   ⚠️ 检测到未提交的 Git 更改！
   
   请先处理以下更改：
   [列出 git status 输出]
   
   您可以选择：
   1. 提交更改：git add . && git commit -m "描述"
   2. 暂存更改：git stash
   3. 放弃更改：git checkout -- .（谨慎使用）
   
   处理完成后，请重新运行此工作流。
   ```

### 阶段 2：同步 develop 分支

// turbo
3. **切换到 develop 分支**
   ```powershell
   git checkout develop
   ```

// turbo
4. **拉取最新的 develop 代码**
   ```powershell
   git pull origin develop
   ```

// turbo
5. **切换回原分支**
   ```powershell
   git checkout <步骤1检测到的分支名>
   ```

// turbo
6. **合并 develop 到当前分支**
   ```powershell
   git merge develop
   ```

// turbo
7. **检测合并状态**
   ```powershell
   git status
   ```
   
   **判断逻辑：**
   - ✅ 无冲突：提示"合并成功，准备部署"，继续流程
   - ⚠️ 有冲突：**终止流程并提示用户**
   
   **冲突提示内容：**
   ```
   ⚠️ 检测到合并冲突！
   
   请手动解决冲突：
   1. 使用 IDE Git 工具（推荐 VSCode/Cursor）
   2. 解决所有冲突文件
   3. 执行：git add . && git commit -m "merge: 解决与 develop 的冲突"
   
   冲突解决后，请重新运行此工作流。
   ```

### 阶段 3：代码质量检查

// turbo
8. **TypeScript 类型检查**
   ```powershell
   npm run type-check
   ```
   
   **判断逻辑：**
   - ✅ 无错误：继续流程
   - ❌ 有错误：**终止流程并提示用户修复类型错误**

### 阶段 4：自动触发部署

9. **所有检查通过，执行部署**
   
   提示用户：
   ```
   ✅ 所有部署前检查通过！
   
   - 当前分支：<分支名>
   - Git 状态：干净，无未提交更改
   - develop 同步：已合并最新代码
   - 类型检查：通过
   
   现在可以安全部署，是否继续执行 /deploy-app？
   ```
   
   **用户确认后：**
   自动调用 `/deploy-app` 工作流的所有步骤

## 快速使用

**触发示例：**
```
"准备部署，先检查一下 Git"
"部署前检查"
"我要部署了，帮我检查 Git 状态"
```

**完整部署流程：**
```
用户："/pre-deploy-check"
    ↓
检查 Git 状态（步骤 1-2）
    ↓
同步 develop 分支（步骤 3-7）
    ↓
代码质量检查（步骤 8）
    ↓
[用户确认]
    ↓
执行 /deploy-app（自动）
```

## 错误处理矩阵

| 检测到的问题 | 处理方式 | 用户操作 |
|-------------|---------|---------|
| 未提交的更改 | 🛑 终止流程 | 提交/暂存/放弃更改后重试 |
| 合并冲突 | 🛑 终止流程 | 手动解决冲突后重试 |
| 类型检查失败 | 🛑 终止流程 | 修复类型错误后重试 |
| 所有检查通过 | ✅ 继续部署 | 确认后自动执行 /deploy-app |

## 重要提示

1. **此工作流设计为"守门员"**
   - 必须所有检查通过才能部署
   - 任何问题都将终止流程，确保部署安全

2. **与现有工作流的关系**
   - 替代直接调用 `/deploy-app`
   - 内部集成了 `/git-merge-to-develop` 的核心逻辑
   - 成功后自动触发 `/deploy-app`

3. **建议使用场景**
   - 功能开发完成，准备部署到生产
   - 日常迭代部署
   - 紧急修复后的快速部署

4. **不适用场景**
   - 仅测试本地构建（直接用 npm run type-check）
   - 回滚操作（需手动处理）
   - 首次部署（需手动配置环境）

## 手动检查命令（可选）

如果需要手动检查，可以逐步执行：

```powershell
# 查看当前分支
git branch --show-current

# 查看未提交的更改
git status

# 查看与 develop 的差异
git fetch origin develop
git log HEAD..origin/develop --oneline

# 查看类型错误
npm run type-check
```
