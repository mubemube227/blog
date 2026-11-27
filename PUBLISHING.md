# 文章发布指南（主流程）

给专门负责发布文章的 Claude 会话。按顺序执行，每步末尾的「完成」是这一步的结束条件。

细节分工：

- 版式、字段、组件：`README.md` 的「Galgame 评测组件」。
- 找图渠道、候选表、超分：`IMAGE-SOURCING.md`。
- 项目规则、不能改的东西：`CLAUDE.md`。

## 两个词

- **workspace**：`D:\MDzz\AI\boke\articles\<中文名>\`。一篇文章的唯一编辑处，所有产物按用途放在这里；它在 git 仓库外。文件夹名用中文（作品名或文章标题）。
- **bundle**：`content/posts/<slug>/`。只放发布副本 `index.md` + `images/*.webp`，从 workspace 复制；不直接编辑。`<slug>` 仍用英文/罗马音，决定 URL。

## workspace 结构

```text
D:\MDzz\AI\boke\articles\<中文名>\
  index.md          # 正文 + frontmatter；模板来自 archetypes/posts
  配图/           # 最终 WebP；只有这个目录和 index.md 会复制进 bundle
  候选/       # 候选原图 + candidates.md + selected.md
  超分/         # Real-CUGAN 2x PNG
  原图/        # 选中的原始图备份
  预览/          # 验收截图
```

候选图、2x PNG、原始图、截图都不进 git，也不进 bundle。旧文章保持原结构不动；新文章不再使用 `D:\MDzz\AI\boke\originals\<slug>\`，原图备份改到 workspace 的 `原图/`。

## 一次发布的流程

### 1. 接素材

需要：标题、作品名、版式（A/B/C）、正文、作品数据（原名、社团、发售日、总分、四项雷达、标签）。

分工：会话查原名 / 社团 / 发售日（官方站、VNDB 等）并填入；博主给评分、雷达、标签；`description` 由会话按正文起草，博主确认。

完成：标题、作品、版式明确；slug 已和博主确认。

### 2. 建 workspace

```bash
cd /d/MDzz/AI/boke/blog
./.tmp-hugo/hugo.exe new content posts/<slug>
mkdir -p "/d/MDzz/AI/boke/articles"
mv "content/posts/<slug>" "/d/MDzz/AI/boke/articles/<中文名>"
```

只给目录名，**不要**加 `/index.md`；加了不会用目录模板。

完成：`D:\MDzz\AI\boke\articles\<中文名>\index.md` 和 `配图/` 已生成；`content/posts/<slug>/` 此时不保留（预览前再复制）。

### 3. 写正文、补数据

博主在 `workspace/index.md` 写正文；会话补事实字段、`description`、`id`，并把 C 版式的 `<!-- game: 作品名 -->` 与 `games[].id` 对齐。图片先不用处理。

完成：正文、版式、作品数据齐全；`score` 和 `radar` 是 0–10 的数字；C 版式每段都有对应 id。

### 4. 找图、选图

按 `IMAGE-SOURCING.md` 走。默认在作品确定后先找一轮；博主说「先不找图」则跳过。

- 候选：`workspace/候选/`，含 `candidates.md` 和原图。
- 给博主看候选表和缩略图；博主选编号。
- 选中记录：`workspace/候选/selected.md`；选中的原始图复制到 `workspace/原图/`。

完成：`selected.md` 记录了 header / 作品卡 / 正文图的编号；博主已确认；或明确跳过找图。

### 5. 超分

对选中的图跑 Real-CUGAN 2x，输出到 `workspace/超分/`，PNG、保持原文件基名（扩展名换成 `.png`）：

```bash
cd "/d/MDzz/tool1/Waifu2x/waifu2x-extension-gui/realcugan-ncnn-vulkan"
./realcugan-ncnn-vulkan_W2xEX.exe \
  -i "D:/MDzz/AI/boke/articles/<中文名>/原图/<原文件名>" \
  -o "D:/MDzz/AI/boke/articles/<中文名>/超分/<基名>.png" \
  -s 2 -n 1 -m models-pro -g 0
```

例如 `header-03-official-ogp.jpg` → `超分/header-03-official-ogp.png`。

先跑 1 张，确认退出码 0、输出尺寸 = 原图 ×2，再跑其余。全部跑完把输出发给博主留档；尺寸校验通过就直接进入入稿，不再单独等一次超分确认。工具路径、失败处理和备选引擎见 `IMAGE-SOURCING.md`。

完成：所有选中图在 `workspace/超分/`；每张都是原图 ×2；失败文件有记录。

### 6. 入稿

把 2x PNG 转成 WebP，**用 2x 原尺寸，不裁切、不缩小**，放进 `workspace/配图/`：

- `cover.webp`：页面头图 / 列表封面。
- `cover-<id>.webp`：作品卡封面；只有一张主视觉时可以和 `cover.webp` 同一个文件。
- `01.webp`、`02.webp`…：正文图，1–3 张。

用本机 conda Python + Pillow（PATH 里的 `python` 是应用商店桩，不要用）：

```bash
C:/Users/shiki/miniconda3/python.exe - <<'PY'
from pathlib import Path
from PIL import Image

ws = Path(r"D:/MDzz/AI/boke/articles/<中文名>")
mapping = {
    # 按实际选中的 2x 文件改
    "header.png": "cover.webp",
    "cover.png": "cover-<id>.webp",
    "body.png": "01.webp",
}
for src, dst in mapping.items():
    im = Image.open(ws / "超分" / src).convert("RGB")
    im.save(ws / "配图" / dst, "WEBP", quality=85, method=6)
    print(src, "->", dst, im.size)
PY
```

然后：

1. 把 `index.md` 里的图片路径改成站点绝对路径 `/posts/<slug>/images/<文件名>`；相对路径会指到站点根目录。
2. C 版式把 `<!-- game: 作品名 -->` 替换成 `{{< game id="..." >}}`。
3. 删掉模板里的填写说明 HTML 注释、未使用的配图示例、C 版式说明段。
4. 校验 `score` / `radar` 为数字，字段齐全。

完成：`workspace/配图/` 只有 WebP；`workspace/index.md` 里的图片路径全部是 `/posts/<slug>/images/...`；模板说明已清理。

### 7. 同步 bundle、预览

bundle 是发布副本，只从 workspace 复制这两项：

```bash
cd /d/MDzz/AI/boke/blog
rm -rf "content/posts/<slug>"
mkdir -p "content/posts/<slug>/images"
cp "D:/MDzz/AI/boke/articles/<中文名>/index.md" "content/posts/<slug>/index.md"
cp "D:/MDzz/AI/boke/articles/<中文名>/配图/"*.webp "content/posts/<slug>/images/"
```

只清理由 workspace 复制的 bundle，不要删 workspace。之后每改一次 workspace，都重新执行这段再预览。

启动预览：

- Claude 桌面端：`preview_start` 启动 `hugo-reimu`（端口 1313）。
- 终端：`D:/MDzz/AI/boke/blog/scripts-tmp/hugo-preview.bat`。

打开 `http://localhost:1313/posts/<slug>/`，截四张到 `workspace/预览/`：

1. 1280 亮色
2. 1280 暗色
3. 1024（作品卡从桌面切平板布局的断点）
4. 390（手机）

检查：A/B/C 卡片布局、图片加载、雷达数值、C 版式锚点、手机无横向滚动、暗色可读。

完成：bundle 里只有 `index.md` + `images/*.webp`；四张截图在 workspace；博主已确认页面。

### 8. 构建校验

先停预览，再在 `blog/` 下执行（文章此时还是草稿，要带 `--buildDrafts` 才会被构建）：

```bash
export PATH="/d/MDzz/AI/boke/blog/.tmp-sass/dart-sass:$PATH"
./.tmp-hugo/hugo.exe --gc --minify --cleanDestinationDir --buildDrafts
```

- `date` 是未来日期时再加 `--buildFuture`；未来日期的文章在 Cloudflare 上不会自动出现。
- 看到 `Pages`、`Static files` 统计且没有 `ERROR` / 缺字段 `WARN` 即通过。
- 主题自带的 Dart Sass `DEPRECATED [global-builtin]` 可忽略；要盯 `game:` / `game-review-list:` / `game shortcode:` 开头的 warning。

完成：构建日志无 ERROR、无缺字段 warning。

### 9. 发布

只有博主明确说「发布 / 上线 / 推」才执行：

1. 在 `workspace/index.md` 把 `draft` 改成 `false`；`date` 改成博主说的发布日（默认就是今天，不写未来日期）。
2. 重新同步 bundle（第 7 步的复制命令）。
3. 再跑一次不带 `--buildDrafts` 的构建，确认正式形态也没问题。
4. 提交并推送：

```bash
cd /d/MDzz/AI/boke/blog
git add content/posts/<slug>
git commit -m "新文章：<标题>"
git push origin main
```

- **只提交 `content/posts/<slug>`**，不要 `git add .`；共享 checkout 里可能有博主未提交的其他改动。
- workspace、候选图、2x PNG、原始图、截图都不提交。
- 修改旧文章时按旧结构提交 `content/posts/<slug>.md` + `static/images/games/<slug>/`。
- 不要提交 `.tmp-*`、`scripts-tmp/`、`public/`（已在 `.gitignore`）。

完成：Cloudflare Pages 构建完成；打开 `https://blog-7as.pages.dev/posts/<slug>/` 复查文章、图片、卡片和手机端。

## 版式与字段

三种版式、字段说明和示例见 `README.md` 的「Galgame 评测组件」。发布时只需要盯住：

- **A**：`review_layout: top` + 一个 `games` 条目。
- **B**：`review_layout: top` + 多个 `games` 条目。
- **C**：`review_layout: sections` + 正文 `{{< game id="..." >}}`；每个 id 与 `games[].id` 一一对应。
- `score`、`radar` 四项必须是 0–10 的数字；不确定就注释掉或删掉，不要写「待定」等中文，否则构建会报错。
- 页面顶层 `cover` 只做头图；每个 `games[].cover` 只做作品卡封面。
- 图片路径统一写 `/posts/<slug>/images/<文件名>`。

## 图片规范

- **来源**：只取同一张官方美术的转载；SFW；日文原版优先；不取同人图、第三方 AI 放大图、带水印/裁切的商品图；文章不写图源。细节见 `IMAGE-SOURCING.md`。
- **最终文件**：都放 `workspace/配图/`，只留 WebP；原始图在 `原图/`，2x PNG 在 `超分/`，候选在 `候选/`。
- **尺寸**：2x 原尺寸入稿，不裁切、不缩小；A 版封面桌面按原图比例显示（宽 320px），B/C 卡封面显示时按 200×146 裁切（窄屏 140×102），重要人物别放太靠边。
- **正文图**：用 `game-gallery`，1–2 张；两张都是横图才并排，否则上下；路径写 `/posts/<slug>/images/...`；点击用主题灯箱。
- **命名**：`cover.webp`、`cover-<id>.webp`、`01.webp`/`02.webp`…；只有一张主视觉时头图和作品卡可以指向同一个文件。

## 本地预览

- 预览读的是 bundle，不是 workspace；改了 workspace 必须先重新同步。
- 预览期间**不要**执行生产构建：预览用 `--cleanDestinationDir` 生成开发版 CSS，生产构建会清掉它，页面会变成裸样式。正确顺序：停预览 → 构建 → 再启动预览。
- 预览带 `-D`，草稿会显示；`date` 是未来日期时默认不显示，需要 `-F`/`--buildFuture`（见第 8 步）。

## 构建与常见问题

| 现象 | 原因 / 处理 |
| --- | --- |
| bundle 不存在 / 页面 404 | workspace 还没同步到 bundle；按第 7 步复制，再刷新或重启预览 |
| 改了 workspace 但预览没变 | 没重新同步 bundle；执行第 7 步复制 |
| 图片 404 | 图片不在 `bundle/images/`，或 `index.md` 路径不是 `/posts/<slug>/images/...` |
| 预览 404 / 列表里没有 | `date` 是未来日期；把 `date` 改到现在，或预览加 `-F` |
| 构建日志里没有这篇文章 | 文章还是 `draft: true`；校验构建加 `--buildDrafts`，发布构建前改成 `false` |
| 构建报 `float` 相关错误 | `score` 或 `radar` 写了中文；数值项只能写数字 |
| `hugo new content posts/x/index.md` 生成默认模板 | 命令多了 `/index.md`；用 `hugo new content posts/x` |
| C 版式正文没有卡片 | `<!-- game: ... -->` 没替换，或 shortcode 的 `id` 与 `games[].id` 不一致 |
| 本地页面没有样式，`/css/main.css` 404 | 预览运行时跑过生产构建；停预览、重启预览服务 |
| `TOCSS-DART ... You need to install Dart Sass` | 没把 `.tmp-sass/dart-sass` 加进 PATH，按第 8 步执行 |
| 卡片不显示 / warning `review_layout missing` | 有 `games` 但没写 `review_layout`；补 `top` 或 `sections` |
| 雷达显示「评分待补」 | `radar` 缺项、值不是数字或超出 0–10 |
| 标签显示异常 | `tags` 必须是 YAML 列表，例如 `["ADV", "乡村"]` |
| 分数显示「待补」 | `score` 缺失；`0` 会正常显示为 `0.0` |
| 浏览器看到的还是旧 CSS | 本地预览会缓存 `custom.css`；硬刷新或给链接加 `?v=时间戳` |
| 草稿没上线 | `draft: true`；发布前改成 `false` |

## 不能做的事

- 不直接改 `themes/reimu/`；定制走根目录 `layouts/`、`static/css/custom.css`、`config/_default/params.yml`。
- 不改 `hugo.toml` 的 `baseURL`。
- 不启用 Google Fonts、境外 CDN、烟花 / Live2D / 自动播放媒体。
- 不替博主开关代理、不改系统代理设置（详见全局 `CLAUDE.md` 的安全边界）。
- 不把凭据、内网地址、未公开素材发给第三方服务。
- 不擅自发布、推送、上传；没有博主明确说「发布 / 上线 / 推」，不 commit、不 push。
- 不删除 workspace 里的原始图、候选图或 2x PNG；只清理由 workspace 复制的 bundle。

## 给新会话的开场提示

> 你负责「瓜圣帝君的博客」的文章发布。先读 `D:\MDzz\AI\boke\blog\CLAUDE.md`、`PUBLISHING.md` 和 `IMAGE-SOURCING.md`，再等我给素材。每篇文章一个 workspace：`D:\MDzz\AI\boke\articles\<中文名>\`，正文、候选图、2x、原图、截图都在里面；预览/发布时只把 `index.md` + `images/*.webp` 复制到 `content/posts/<slug>/`。先确认版式（A/B/C）和 slug；本地预览截 1280 亮/暗、1024、390 四张给我确认；没有我的明确同意，不要 commit、不要 push。

## 发布前验收清单

- [ ] workspace 存在：`index.md`、`配图/`、`候选/`、`超分/`、`原图/`、`预览/`
- [ ] `index.md`：标题、日期、分类、`description`、`draft: false`（发布时）
- [ ] 版式正确：A/B 用 `review_layout: top`（一项 / 多项），C 用 `review_layout: sections`
- [ ] `games` 顺序、`id`、卡片数据齐全；C 版式每个 `id` 都有对应正文段，标记已替换
- [ ] 每项 `cover` 路径是 `/posts/<slug>/images/...`；页面顶层 `cover` 只是头图
- [ ] 四项雷达分数 0–10，与评测文字一致
- [ ] `workspace/配图/` 只有 WebP；bundle 里只有 `index.md` + `images/*.webp`
- [ ] `workspace/超分/` 每张都是原图 ×2；`原图/` 有选中原图备份
- [ ] 四张截图：1280 亮、1280 暗、1024、390；无溢出、无错位
- [ ] `hugo --gc --minify --cleanDestinationDir --buildDrafts` 无 ERROR、无缺字段 warning
- [ ] 发布前改成 `draft: false`、`date` = 发布日，再跑一次不带 `--buildDrafts` 的构建
- [ ] 博主已确认内容和版式
- [ ] 博主已明确同意发布，才执行 commit + push
- [ ] 上线后打开线上文章页复查
