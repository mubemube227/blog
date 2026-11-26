# 瓜圣帝君的博客 —— 源码仓库

Hugo 静态博客，主题 **Reimu**，托管在 Cloudflare Pages，评论用 Twikoo。

## 日常写作与发布（最常用）

1. 新建文章：用 `hugo new content posts/<slug>` 生成 page bundle
   `content/posts/<slug>/index.md` + `images/`（只给目录名，不要加 `/index.md`）
2. 写文章：照 `index.md` 里的模板填标题、正文、版式、作品数据；`draft: true` 是草稿，
   写完改成 `false` 才会发布
   - `cover`：页面头图/列表封面；先写文件名（如 `cover.webp`），发布前由发布会话
     改成 `/posts/<slug>/images/cover.webp`；不填会从 `data/covers.yml` 的占位图里随机取
   - 可选 `banner`：文章页顶部大图；不填则使用 `cover` 或全局横幅
3. 配图：图片放进 `content/posts/<slug>/images/`，正文用 `game-gallery` 引入
   （见下面「Galgame 评测组件」）；截图建议 WebP，发布会话会用本地 Pillow 转换
4. 发布：确认内容和版式后才提交；只提交这篇文章的文件夹
   ```
   git add content/posts/<slug>
   git commit -m "新文章：标题"
   git push
   ```
   Cloudflare Pages 会自动构建，2~3 分钟后上线。

## Galgame 评测组件

三种版式统一叫 **A / B / C**：

- **A 版式**：单作品，`review_layout: top` + 一个 `games` 条目，整行四块卡 + 一篇完整正文。
- **B 版式**：多作品，卡片置顶，`review_layout: top` + 多个 `games` 条目，正文整体写。
- **C 版式**：多作品，分段插卡，`review_layout: sections` + 正文 `{{< game id="..." >}}`。

A 和 B 共用 `top`，模板按 `games` 数量自动切换；单作品旧写法 `game:` 仍兼容。

```yaml
cover: /posts/<slug>/images/cover.webp
review_layout: top   # A/B 用 top（单作品一项 / 多作品多项）；C 用 sections
games:
  - id: game-id
    title: 游戏名
    original_title: ヨスガノソラ
    tags: [ADV, 乡村, 妹系]
    studio: 社团
    release: 2024-06-28
    score: 8.6
    cover: /posts/<slug>/images/cover-<id>.webp
    radar:
      story: 6
      character: 8
      music: 6
      art: 7
```

> 旧文章仍用 `/images/games/...`；新文章的图片在 `content/posts/<slug>/images/`，
> 发布前由发布会话把文件名改成 `/posts/<slug>/images/...`。

- **A 版式**（`top` + 一项）：桌面（≥1200）封面固定 320px 宽、按原图比例完整显示，卡片高度随封面；右侧是标题、原名/社团/发售日、标签，最右是雷达与总分（总分在雷达正下方）；≤1199 封面通高在左、右侧文字与雷达上下排列。手机端（≤760）A/B/C 统一为：封面自然比例不裁切、标题与评分同排、名称/社团/发行时间、标签、四维分数面板，雷达隐藏。
- **B 版式**（`top` + 多项）：卡片在正文前双列并排（窄屏单列），标题横跨卡片、评分在右下，左列是封面+雷达，右侧依次是原名、社团、发售日、标签。不加标题、不关联正文，正文继续写整体评测；≤760 同样切到手机卡。
- **C 版式**（`sections`）：写作时在每段开头写 `<!-- game: 作品名 -->`，发布前由发布会话替换成 `{{< game id="game-id" >}}`；卡片标题即该段 h2 和锚点，首张卡前可写导语。C 卡直接复用 A 卡的 `game-review--feature` 布局（桌面封面按比例完整显示、卡片高度随图；平板封面通高；≤760 与 A/B 共用手机卡），单作品一般不用。
- 每项使用自己的 `cover`；顶层 `cover` 只做文章头图；`id` 用于 C 版式插卡。
- `original_title`、`tags` 可选；`tags` 只展示，不会生成站点标签页。
- 总分 10 分制；雷达图由 Hugo 内联 SVG 根据四项分数生成，以 4 分为起点（中心 = 4、外圈 = 10），不再使用图片。
- 顺序固定为剧情（上）、人设（右）、音乐（下）、美术（左），每项 0–10；分数直接标在四项标签后，不额外放刻度注记。
- 缺字段会显示“待补”并在构建日志警告，不阻塞预览。
- C 版式建议设置 `toc: false`，模板不会自动生成作品目录。
- 正文视觉图用 `game-gallery`：

