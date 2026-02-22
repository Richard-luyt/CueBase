# CueBase Frontend (Next.js)

Single-page app: login/signup, dashboard (Home / Files / Start Chat / My Teams / My purchases / Account Settings). Uses the B2 API at `http://localhost:8000/api`.

## NPM 依赖安装

在 **`frontend`** 目录下执行：

```bash
cd frontend
npm install
```

会安装的依赖包括：

- **next** – Next.js 框架  
- **react** / **react-dom** – React  
- **axios** – 请求 B2 接口  
- **react-markdown** – 展示 AI 回答的 Markdown  
- **eslint** / **eslint-config-next** – 代码检查（dev）

## 静态资源（图片）

请把 B1 的图片复制到 `frontend/public/images/`：

- `SigninPage.svg` → 登录页左侧背景  
- `new_logo.png` → 侧边栏 logo（若 B1 里是 `logo.svg`，可复制为 `new_logo.png` 或把 `DashboardView.jsx` 里的 `src` 改为 `/images/logo.svg`）

例如：

```bash
# 在项目根目录
cp B1/images/SigninPage.svg frontend/public/images/
cp B1/images/new_logo.png frontend/public/images/
# 若没有 new_logo.png，可用 logo.svg 并改组件里的路径
cp B1/images/logo.svg frontend/public/images/
```

## 运行

```bash
npm run dev
```

默认打开 http://localhost:3000 。确保 B2 后端已在 `http://localhost:8000` 运行。

## 构建

```bash
npm run build
npm run start
```
