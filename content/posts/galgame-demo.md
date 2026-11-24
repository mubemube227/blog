---
title: "《Demo Game》评测：这套 galgame 组件长什么样"
date: 2026-11-24T20:30:00+08:00
draft: true
categories: ["公告"]
cover: "/images/covers/cover-1.svg"
description: "Galgame 评测组件演示草稿：作品卡、评分雷达和正文视觉图。"
game:
  title: "Demo Game"
  studio: "Demo 社团"
  release: 2024-06-28
  score: 8.6
  radar: "/images/games/demo/radar.png"
---

这是一篇用于验证组件的草稿，不会发布到线上。结构按最终方案来：顶部作品卡 + 雷达评分，下面是正文和 1–2 张视觉图。

{{< game-gallery >}}
![Demo 视觉图 1：夜色](/images/covers/cover-1.svg)
![Demo 视觉图 2：月光](/images/covers/cover-2.svg)
{{< /game-gallery >}}

## 这套组件应该解决什么

写 galgame 评测时，最麻烦的是每篇都要重复排版：封面、社团、发售日、评分和截图的位置都不固定。组件把这些固定下来，正文只负责写感受和放图。

- 作品卡只保留最少信息：封面、游戏名、社团、发售日、总分
- 雷达图由外部制作，组件只负责展示和适配
- 正文视觉图按原比例显示，不强行裁成 16:9
- 两张都是横图时并排，否则上下排

## 交互与适配

桌面端作品卡和雷达图左右排布，手机端自动上下堆叠。文章头图继续使用同一张封面，但加了暗色渐变，保证标题可读；作品卡里再完整显示一次封面。

> 这篇只是草稿；正式文章把 `draft` 改掉，并替换封面、雷达图和视觉图即可。
