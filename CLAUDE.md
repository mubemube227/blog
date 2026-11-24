# 项目说明（给接手开发的 AI Agent）

## 这是什么

「瓜圣帝君的博客」：个人博客，主要发布 galgame 游玩心得（中文，文字 + 游戏截图）。
读者主要在中国大陆。已上线：https://blog-7as.pages.dev

## 技术栈与部署

- 生成器：Hugo **0.170.1**
- 主题：**Reimu 0.16.1**（vendored 在 `themes/reimu/`，MIT）
- 仓库：github.com/mubemube227/blog，分支 `main`
- 部署：push 到 main 后，Cloudflare Pages 自动构建上线
  - 构建命令：`hugo --gc --minify`，输出目录：`public`，环境变量 `HUGO_VERSION=0.170.1`
  - Cloudflare Pages 构建镜像自带 Embedded Dart Sass（文档列的是 1.62.1），
    Reimu 的 SCSS 可以直接编译；如果构建日志报 `TOCSS-DART`，先检查构建系统版本
- 本地构建/预览：需要 **Dart Sass**（`sass --version` 可用），否则 Hugo 会报
  `TOCSS-DART: ... You need to install Dart Sass`。本地验证：`hugo --gc --minify`

## 规矩（重要）

1. **不要直接改 `themes/reimu/` 里的文件。** 定制一律用覆盖机制：
   - 主题参数：`config/_default/params.yml`（菜单、横幅、侧栏、配色、评论、特效）
   - 数据：`data/covers.yml`（随机封面）、`data/friends.yml`（友链）
   - 模板覆盖：根目录 `layouts/`（已有 `search.html`、`index.json`、
     `_default/list.html`、`partials/pagination.html`、`partials/post/date.html`、
     `partials/post/tag.html`、`partials/sidebar/commonBar.html`）
   - 自定义样式：`static/css/custom.css`，通过 `params.yml` 的
     `injector.head_end` 引入
   - 自定义脚本：`assets/js/`（现有 `search.js`、`fuse.basic.min.js`）
2. **不要改 `hugo.toml` 的 `baseURL`**（已是正式地址）。
3. 设计基调是**紫蓝色二次元但克制**：横幅 + 右侧栏 + 封面卡片，但特效只保留
   暗色模式、加载动画、卡片悬浮和目录。**不要**开启烟花、灵梦鼠标指针、Live2D、
   音乐播放器（`params.yml` 里已关闭），也不要新增会自动播放的媒体。
4. 读者在大陆：**不要启用 Google Fonts**（`font.enable: false`，用系统字体）；
   不要把资源换成境外 CDN。主题默认 vendor 用 `webcache`（国内 npm 镜像），
   Twikoo 已本地化；新增第三方资源优先放 `static/` 或 `assets/`。
5. 文章配图建议 WebP 并压缩；新图片放 `static/images/`。
6. 提交信息用中文，一句话说明改动。改完先本地 `hugo --gc --minify` 确认无报错再提交。

## 目录速览

| 路径 | 说明 |
| --- | --- |
| `hugo.toml` | 站点级配置（地址、语言、输出格式、Markdown） |
| `config/_default/params.yml` | Reimu 主题参数（菜单、侧栏、配色、Twikoo 等） |
| `content/posts/` | 文章（`mainSections: ["posts"]`，URL 仍是 `/posts/...`；`/posts/` 列表页已关闭） |
| `content/about.md` | 关于页 |
| `content/search.md` | 搜索页（`layout: search`） |
| `static/images/banner.svg` | 全局横幅（占位） |
| `static/avatar/avatar.svg` | 头像（占位） |
| `static/favicon.ico` | 标签页图标（占位西瓜） |
| `data/covers.yml` | 文章卡片随机封面（占位 SVG） |
| `static/css/custom.css` | 搜索页、手机端标题、深色强调色 |
| `layouts/search.html` + `assets/js/search.js` + `layouts/index.json` | 本地 Fuse.js 搜索 |
| `layouts/_default/list.html` | 文章列表模板（`/posts/` 已关闭，保留备用） |
| `layouts/partials/post/date.html` | 文章页元信息（日期/字数/阅读时间） |
| `themes/reimu/` | 主题本体，不要改 |
| `themes/PaperMod/` | 旧主题，保留用于回滚 |
| `assets/css/extended/custom.css` | 旧 PaperMod 的样式，现已不加载（仅备份） |
| `layouts/partials/comments.papermod.html.bak` | 旧 PaperMod 评论模板（仅备份） |

## 评论系统状态（Twikoo）

- Reimu 内置 Twikoo 支持，前端 **2.0.17** 已放在
  `static/resources/twikoo@2.0.17/dist/twikoo.all.min.js`，`data/vendor.yml` 用
  `local|` 指向它。
- `config/_default/params.yml` 的 `twikoo.envId` 目前留空：文章页不加载
  评论脚本、不显示评论区；填上 Netlify functions 地址后自动启用。
- 后端**尚未部署**（博主暂停中）。已定方案：**Netlify + MongoDB Atlas**
  （官方仓库 twikoojs/twikoo-netlify，envId 形如
  `https://站点名.netlify.app/.netlify/functions/twikoo`）。
- 不要改走 Cloudflare Workers：workers.dev 在大陆 DNS 污染不可达，且不支持
  SMTP 邮件通知（博主明确要求评论邮件通知，Netlify 的 Node 环境支持 QQ 邮箱 SMTP）。

## 页面与导航

- 顶部导航只保留首页 / 搜索 / 关于。
- `/archives/` 已删除；`/tags/` 与标签分类法已关闭，文章底部标签链接和侧栏标签入口已移除。
- `content/posts/_index.md` 用 `build.render: never` 关闭 `/posts/` 列表页，文章仍从首页和文章 URL 访问。
- 分类页 `/categories/` 保留。

## 搜索

- 使用本地 Fuse.js，不依赖 Algolia。
- 数据源：`hugo.toml` 的 `[outputs].home` 保留 `JSON`，
  `layouts/index.json` 生成 `/index.json`。
- 页面：`layouts/search.html` + `assets/js/search.js`。
- 不要把搜索切回 Algolia（国内访问和申请成本都不合适）。

## 可选优化方向（博主会在对话里挑选，别一次全做）

- 替换横幅/头像/随机封面为博主自己的角色图或游戏截图
- 给文章加 `cover` / `banner`，让卡片和文章页头图更贴合作品
- 图片灯箱与懒加载（主题已内置 PhotoSwipe/lazysizes，可调样式）
- galgame 作品信息卡 shortcode（社团 / 发售日 / 博主评分等）
- 第三方资源本地化、构建产物体积检查（当前 `themes/reimu/static/resources` 约 13MB，
  可裁剪未使用的 MathJax/Mermaid/KaTeX）
- favicon、社交分享 OG 图与 meta 补全
- 中文字体与排版微调（行距、标题层级、深色模式配色）
