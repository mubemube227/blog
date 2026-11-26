# 文章发布指南（交接文档）

这份文档给**专门负责发布文章的 Claude 会话**看。目标：拿到素材后，按本站模板写文章、放图片、本地验收，最后在博主明确同意后提交并上线。

## 先读什么

1. `CLAUDE.md`：项目规则、主题与部署方式、不能改的东西。
2. `README.md` 的「Galgame 评测组件」一节：A/B/C 版式与 shortcode 用法。
3. 本文档：发布流程与验收清单。

## 一次发布的标准流程

1. **收素材**：标题、正文、图片、作品数据（作品名、原名、社团、发售日、总分、四项评分、标签）。
2. **确定版式**：单作品 / 多作品 A / 多作品 B（见下文）。
3. **建文章**：在 `content/posts/` 新建 `<英文或拼音>.md`，文件名会成为 URL。
4. **放图片**：放到 `static/images/games/<slug>/`，建议 WebP。
5. **本地预览**：桌面 1280、手机 390、暗色模式各看一遍。
6. **构建校验**：停预览 → `hugo --gc --minify`，确认无 ERROR、无缺字段 warning。
7. **给博主看**：截图或让博主打开本地预览，确认版式和文字。
8. **提交 / 上线**：只有博主明确说「发布 / 上线 / 推」才执行 commit + push。
9. **上线后检查**：`https://blog-7as.pages.dev/posts/<slug>/`。

## 三种版式怎么选

| 版式 | 场景 | 写法 | 效果 |
| --- | --- | --- | --- |
| **A** | 一篇文章只评一个作品（最常用） | `review_layout: top` + `games` 只写一项 | 桌面封面按比例完整显示（320px 宽），卡片高度随图；平板封面通高裁切；正文整体 |
| **B** | 一篇文章多个作品，正文整体写 | `review_layout: top` + `games` 多项 | 卡片全部在正文前，双列并排（窄屏单列），卡片只展示、不关联正文 |
| **C** | 一篇文章多个作品，每个作品单独一段 | `review_layout: sections` + 正文 `{{< game id="..." >}}` | 卡片 → 该作品正文 → 下一张卡片；卡片标题就是该段的 h2 和锚点，卡片外观与 A 版一致 |
| 旧文章兼容 | 单作品 | `game:` | 沿用旧的三栏卡样式，仍可渲染，不需要迁移 |

A/B 共用 `top`，模板按 `games` 数量自动切换。A/B 建议 `toc: false`；C 必须 `toc: false`（避免卡片标题自动进目录）。C 版式首张卡前可以写导语。

## Frontmatter 模板

### A 版式：单作品（最常用）

```yaml
---
title: "文章标题"
date: 2026-11-25T21:00:00+08:00
draft: false
categories: ["Galgame"]
cover: "/images/games/<slug>/banner.webp"
description: "一句话概括。"
toc: false
review_layout: top
games:
  - id: <slug>
    title: "作品名"
    original_title: "オリジナルタイトル"
    tags: ["ADV", "标签"]
    studio: "社团"
    release: "2024-06-28"
    score: 8.6
    cover: "/images/games/<slug>/cover.webp"
    radar:
      story: 8
      character: 9
      music: 7
      art: 8
---
```

A 版式用 `review_layout: top`，`games` 只放一项；桌面（≥1200）封面固定 320px 宽、按原图比例完整显示，卡片高度随封面，右侧从上到下是标题、原名/社团/发售日、标签，最右是雷达与总分（总分徽章在雷达正下方）；≤1199 平板封面通高并裁切。手机端（≤760）A/B/C 统一：封面自然比例不裁切、标题与评分同排、名称/社团/发行时间、四维分数面板，雷达隐藏。不用写 `sections`，也不用退回旧的 `game:` 写法。可直接参考示例草稿 `content/posts/galgame-demo.md`（`draft: true`）。

### B 版式：多作品，卡片置顶

```yaml
---
title: "缘之空+悠之空"
date: 2026-11-24T21:00:00+08:00
draft: false
categories: ["Galgame"]
cover: "/images/games/yosuga-no-sora/cover.webp"
description: "一句话概括，会出现在列表和搜索结果里。"
toc: false
review_layout: top
games:
  - id: yosuga
    title: "缘之空"
    original_title: "ヨスガノソラ"
    tags: ["ADV", "乡村", "妹系", "巫女"]
    studio: "Sphere"
    release: "2008-12-05"
    score: 7.0
    cover: "/images/games/yosuga-no-sora/cover.webp"
    radar:
      story: 6
      character: 8
      music: 6
      art: 7
  - id: haruka
    title: "悠之空"
    original_title: "ハルカナソラ"
    tags: ["ADV", "FD", "后日谈", "妹系"]
    studio: "Sphere"
    release: "2009-09-25"
    score: 7.0
    cover: "/images/games/yosuga-no-sora/haruka.webp"
    radar:
      story: 6
      character: 8
      music: 6
      art: 7
---
```

