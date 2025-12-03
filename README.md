# 心境追踪 Mood Tracker

双相障碍情绪与生理数据追踪分析工具（云端版）

## 部署到 Vercel

### 1. 推送到 GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/mood-tracker.git
git push -u origin main
```

### 2. 在 Vercel 导入项目

1. 打开 https://vercel.com/dashboard
2. 点击 "Add New" → "Project"
3. 导入你的 GitHub 仓库
4. 添加环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. 点击 Deploy

## 本地开发

```bash
npm install
npm run dev
```

打开 http://localhost:3000

## 技术栈

- Next.js 14
- React 18
- Supabase（数据库 + 用户认证）
- Recharts（图表）
- Vercel（部署）
