# SBTI

一个基于 Next.js 16 构建的现代人格测试应用。

SBTI 通过 28 道场景题，拆解用户在能量来源、感知偏好、决策方式和行动节奏上的倾向，不只是给出一个四字母标签，还会生成可分享的结果页和分享卡。

## Demo

在线体验：<https://sbti-test-luxo5gc9.edgeone.cool>

## 功能特性

- 28 道测试题，输出 16 种人格结果
- 现代极简风 UI，适配桌面端与移动端
- 开始测试前支持填写昵称
- 支持输入 QQ 号并自动获取头像预览
- 昵称和头像可带入结果页与分享卡
- 每次进入测试默认开启新的答题，不继承上一位访客进度
- 结果页支持分享链接与图片下载
- 本地保留历史结果，方便重复测试和对比
- 使用 `next/image`、动态 OG 图和头像代理接口优化图片体验

## 技术栈

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Zustand
- Framer Motion

## 项目结构

```text
src/
  app/
    api/qq-avatar/      QQ 头像代理接口
    result/             结果页与分享结果页
    test/               测试页
  components/
    home/               首页组件
    test/               测试、结果、分享相关组件
  data/                 题库与人格类型数据
  lib/                  评分、资料处理等工具函数
  store/                Zustand 状态管理
  types/                类型定义
public/
  illustrations/        项目插画资源
```

## 本地运行

建议使用 Node.js 20+。

```bash
pnpm install
pnpm dev
```

如果你使用 npm：

```bash
npm install
npm run dev
```

启动后打开：<http://localhost:3000>

## 可用脚本

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
```

## QQ 头像说明

项目通过 `/api/qq-avatar` 代理 QQ 头像请求，前端展示和分享卡都走站内地址，避免直接在画布里使用跨域图片导致导出失败。

对应上游头像来源为 `q1.qlogo.cn`。

## 部署说明

部署时建议配置以下环境变量：

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

这个地址会用于：

- 站点 metadata
- 分享链接生成
- Open Graph / Twitter 预览图相关链接解析

## 适用场景

这个项目更适合：

- 个人作品集展示
- 轻量互动 H5
- 社交传播型测试页面
- 人格测试类产品原型

## 说明

- 测试结果仅供娱乐、自我观察与内容分享参考
- 不构成任何专业心理评估、医学建议或职业建议
