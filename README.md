# 瓜圣帝君的博客 —— 源码仓库

Hugo 静态博客，主题 PaperMod，托管在 Cloudflare Pages，评论用 Twikoo。

## 日常写作与发布（最常用）

1. 新建文章：在 `content/posts/` 里新建一个 `.md` 文件，文件名用英文/拼音
   （装了 Hugo 的话可以用命令生成模板：`hugo new content posts/文件名.md`）
2. 写文章：文件头部照模板填标题、日期、标签；`draft: true` 是草稿，
   写完改成 `false` 才会发布
3. 配图：图片放进 `static/images/`，正文里写 `![说明](/images/图片名.jpg)`
   - 小提示：截图先转成 WebP 或压缩一下再放，页面打开会快很多
4. 发布：在仓库根目录执行
   ```
   git add .
   git commit -m "新文章：标题"
   git push
   ```
   Cloudflare Pages 会自动构建，2~3 分钟后上线。

## 本地预览（可选）

装 Hugo extended 后，在仓库根目录运行 `hugo server -D`，
浏览器打开 http://localhost:1313 就能边写边看效果（-D 包含草稿）。

## 目录说明

| 路径 | 作用 |
| --- | --- |
| `hugo.toml` | 站点配置：站名、菜单、功能开关都在这里 |
| `content/posts/` | 文章 |
| `content/about.md` | 关于页面 |
| `static/images/` | 文章配图 |
| `layouts/partials/comments.html` | Twikoo 评论接入（envId 在这里填） |
| `themes/PaperMod/` | 主题本体，不要改里面的文件 |

## 上线步骤

见同目录的《部署清单.md》（需要用到你自己的 GitHub / Cloudflare 账号）。
