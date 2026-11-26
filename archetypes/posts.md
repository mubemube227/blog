---
title: "文章标题"
date: {{ .Date }}
draft: true
categories: ["Galgame"]
description: "一句话概括这篇文章，会显示在列表和搜索结果里。"
cover: ""
toc: false
# 作品评测：取消下面几行注释
# A 版式（单作品）：top + games 一项
# B 版式（多作品置顶）：top + games 多项
# C 版式（多作品分段）：sections + 正文 game shortcode
# review_layout: top
# games:
#   - id: game-id
#     title: "作品名"
#     original_title: "オリジナルタイトル"
#     tags: ["ADV", "标签"]
#     studio: "社团"
#     release: 2024-01-01
#     score: 8.0
#     cover: "/images/games/game-id/cover.webp"
#     radar:
#       story: 8
#       character: 8
#       music: 8
#       art: 8
---

正文从这里开始写。

<!-- 单作品旧写法仍兼容（game:），新文章优先用上面的 games 列表。 -->
<!-- 图片先放进 static/images/，正文用 ![说明](/images/文件名.webp) 引用。 -->
<!-- 写完把 draft 改成 false，本地预览确认后再发布。 -->
