---
title: "【文章标题】"
date: {{ .Date }}
draft: true
categories: ["Galgame"]
description: ""
cover: cover.webp
toc: false
# 版式：A 单作品 / B 多作品置顶 → 保持 top；C 多作品分段 → 改成 sections
review_layout: top
games:
  # A 只留这一条；B 整段复制再加；C 同样，并把上面的 review_layout 改成 sections
  - id: game-id                # 我按作品名生成，通常不用改
    title: "【作品名】"
    original_title: "【原名】"  # 没有就删掉这一行
    tags: ["ADV", "【标签】"]   # 2–4 个
    studio: "【社团】"
    release: "【YYYY-MM-DD】"
    score: 8.0                 # 0–10，一位小数；不确定就注释掉这一行，不要写中文
    cover: cover-game-id.webp  # 作品卡封面，只写文件名
    radar:
      story: 8                 # 剧情 0–10
      character: 8             # 人设 0–10
      music: 8                 # 音乐 0–10
      art: 8                   # 美术 0–10
---

<!--
workspace（唯一编辑处）：D:\MDzz\AI\boke\articles\<中文名>\
（目录名用中文；content/posts/<slug> 和 URL 的 slug 仍用英文/罗马音）
  index.md（本文件）、配图/（最终 WebP）、候选/（候选图+表）、
  超分/（2x PNG）、原图/（选中原图备份）、预览/（验收截图）
发布副本：content/posts/<slug>/（只放本文件 + images/*.webp，由发布会话复制）

填写说明（发布前我会检查并清理这些注释）：
- 版式：A 单作品 = top + 一条 games；B 多作品置顶 = top + 多条 games；C 多作品分段 = sections + 正文 game 标记。
- 数值项（score、radar 四项）必须是 0–10 的数字；不确定就注释掉或删掉那一行，不要写中文，否则构建会报错。文字字段不确定可以写 待定。
- 图片放进 workspace 的 配图/（最终 WebP）。命名约定：cover.webp（页面头图/列表封面）、cover-<id>.webp（作品卡封面）、01.webp/02.webp…（正文图）。只有一张主视觉时，头图和作品封面可以指向同一个文件，不用复制。
- 图片路径先写文件名即可（如 cover.webp、01.webp），发布前我会改成 /posts/<slug>/images/...。
- date：建文件时是当天；发布时改成发布日，不要写未来日期（未来日期线上不显示）。
- description 留空即可，我会根据正文补一句给你确认。
-->

正文从这里开始写。

<!-- 配图块：下面是示例。把 01.webp 换成你的文件名；不需要就删掉整段。一次 1–2 张，多了复制整段。 -->

{{< game-gallery >}}
![说明](01.webp)
{{< /game-gallery >}}

C 版式（多作品分段）才需要：在每部作品正文开头单独写一行标记，只写中文作品名（发布前我会替换成作品卡）。写法：

```markdown
<!-- game: 作品名 -->
```

A/B 版式不需要这段，删掉即可。