```go
{{< game-gallery >}}
![游戏截图 1](/posts/<slug>/images/01.webp)
![游戏截图 2](/posts/<slug>/images/02.webp)
{{< /game-gallery >}}
```

写作时只写文件名（如 `![游戏截图 1](01.webp)`），发布会话会改成站点绝对路径。

两张都是横图时并排，否则上下；点击用主题自带灯箱放大。

A 版式样本：`content/posts/galgame-demo.md`（单作品，`draft: true`）；B 版式样稿：`content/posts/yosuga-no-sora.md`（两卡）；C 版式演示：`content/posts/c-layout-demo.md`（`draft: true`）。这三个都是旧的扁平结构，仅作版式参考；新文章从 `archetypes/posts/` 的模板开始。旧 `game:` 写法仍兼容，但不再作为新文章示例。

新建文章用 `hugo new content posts/<slug>`（只给目录名），会套用 `archetypes/posts/` 的目录模板，生成 `index.md` + `images/`。完整发布流程、素材清单和验收项见 [PUBLISHING.md](PUBLISHING.md)。

## 本地预览（可选）

Reimu 主题使用 SCSS。Hugo 0.170.1 自身不再内置 Sass 编译器，需要另外装 **Dart Sass**：

1. 安装 Hugo 0.170.1（或更高）和 Dart Sass
2. 确认命令行里能运行 `sass --version`
3. 在仓库根目录运行 `hugo server -D`，打开 http://localhost:1313

本地构建验证同样要能找到 `sass`：

```
hugo --gc --minify
```

如果报 `TOCSS-DART ... You need to install Dart Sass`，就是 Dart Sass 没装好或不在 PATH 里。

## 目录说明

| 路径 | 作用 |
| --- | --- |
| `hugo.toml` | 站点级配置：地址、语言、输出格式、Markdown |
| `config/_default/params.yml` | Reimu 主题参数：菜单、横幅、侧栏、配色、评论、特效 |
| `content/posts/` | 文章（首页展示；`/posts/` 列表页已关闭）。新文章是 `content/posts/<slug>/index.md` + `images/`；旧文章仍是 `<slug>.md` |
| `archetypes/posts/` | 新文章 page bundle 模板（`index.md` + `images/.gitkeep`）；用 `hugo new content posts/<slug>` 生成 |
| `PUBLISHING.md` | 文章发布流程与发布会话交接文档 |
| `content/about.md` | 关于页 |
| `content/search.md` | 搜索页 |
| `static/images/banner.svg` | 首页/文章页横幅（当前是占位图，可替换） |
| `content/posts/<slug>/images/` | 新文章的配图（WebP；旧文章仍在 `static/images/games/<slug>/`） |
| `static/avatar/avatar.svg` | 头像（当前是占位图，可替换） |
| `static/favicon.ico` | 浏览器标签页图标（当前是占位西瓜） |
| `data/covers.yml` | 文章卡片随机封面 |
| `static/css/custom.css` | 自定义样式（搜索页、手机端标题、深色强调色） |
| `layouts/search.html`、`assets/js/search.js`、`layouts/index.json` | 站内本地搜索（Fuse.js） |
| `layouts/404.html` | 自定义 404 页 |
| `layouts/partials/post/game-review.html`、`layouts/partials/post/game-radar.html`、`layouts/partials/post/game-review-list.html`、`layouts/shortcodes/game.html`、`layouts/shortcodes/game-gallery.html` | Galgame 作品卡、顶部列表、分段插卡、雷达图与正文图组件 |
| `layouts/_default/list.html` | 文章列表模板（`/posts/` 已关闭，保留备用） |
| `layouts/partials/post/date.html` | 文章页元信息（日期、字数） |
| `themes/reimu/` | 主题本体，不要直接改里面的文件 |
| `themes/PaperMod/` | 旧主题，保留用于回滚 |

> 顶部导航只有首页、搜索、关于。`/archives/` 和 `/tags/` 页面已删除，标签分类法已关闭；分类页仍保留。

## 评论

Reimu 内置 Twikoo 支持，前端脚本 2.0.17 已放在本地
`static/resources/twikoo@2.0.17/`。envId 在
`config/_default/params.yml` 的 `twikoo.envId`，目前留空：
文章页不会加载评论脚本，也不会显示评论区。填上 Netlify 的 functions 地址后，
评论会自动出现。

Twikoo 后端的既定方案是 **Netlify + MongoDB Atlas**（不要走 Cloudflare Workers，
workers.dev 在大陆 DNS 污染不可达，也不支持 SMTP 邮件通知）。

## 上线步骤

见同目录的《部署清单.md》（需要用到你自己的 GitHub / Cloudflare 账号）。
