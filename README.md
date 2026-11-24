# 瓜圣帝君的博客 —— 源码仓库

Hugo 静态博客，主题 **Reimu**，托管在 Cloudflare Pages，评论用 Twikoo。

## 日常写作与发布（最常用）

1. 新建文章：在 `content/posts/` 里新建一个 `.md` 文件，文件名用英文/拼音
   （装了 Hugo 的话可以用命令生成模板：`hugo new content posts/文件名.md`）
2. 写文章：文件头部照模板填标题、日期、分类；`draft: true` 是草稿，
   写完改成 `false` 才会发布
   - 可选 `cover: /images/封面图.webp`：文章卡片封面；不填会从 `data/covers.yml` 的占位图里随机取
   - 可选 `banner: /images/头图.webp`：文章页顶部大图；不填则使用全局横幅
3. 配图：图片放进 `static/images/`，正文里写 `![说明](/images/图片名.webp)`
   - 小提示：截图先转成 WebP 或压缩一下再放，页面打开会快很多
4. 发布：在仓库根目录执行
   ```
   git add .
   git commit -m "新文章：标题"
   git push
   ```
   Cloudflare Pages 会自动构建，2~3 分钟后上线。

## Galgame 评测组件

有 `game:` 数据的文章会自动在正文开头生成「作品卡 + 雷达评分」，普通文章不受影响。

```yaml
cover: /images/games/xxx/cover.webp
game:
  title: 游戏名
  studio: 社团
  release: 2024-06-28
  score: 8.6
  radar: /images/games/xxx/radar.png
```

- 总分 10 分制；雷达图由你在外部制作，建议 1:1、1000×1000 PNG，深色文字/线条 + 透明背景，放在作品卡内侧。
- 缺字段会显示“待补”并在构建日志警告，不阻塞预览。
- 正文视觉图用 `game-gallery`：

```go
{{< game-gallery >}}
![游戏截图 1](/images/games/xxx/01.webp)
![游戏截图 2](/images/games/xxx/02.webp)
{{< /game-gallery >}}
```

两张都是横图时并排，否则上下；点击用主题自带灯箱放大。

示例草稿在 `content/posts/galgame-demo.md`（`draft: true`），复制后替换封面、雷达图和截图即可。演示雷达图是占位素材：`static/images/games/demo/radar.png`。

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
| `content/posts/` | 文章（首页展示；`/posts/` 列表页已关闭） |
| `content/about.md` | 关于页 |
| `content/search.md` | 搜索页 |
| `static/images/banner.svg` | 首页/文章页横幅（当前是占位图，可替换） |
| `static/avatar/avatar.svg` | 头像（当前是占位图，可替换） |
| `static/favicon.ico` | 浏览器标签页图标（当前是占位西瓜） |
| `data/covers.yml` | 文章卡片随机封面 |
| `static/css/custom.css` | 自定义样式（搜索页、手机端标题、深色强调色） |
| `layouts/search.html`、`assets/js/search.js`、`layouts/index.json` | 站内本地搜索（Fuse.js） |
| `layouts/404.html` | 自定义 404 页 |
| `layouts/partials/post/game-review.html`、`layouts/shortcodes/game-gallery.html` | Galgame 作品卡与正文图组件 |
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
