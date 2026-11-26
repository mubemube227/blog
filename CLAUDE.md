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
   - 模板覆盖：根目录 `layouts/`（已有 `search.html`、`index.json`、`404.html`、
     `_default/list.html`、`partials/article.html`、`partials/pagination.html`、
     `partials/post/date.html`、`partials/post/tag.html`、`partials/post/game-review.html`、
     `partials/post/game-radar.html`、`partials/post/game-review-list.html`、`partials/sidebar/commonBar.html`、
     `partials/post.html`、`partials/footer.html`、`shortcodes/game.html`、`shortcodes/game-gallery.html`）
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
5. 文章配图建议 WebP 并压缩。新文章图片随 page bundle 放
   `content/posts/<slug>/images/`；旧文章的图片仍在 `static/images/games/<slug>/`，
   不迁移。原图备份到仓库外 `D:\MDzz\AI\boke\originals\<slug>\`。
6. 提交信息用中文，一句话说明改动。改完先本地 `hugo --gc --minify` 确认无报错再提交。

## 前端设计与验收流程（强制）

涉及页面外观的改动（布局、样式、组件、模板）必须走完这套流程，不能跳步：

1. **先调 skill**：动手前用 Skill 调用 `anthropic-skills:frontend-design`，先写一段简短设计方案（结构、字阶、间距、颜色、对齐），再改代码；没调用就改 CSS 视为违规。
2. **截图**：改完启动本地预览，截四张：桌面 1280 亮色、1280 暗色、平板 1024、手机 390，存到 `scripts-tmp/acceptance/`。
3. **视觉评审**：在本会话创建一个命名子 agent `design-reviewer`（只读，不改文件、不跑构建），把「用户原始要求 + 截图路径 + 本次改了什么」发给它；它用视觉能力判定 PASS / FAIL。
4. **闭环**：FAIL 按问题清单改完重新截图再送审，直到 PASS；与评审意见有分歧时向用户说明，不静默忽略。
5. **汇报**：未 PASS（或用户明确豁免）前，不要对用户说「完成了」；功能与构建验证仍由主 agent 自己做。

评审至少覆盖：需求逐条满足、视觉层级、对齐与间距节奏、字号/行高、亮暗色对比、三档宽度、是否像模板化默认样式。一个评审子 agent 就够，不要为此组队。

## 目录速览

| 路径 | 说明 |
| --- | --- |
| `hugo.toml` | 站点级配置（地址、语言、输出格式、Markdown） |
| `config/_default/params.yml` | Reimu 主题参数（菜单、侧栏、配色、Twikoo 等） |
| `content/posts/` | 文章（`mainSections: ["posts"]`，URL 仍是 `/posts/...`；`/posts/` 列表页已关闭）。新文章是 page bundle：`<slug>/index.md` + `<slug>/images/`；旧文章仍是 `<slug>.md` |
| `archetypes/posts/` | 新文章 page bundle 模板（`index.md` + `images/.gitkeep`）；用 `hugo new content posts/<slug>` 生成 |
| `PUBLISHING.md` | 发布流程、素材清单、验收项（给专门的文章发布会话） |
| `content/about.md` | 关于页 |
| `content/search.md` | 搜索页（`layout: search`） |
| `static/images/banner.svg` | 全局横幅（占位） |
| `static/images/games/<slug>/` | 旧文章的配图（新文章改用 bundle 内的 `images/`） |
| `static/avatar/avatar.svg` | 头像（占位） |
| `static/favicon.ico` | 标签页图标（占位西瓜） |
| `data/covers.yml` | 文章卡片随机封面（占位 SVG） |
| `static/css/custom.css` | 搜索页、手机端标题、深色强调色 |
| `layouts/search.html` + `assets/js/search.js` + `layouts/index.json` | 本地 Fuse.js 搜索 |
| `layouts/404.html` | 自定义 404 页（页面不见了 / 回首页 / 搜索） |
| `layouts/partials/post/game-review.html` | Galgame 作品卡 + 雷达评分 |
| `layouts/shortcodes/game-gallery.html` | 正文 1–2 张视觉图（自然比例 + 灯箱） |
| `content/posts/galgame-demo.md` | 评测组件示例草稿（draft） |
| `content/posts/yosuga-no-sora.md` | 缘之空 + 悠之空评测文章（已发布） |
| `layouts/_default/list.html` | 文章列表模板（`/posts/` 已关闭，保留备用） |
| `layouts/partials/post/date.html` | 文章页元信息（日期/字数；不显示阅读时长） |
| `layouts/partials/post.html` | 文章卡片模板（去掉阅读时长） |
| `layouts/partials/footer.html` | 页脚模板（去掉累计阅读时长） |
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

## Galgame 评测组件

- 新文章用 page bundle：`content/posts/<slug>/index.md` + `images/`；旧文章仍是
  `content/posts/<slug>.md` + `static/images/games/<slug>/`，不迁移。
- 版式命名：**A = 单作品**（`top` + 一个 `games` 条目）；**B = 多作品卡片置顶**
  （`top` + 多个 `games`）；**C = 多作品分段插卡**（`sections` + `game` shortcode）。
- 多作品数据：顶层 `cover` + `review_layout` + `games` 列表，每项含
  `id`、`title`、`original_title`、`tags`、`studio`、`release`、`score`、`cover`、`radar`。
  `radar` 四项：`story`（剧情）、`character`（人设）、`music`（音乐）、`art`（美术），每项 0–10；
  雷达图以 4 分为起点绘制（中心 = 4、外圈 = 10，低于 4 按 4 显示）。
  `original_title` 可选；`tags` 仅用于作品卡展示，不接入站点标签分类法。
- `review_layout: top`（A/B 共用）：`layouts/partials/post/game-review-list.html` 在正文前按
  `games` 顺序渲染卡片。只有一项时是 A 版式：桌面（≥1200）封面固定 320px 宽、按原图比例完整显示
  （不裁切），卡片高度随封面（4:3 约 240px；更宽的横图会在图片下方留一条卡片底色），右侧是标题、
  原名/社团/发售日、标签，最右是雷达（155px）与总分竖栏，总分徽章居中放在雷达正下方；信息区字阶
  与间距相应压缩。≤1199 封面通高在左（裁切填充），右侧自上而下是文字、雷达、总分。
  **≤760 手机卡（A/B/C 统一）**：封面按原比例完整显示、贴边不裁切；标题 22px 与评分块同排并垂直居中；
  标签/值 13px、标签列 4em，文案改为 名称/社团/发行时间；标签胶囊 11px；2×2 四维分数面板显示，雷达隐藏。
  多项时是 B 版式：桌面双列（窄屏单列），标题横跨整卡、
  评分在右下，左列封面+紧凑雷达，右侧依次是原名、社团、发售日、标签（前三行两列对齐）；
  不加标题、不关联正文；≤760 同样切到上面的手机卡（单列、封面自然比例、面板显示）。
- `review_layout: sections`（C 版式）：`layouts/shortcodes/game.html` 按
  `{{< game id="..." >}}` 插卡，卡片标题是 h2，section 带 `id="game-<id>"` 锚点和
  `scroll-margin-top`，首张卡前可写导语。C 卡与 A 卡共用 `game-review--feature` 布局
  （桌面封面 320px 宽、按比例完整显示，信息与雷达压缩；≤1199 平板封面通高；≤760 与 A/B 共用同一套手机卡），
  标题仍是该段 h2/锚点；`.article-entry .game-review-*`
  只做文章内 h2/ul/dl 的排版中和，不要再给 C 单独写卡片网格。
- `layouts/partials/post/game-review.html` 接收 `(dict "game" ... "page" ... "fallbackCover" ... "anchor" ...)`；
  不要改回直接读 `.Params.game`。每项使用自己的 `cover`，页面顶层 `cover` 只做头图。
  旧单作品 `game:` 写法仍兼容（`article.html` 旧分支）；A 版式样本已改用新写法。
- 手机端双语文案：桌面用 `原名/发售日/总分`，≤760 用 `名称/发行时间/评分`，由 `i18n` 的
  `name_mobile` / `release_mobile` / `score_mobile` 与 `game-review-label--desktop|mobile` 双 span 切换；
  2×2 面板由 `game-review.html` 输出，桌面/平板 `display:none`，≤760 与雷达互斥。
- 文章头图继续用 `cover`，组件用 `body:has(.game-review-article)` 加暗色遮罩；
  作品卡里完整显示同一张封面。
- `layouts/partials/post/game-radar.html` 根据四项分数生成内联 SVG，不再使用雷达图片；
  标签固定在四个方向、分数紧跟标签，数据/描边用主题变量，外框只留一条低透明度菱形。
  不再单列「满分 10」注记（总分徽章已有 /10），避免右下角留白。
  不要改回图片，也不要单独分隔成白色方块；深色下不要补 `#eee` 底色。
- C 版式的卡片在 `.article-entry` 内，`custom.css` 对文章 h2 / ul / dl 有 scoped 覆盖；
  C 版式建议 `toc: false`，模板不会自动生成作品目录。
- 正文视觉图用 `layouts/shortcodes/game-gallery.html`：
  `{{< game-gallery >}}` 内放 1–2 个 Markdown 图片；两张都是横图才并排。
- 缺字段显示“待补”并 `warnf`，不阻塞构建；`radar` 任一维度缺失时整体显示待补。
- 示例（均为旧扁平结构，仅参考版式）：`content/posts/yosuga-no-sora.md`（B 版式两卡）、
  `content/posts/c-layout-demo.md`（C 版式演示草稿）、
  `content/posts/galgame-demo.md`（A 版式单作品样本，保持 `draft: true`）。
- 新文章模板：`archetypes/posts/`（`index.md` + `images/.gitkeep`）。
  `hugo new content posts/<slug>` 会生成 `content/posts/<slug>/index.md` 和 `images/`；
  发布前把图片转成 WebP、路径改成 `/posts/<slug>/images/...`。
  发布流程与发布会话交接见 `PUBLISHING.md`。

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