B 版式桌面双列、窄屏单列；手机端（≤760）与 A 相同：自然比例封面、名称/社团/发行时间、四维分数面板，雷达隐藏。

### C 版式：多作品，分段插卡

frontmatter 与 A 相同，只改：

```yaml
review_layout: sections
toc: false
```

正文：

```markdown
这是导语，可以写整体印象。

{{< game id="yosuga" >}}

这里是《缘之空》这一段落的正文。

{{< game id="haruka" >}}

这里是《悠之空》这一段落的正文。
```

卡片会生成 `id="game-<id>"` 的锚点，可以直接链接到 `/posts/<slug>/#game-yosuga`。手机端（≤760）与 A/B 共用同一套手机卡。

### 旧单作品写法（兼容）

```yaml
game:
  title: "Demo Game"
  original_title: "デモゲーム"
  tags: ["ADV"]
  studio: "Demo Studio"
  release: 2024-06-28
  score: 8.6
  cover: "/images/games/demo/cover.webp"
  radar:
    story: 8
    character: 9
    music: 7
    art: 8
```

新文章优先用 `games` 列表；旧文章不用迁移。

## 字段说明

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `id` | C 版式必填 | 唯一标识，C 版式 shortcode 用它找卡片；B 版式用于锚点；只用字母、数字、短横线 |
| `title` | 是 | 中文名，也是卡片标题 / C 版式 h2 |
| `original_title` | 否 | 原名，日文用 `lang="ja"` 渲染 |
| `tags` | 否 | YAML 列表，仅作品卡展示，不生成站点标签页 |
| `studio` | 是 | 社团 / 开发商 |
| `release` | 是 | 发售日，写 `2008-12-05` 或带引号 |
| `score` | 是 | 0–10，显示一位小数；`0` 是有效分数，缺字段显示「待补」 |
| `cover` | 是 | 该作品的卡片图；页面顶层 `cover` 只做文章头图 |
| `radar` | 是 | `story` / `character` / `music` / `art`，四项都必须是 0–10 的数字；雷达图以 4 分为起点（低于 4 按 4 显示） |

## 图片规范

- 目录：`static/images/games/<slug>/`；正文引用以 `/images/...` 开头。
- 建议 WebP；B/C 卡封面按 200×146 裁切（窄屏 140×102），重要人物别放太靠边。
- A 版封面：桌面按原图比例完整显示在左列（宽 320px）；4:3 左右最稳，16:9 横图会在图片下方留一条卡片底色，竖版会让卡片变高；≤1199 平板会裁成竖版。重要人物别贴边。
- 文章头图用 frontmatter `cover`；正文截图用 `game-gallery`：

```markdown
{{< game-gallery >}}
![《缘之空》CG](/images/games/yosuga-no-sora/cg.webp)
![《悠之空》主视觉图](/images/games/yosuga-no-sora/haruka.webp)
{{< /game-gallery >}}
```

两张都是横图时并排，否则上下；点击用主题灯箱放大。

当前机器 PATH 里没有 `ffmpeg` / `magick` / `cwebp`。需要转 WebP 时先问博主，不要擅自上传图片到第三方网站。

## 本地预览

在 Claude 桌面端：用 `preview_start` 启动 `hugo-reimu`（配置在 `.claude/launch.json`），端口 1313。

或在终端：

```bash
D:/MDzz/AI/boke/blog/scripts-tmp/hugo-preview.bat
```

打开 `http://localhost:1313/posts/<slug>/`。预览带 `-D`，草稿也会显示。

检查项：

- 桌面 1280：B 版式两张卡同一行；A 版式单卡铺满一行；C 版式卡片与正文交替。
- 手机 390：卡片单列，标签不换行溢出，无横向滚动。
- 暗色模式：标题、雷达、标签、评分徽章可读。
- 雷达四项数字与 frontmatter 一致；B 版式卡片有 `id="game-..."` 锚点；C 版式点标题能跳转。
- 图片都能加载，`cover` 和各作品 `cover` 不是同一张时不要混。

预览期间**不要**执行生产构建：预览用 `--cleanDestinationDir` 生成开发版 CSS，生产构建会清掉它，页面会变成裸样式。正确顺序是：停预览 → 构建 → 再启动预览。

