# dsh-mermaid-panel

[English](README.md) | 中文

dsh-mermaid-panel 是 DeepSeek Harness 的客户端插件。它在右侧栏增加一页 **Mermaid**。这一页渲染你正在阅读的对话里的 Mermaid 图。它不改对话本身。

> 发布名是 `dsh-mermaid-panel`，不是 `dsh-mermaid`。包名 `dsh-mermaid` 属于 [MrmoLabs/dsh-mermaid](https://github.com/MrmoLabs/dsh-mermaid)。那个插件在聊天消息里面渲染图。两者做的事不同，可以同时安装。

## 它做什么

- 它注册一个右侧栏页面类型（`mermaid`）和一个引导胶囊。右侧栏为空时，把这一页列成一个入口。
- 它扫描已经渲染出来的对话，找出第一行声明了 Mermaid 图的代码块，并在本页自己的 React 树里渲染。
- 每张卡片上，作者写下的源码点一次就能看到，也可以复制。
- 卡片按宽度适配，并显示整张图。点击图，或点 **放大**，打开全屏视图。缩放和拖动在全屏视图里，不在卡片上。
- 配色变化时，它重新渲染。右侧栏自己的停靠、分栏，以及每个 Session 的标签页持久化，仍然照旧。

聊天里的代码块不会被隐藏，也不会被替换。从对话记录复制源码、引用源码，或让模型把源码读回去，这些仍然可用。聊天的 DOM 一变，本页失去的是输入，不是对话记录。

## 它故意不做的事

- 它不修改 DeepSeek Harness。它只用已经声明的公开扩展点：`ctx.sidebarRightTabs`、`sidebar.right.pane.tab`，以及 `ctx.locale` / `ctx.slots` 这两项服务。
- 它不在对话记录里面渲染。就地替换聊天代码块，需要产品没有的渲染接缝。所以图放在右侧栏。

## 它怎样找到图

聊天把未知语言画成普通代码卡片，卡片上没有语言属性。本页因此读取第一行声明。它接受这些写法：

- `graph` 或 `flowchart`，后面跟一个方向（`TB`、`TD`、`BT`、`RL`、`LR`）；
- 已知的图关键字，例如 `sequenceDiagram`、`classDiagram`、`stateDiagram`、`erDiagram`、`gantt`、`pie`、`journey`、`gitGraph`、`mindmap`、`timeline`、`xychart-beta`、`quadrantChart`，以及其余已知关键字；
- 开头的空行、`%%` 注释，以及一块 YAML front matter。

Mermaid 自己的解析器做最后判定。渲染失败的源码显示失败说明和源码，不显示图。

## 查看

卡片是适配后的预览。在卡片上滚动滚轮，滚的是这一页。预览不缩放，也不拖动。在卡片上缩放或拖动会和这一页的滚动冲突。

点 **放大**，或点击图，会把同一张图全屏打开。这个视图是挂在 `document.body` 上的 portal。右侧栏的滚动容器因此裁不到它。卡片消失后，这个视图不保留状态。

- 滚轮绕指针缩放。顶栏上有 **−**、**+**、百分比、**适应** 和 **关闭**。
- 拖动用来平移。
- `+` 和 `-` 从中心缩放。`=` 和 `_` 做同一件事。`0` 让图适应窗口。`Esc` 关闭这个视图。

## 安装

你需要 DeepSeek Harness，以及一个 Web GUI 带有右侧栏的 profile。下面的命令使用名为 `web` 的 profile。`package.json` 把 `engines.dsh` 设为 `*`。本仓库不写最低版本。

客户端插件在页面加载时进入页面。安装之后，强制刷新 Web GUI。Host 重启不会把新的客户端插件载入已经打开的页面。

### 从插件市场安装

本仓库发布一份 format 1 市场索引，地址如下：

```
https://raw.githubusercontent.com/Natsubrei/dsh-mermaid-panel/main/index.json
```

在 **插件 → 发现 → 添加索引** 里加上这个地址，再从列表安装 **Mermaid 图表**。英文界面上这条的标题是 **Mermaid diagrams**。发现默认关闭。先在插件页的实验列表里打开 **自定义插件市场**。索引条目钉住一次 git commit，所以安装可以复现。安装不需要 npm，也不需要令牌。DSH 对本仓库运行 `git`。它不下载发布用的 tarball。

这条索引是生成的，不要手改。`pnpm run market` 读取 `package.json` 和当前 commit，并重写 `index.json`。在已经包含构建产物的那次 commit 之后运行它，然后单独提交这份索引。见 [CONTRIBUTING.md](CONTRIBUTING.md)。

### 从 npm 安装

npm 上的包名是 `dsh-mermaid-panel`。这种安装不克隆 git 仓库：

```sh
dsh plugin --profile web add dsh-mermaid-panel
```

这条命令跟随 `latest` 这个 dist-tag。要钉住一次发布，在包名后加上 `@`，再写上 `package.json` 里的 `version` 字段。

### 从 GitHub 发布页安装

每次发布上传一个名为 `dsh-mermaid-panel.tgz` 的附件，所以这个 URL 保持不变：

```sh
dsh plugin --profile web add https://github.com/Natsubrei/dsh-mermaid-panel/releases/latest/download/dsh-mermaid-panel.tgz
```

0.1.3 的发布说明仍写着 `github.com/Natsubrei/dsh-mermaid` 和 `dsh-mermaid.tgz`。那是 0.1.4 之前的包名。用上面这条命令。

### 从检出的目录安装

`client.js` 和 `client.mermaid.js` 已经提交。安装这个目录不需要构建。在仓库根目录运行：

```sh
dsh plugin --profile web add .
```

`dsh plugin` 把相对 spec 锚定到你调用命令时所在的目录。所以 `.` 就是这次检出。

只有改了页面才需要构建。锁文件是 `pnpm-lock.yaml`。`build.mjs` 会导入 `esbuild`：

```sh
pnpm install
pnpm run build
```

`pnpm run build` 运行 `node build.mjs`。再用同一条 `dsh plugin` 命令安装这个目录。修改步骤见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 文件

| 文件 | 作用 |
| --- | --- |
| `index.js` | Host 这一半。渲染只在浏览器里发生，所以这个文件不贡献任何东西。 |
| `src/client.jsx` | 页面类型、页面正文和扫描。构建后写入 `client.js`。 |
| `src/diagram-source.mjs` | 哪些源码是图、它们的键，以及一次扫描有没有变化。 |
| `src/viewport.mjs` | 适配比例、滚轮系数和缩放。 |
| `src/render-policy.mjs` | 流式输出时保留已有图的规则，以及一次只渲染一张图的队列。 |
| `client.mermaid.js` | Mermaid 引擎，作为懒加载分块。第一张图出现时才请求它。 |
| `cordis.patch.yml` | 把本插件插入 profile。 |
| `locale/en.json`、`locale/zh.json` | 插件清单里的标题和描述。 |
| `index.json` | 本仓库发布的市场索引。由 `scripts/market-index.mjs` 生成。 |
| `scripts/market-index.mjs` | 根据 `package.json` 和当前 commit 重写 `index.json`。 |
| `README.md` | 本页的英文。 |
| `CONTRIBUTING.md` | 怎样改这一页，以及一次发布不能跳过的步骤。 |
| `CHANGELOG.md` | 用户能看到的版本变化。 |
| `AGENTS.md` | 发布步骤，以及不写下来就会多花一下午的易错点。 |

## 怎样打开

这个页面类型贡献一个引导胶囊。`ui-sidebar-terminal` 用的是同一种入口。打开右侧栏，在引导页上选择 **Mermaid**。右侧栏只注册了这一个入口时（没有别的类型提供引导胶囊），它把这一页播种成第一个标签页，不显示引导页。这条播种规则属于右侧栏，不属于本插件。

## 限制

- 本页读取屏幕上那次对话的 DOM。聊天的代码卡片标记一变，选择器更新之前，本页显示空状态。
- 源码只从聊天已经挂载的内容读取。聊天还没渲染的历史不包括在内。虚拟化的和折叠的都不包括。
- 页面打开时观察 document，以便注意到对话被重新挂载。因此一次流式输出的回合大约每 240 ms 做一次防抖后的扫描。
- 引擎是一个 3.5 MB 的分块。每次页面加载后，第一张图出现时下载一次。
- 全屏视图保持它打开时的缩放。视图开着的时候图变了，图就地更新，缩放仍停在原来的位置。

## 项目

维护者是 [Natsubrei](https://github.com/Natsubrei)。问题和缺陷发到 [Issues](https://github.com/Natsubrei/dsh-mermaid-panel/issues)。漏洞报告不要发到公开的问题列表。见 [SECURITY.md](SECURITY.md)。

- [贡献](CONTRIBUTING.md)
- [变更记录](CHANGELOG.md)
- [行为准则](CODE_OF_CONDUCT.md)
- [许可证](LICENSE)（MIT）
