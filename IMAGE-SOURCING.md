# 找图与配图来源（IMAGE SOURCING）

给发布文章的会话看：确定作品后，怎么找官方视觉图/商品图、怎么筛、怎么给博主选、怎么入稿。

超分方案已确认（Real-CUGAN pro 2x `-n 1`），见文末；选中后可执行。

## 本机实测环境

- 2026-11-27，无代理，直连出口为广州联通；下表“可达”均为绕过代理的短时探测。
- 站点可达性会变；失败不要反复硬试，按降级顺序换源。

## 每篇的工作区

每篇文章的产物都在 `D:\MDzz\AI\boke\articles\<中文名>\`，完整结构见 `PUBLISHING.md`。workspace 文件夹名用中文；`content/posts/<slug>` 和 URL 的 `<slug>` 仍是英文/罗马音。找图相关：

- 候选：`候选/`（`candidates.md`、`selected.md`、原图）
- 原图备份：`原图/`
- 2x PNG：`超分/`
- 最终 WebP：`配图/`

只有 `index.md` + `images/*.webp` 会复制进 `content/posts/<slug>/`；候选、2x、原图、截图都不进 bundle，也不提交。

## 来源分层与实测

| 渠道 | 直连 | 能拿到 | 备注 |
| --- | --- | --- | --- |
| 官方作品页（示例：[CRYSTALiA Dimension Lovers](https://crystalia.amusecraft.com/totsulover/index.html)） | ✅ 200 | KV、masterup、CG、体验版截图、角色立绘、OGP 宽幅 | **首选**；不同作品域名不同，老域名可能超时；OGP 常是官方预裁的宽幅，适合做 header |
| 官方 BOOTH / 官方通贩 | ✅ 200 | 商品图、特典图 | 商品图常靠 JS 加载，必要时用浏览器 |
| [VNDB](https://vndb.org/) + `t.vndb.org` | ✅ 200 | 封面、截图（带 sexual 标记） | 元数据 + SFW 截图兜底 |
| [月幕 Galgame](https://www.ymgal.games/) | ✅ 200 | 中文数据库封面/信息 | 注意是 `.games`，`.com` 超时 |
| Hikarinagi | ✅ 200 | 中文数据库封面/信息 | SPA，需浏览器/API |
| SteamGridDB | ✅ 200 | 社区封面/背景 | 非官方；只取官方美术转载 |
| Bilibili | ✅ 200 / 搜索 200 | 官方 PV、专栏、视频封面 | 适合找宣传图/截图，分辨率参差 |
| Galgame.live | ✅ 200 | 资源/专题站封面 | 带下载入口；只取图，不下载/不链接资源 |
| totsulove.com | ✅ 200 | 中文专题站封面/截图 | 非官方、带下载入口；画面无中文的宽幅可作备选，日文官方同图优先 |
| 百度图片 / 必应图片 | ✅ 200 | 图片搜索 | **只做发现**，必须打开原页面拿图 |
| Getchu | ⚠️ 根页 200，商品页连接重置 | 商品封面 | 有具体商品 URL 时再试，不硬试 |
| Toranoana | ✅ 根页 200，搜索 404 | 商品/特典图 | 入口需另找 |
| 4Gamer / Famitsu | ✅ 根页 200，搜索 403 | 新闻稿截图 | 有文章 URL 时再试 |
| Steam 商店 | ❌ 连接失败 | 商店 KV/胶囊图 | 直连不可用 |
| Bangumi / 2DFan / DLsite / Ci-en / DMM / Amazon JP / Melonbooks / Suruga-ya / Sofmap | ❌/⚠️ | — | 超时、403 或地区限制 |
| Prop 通贩 | ✅ 200 | 商品缩略图 250×177 | 分辨率不够 |
| 萌娘百科 | ⚠️ 403 反爬 | 封面 | 浏览器可能可读 |
| 百度百科 / 知乎 | ✅ | 中文介绍、转载图 | 只作中文名/角色线索，分辨率一般 |

## 选源规则

1. **只取同一张官方美术**（KV、包装、官方 CG/截图）的转载；排除同人图、第三方已经 AI 放大/生成的图、带店铺水印或裁切的商品图、NSFW。
2. **日文原版优先**；有日文版图就不要中文版图；没有日文版时才用中文版。
3. **同图多源**按清晰度/干净程度选；官方站有同图时优先官方（通常最接近原图）。不要求追溯到官方原页面。
4. **必须能打开来源页面**；图片搜索的缩略图不算，打不开的不用。
5. 来源只记录在本地候选表；**文章不写图源**（博主决定）。
6. 不下载/不链接游戏资源；只取图片；只取评论需要的少量图，不搬运全 CG、不二次分发图包、不商用。
7. 每槽位 2–5 个候选；候选保留原文件、原尺寸、原比例，不裁切、不设分辨率门槛。

## 图片槽位

| 槽位 | 内容 | 说明 |
| --- | --- | --- |
| `cover.webp` | 页面头图 / 列表封面 | 宽幅或竖幅原图都可以；站点 CSS 自己裁显示，文件不裁 |
| `cover-<id>.webp` | 作品卡封面 | 包装 / masterup；原比例 |
| `01.webp` … | 正文 1–3 张 SFW CG/截图 | 不要角色立绘；原比例 |

选中并超分后转 WebP（2x 原尺寸、不裁切、不缩小），放进 workspace 的 `配图/`；预览/发布时再复制到 `content/posts/<slug>/images/`。

## 流程

1. 开新文章或知道作品名后，默认先找一轮（博主说“先不找图”则跳过）。
2. 按来源分层找：官方站 → 官方通贩 → 数据库 → 中文媒体/聚合 → 图片搜索。官方站只试一次，失败换源。
3. 候选下载到 `D:\MDzz\AI\boke\articles\<中文名>\候选\`，文件名带槽位和编号，例如 `header-01-official-kv.webp`。
4. 生成 `candidates.md` 候选表，字段：编号、槽位、文件、尺寸、格式、大小、来源页、是否官方美术、SFW、备注（低清 / 裁剪版 / 水印 / 日文或中文版）。
5. 把候选表和缩略图给博主看；博主选编号，记录到 `selected.md`。
6. 选中的原始图复制到 `原图/`；按“超分”跑 2x 到 `超分/`；再把 2x PNG 转 WebP 到 `配图/`，按上表命名；不裁切、不缩小。
7. 文章不写图源；`候选/`、`超分/`、`原图/` 留在 workspace，不提交；预览/发布只把 `index.md` + `配图/*.webp` 复制到 `content/posts/<slug>/images/`。

## 候选表格式

```markdown
| 编号 | 槽位 | 文件 | 尺寸 | 格式 | 来源页 | 官方美术 | SFW | 备注 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| H1 | header | header-01-official-kv.webp | 1920×1743 | webp | https://... | 是 | 是 | 竖幅原图 |
| C1 | cover | cover-01-official-masterup.jpg | 1200×1200 | jpg | https://... | 是 | 是 | 包装/masterup |
| B1 | body | body-01-vndb.jpg | 1280×720 | jpg | https://... | 是 | 是 | VNDB sexual=0 |
```

## 失败与边界

- 没有可用图：告诉博主，不擅自开代理。
- 只有裁剪版/水印图：标注后给博主选；不自行修补、不去水印。
- 只有低清图：按下方已确认的 2x 方案处理；不裁切、不缩图。
- 只有中文版：确认没有日文版后再用。
- 官方/非官方都不可达：报告试过的渠道，不硬试。

## 超分（已确认，2026-11-27）

工具：

```text
D:\MDzz\tool1\Waifu2x\waifu2x-extension-gui\realcugan-ncnn-vulkan\realcugan-ncnn-vulkan_W2xEX.exe
```

参数：`-s 2 -n 1 -m models-pro -g 0`。干净无损原图可改 `-n -1`；4x 前先单张试跑并确认（models-pro 的 3x/4x 档位少）。

输出：文章的 2x 放 `workspace/超分/`，PNG、保持原文件基名（扩展名换成 `.png`）；单张临时测试可用 `D:\MDzz\AI\Claude workplace\waifu2x-output\`；不覆盖原图。

校验：退出码 0，输出尺寸 = 原图 ×2；Python 必须用 `C:\Users\shiki\miniconda3\python.exe`。

交接：`D:\MDzz\AI\Claude workplace\waifu2x-handoff.md`。

已实测：H3 1200×630 → 2400×1260；C3 700×496 → 1400×992；B3 1280×720 → 2560×1440。备选引擎（不默认）：waifu2x cunet 更软，Real-ESRGAN animevideov3 更锐但易过硬。

## 示例：Dimension Lovers

- 作品：`ディメンション凸ラバース!!`（CRYSTALiA，2026-04-24）；中文名有“越界恋人!!”“次元错位恋人!!”“超次元恋人”等。
- 官方页：<https://crystalia.amusecraft.com/totsulover/index.html>
- 官方素材实测：KV 1920×1743、masterup 1200×1200、OGP 1200×630、CG 1024×576 / 1280×720、体验版截图 1279×720、角色立绘 1440×1000。
- VNDB：<https://vndb.org/v60663>；封面 700×496（低清），截图 1280×720（按 sexual 标记筛 SFW）。
- 2026-11-27 扩大检索：官方没有 1920×1080 宽幅；最大官方宽幅是 OGP 1200×630。中文专题站 totsulove.com 的 1920×1079 图画面无中文/logo，是同一官方美术的宽幅版，但来源非官方；列为备选，是否采用由博主决定。
- 同轮测试：Steam 商店连接拒绝，`shared.akamai.steamstatic.com` 的 header/library 资源 404；SteamGridDB 无可用条目且 API 需鉴权；Getchu 商品图 403；BOOTH 官方店列表无本作；VNDB 仍只有 700×496 封面。
- 结论：**日文官方最高清 = KV 1920×1743；官方宽幅最高 = OGP 1200×630；1920 宽无字版只有中文站转载。** 选 header 时按“清晰度/是否要标题/来源是否官方”三者取舍。