## 构建校验

先停预览，再在 `blog/` 下执行：

```bash
export PATH="/d/MDzz/AI/boke/blog/.tmp-sass/dart-sass:$PATH"
./.tmp-hugo/hugo.exe --gc --minify --cleanDestinationDir
```

看到 `Pages`、`Static files` 统计且没有 `ERROR` / 缺字段 `WARN` 即通过。缺字段 warning 不要带上线，先补数据或去掉该字段。

主题自带的 Dart Sass `DEPRECATED [global-builtin]`（`fontawesome.scss`）是旧主题的已知警告，不影响构建，可忽略；要盯的是 `game:` / `game-review-list:` / `game shortcode:` 开头的缺字段 warning。

## 提交与上线

只有博主明确说「发布 / 上线 / 推」才执行：

```bash
cd /d/MDzz/AI/boke/blog
git add content/posts/<slug>.md static/images/games/<slug>
git commit -m "新文章：<标题>"
git push origin main
```

- 提交信息用中文一句话；按当前 Claude 会话要求附 `Co-Authored-By: Claude Code <noreply@anthropic.com>`。
- 不要提交 `.tmp-*`、`scripts-tmp/`、`public/`（已在 `.gitignore`）。
- push 后 Cloudflare Pages 自动构建 `main`，约 2–3 分钟上线：`https://blog-7as.pages.dev`。
- 博主说「先不发布 / 保持草稿」时：只做本地文件和预览，不 commit、不 push。

## 不能做的事

- 不直接改 `themes/reimu/`；定制走根目录 `layouts/`、`static/css/custom.css`、`config/_default/params.yml`。
- 不改 `hugo.toml` 的 `baseURL`。
- 不启用 Google Fonts、境外 CDN、烟花 / Live2D / 自动播放媒体。
- 不替博主开关代理、不改系统代理设置（详见全局 `CLAUDE.md` 的安全边界）。
- 不把凭据、内网地址、未公开素材发给第三方服务。
- 不擅自发布、推送、上传。

## 常见问题

| 现象 | 原因 / 处理 |
| --- | --- |
| 本地页面没有样式，`/css/main.css` 404 | 预览运行时跑过生产构建，开发版 CSS 被清掉。停预览、重启预览服务。 |
| `TOCSS-DART ... You need to install Dart Sass` | 没把 `.tmp-sass/dart-sass` 加进 PATH，按上面的构建命令执行。 |
| 卡片不显示 / 构建 warning `review_layout missing` | 有 `games` 但没写 `review_layout`；补 `top` 或 `sections`。 |
| C 版式正文没有卡片 | shortcode 的 `id` 与 `games[].id` 不一致，或 `games` 不是列表。 |
| 雷达显示「评分待补」 | `radar` 缺项、值不是数字或超出 0–10。 |
| 标签显示异常 | `tags` 必须是 YAML 列表，例如 `["ADV", "乡村"]`。 |
| 分数显示「待补」 | `score` 缺失；`0` 会正常显示为 `0.0`。 |
| 浏览器看到的还是旧 CSS | 本地预览会缓存 `custom.css`；硬刷新或给链接加 `?v=时间戳`。 |
| 草稿没上线 | `draft: true`；发布前改成 `false`。 |

## 给新会话的开场提示

在专门的文章发布会话里，可以直接把下面这段发给它：

> 你负责「瓜圣帝君的博客」的文章发布。先读 `D:\MDzz\AI\boke\blog\CLAUDE.md` 和 `D:\MDzz\AI\boke\blog\PUBLISHING.md`，再等我给素材。每次先确认版式（A/B）、图片路径和作品数据；本地预览截图给我确认；没有我的明确同意，不要 commit、不要 push。

## 发布前验收清单

- [ ] 标题、日期、分类、`description`、`draft: false`
- [ ] 版式选择正确：A/B 用 `review_layout: top`（一项 / 多项），C 用 `review_layout: sections`
- [ ] A/B 版式 `games` 顺序、`id`、卡片数据齐全；C 版式每个 `id` 都有对应正文段
- [ ] 每项 `cover` 路径正确，页面顶层 `cover` 只是头图
- [ ] 四项雷达分数 0–10，与评测文字一致
- [ ] 正文图片已压缩为 WebP，灯箱能打开
- [ ] 桌面 1280 / 手机 390 / 暗色模式均无溢出、无错位
- [ ] `hugo --gc --minify` 无 ERROR、无缺字段 warning
- [ ] 博主已确认内容和版式
- [ ] 博主已明确同意发布，才执行 commit + push
- [ ] 上线后打开线上文章页复查
