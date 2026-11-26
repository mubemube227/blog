---
title: "《Demo Game》评测：A 版式（单作品）样本"
date: 2026-11-24T20:30:00+08:00
draft: true
categories: ["Galgame"]
cover: "/images/covers/cover-1.svg"
description: "A 版式（单作品）样本：顶部整行作品卡、雷达评分、正文视觉图。"
toc: false
review_layout: top
games:
  - id: demo-game
    title: "Demo Game"
    original_title: "デモゲーム"
    tags: ["ADV", "演示"]
    studio: "Demo 社团"
    release: "2024-06-28"
    score: 8.6
    cover: "/images/covers/cover-1-4x3.svg"
    radar:
      story: 8
      character: 9
      music: 8
      art: 9
---

这是一篇 **A 版式（单作品）** 的样本草稿，不会发布到线上。顶部是一张整行作品卡，下面是正文和 1–2 张视觉图；正式文章把 `draft` 改成 `false`、替换封面和文字即可。

{{< game-gallery >}}
![Demo 视觉图 1：夜色](/images/covers/cover-1.svg)
![Demo 视觉图 2：月光](/images/covers/cover-2.svg)
{{< /game-gallery >}}

## A 版式怎么写

A 版式用 `review_layout: top`，`games` 只写一项；桌面（≥1200）会把封面按原比例完整显示在左侧（320px 宽），卡片高度随封面，右侧依次是标题、原名 / 社团 / 发售日、标签，最右是雷达与总分竖栏：总分在雷达正下方。不需要 `sections`，也不用退回旧的 `game:` 写法。

手机端（≤760）与 B/C 统一：封面按原比例完整显示、标题与评分同排、名称 / 社团 / 发行时间三行标签、四维分数面板，雷达隐藏。

卡片里的顺序是：标题、原名、社团、发售日、标签、总分和四项雷达。四项分数直接写在 frontmatter 的 `radar` 里，范围 0–10，雷达图由 Hugo 自动生成，以 4 分为起点。

## 正文与配图

正文继续写整体评测，不必按作品分节。视觉图用 `game-gallery`，两张都是横图时并排，否则上下；点击用主题灯箱放大。

> 这篇只是草稿；正式文章记得替换 `title`、`cover`、`games` 数据和正文，并确认 `draft: false`。
