import { Question } from '@/types';

// 28道测试题，每维度7题
// E题：得分给E；I题：得分给I（reverseScored控制）
// 每个选项的scores格式：{ 高分维度: 1, 低分维度: 0 } 或反向
export const questions: Question[] = [
  // ==================== E/I 维度（7题） ====================
  {
    id: 'q1',
    dimension: 'EI',
    text: '假期你更想怎么度过？',
    reverseScored: false,
    options: [
      { key: 'A', label: '呼朋唤友，一起去热闹的地方玩', scores: { E: 1, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 } },
      { key: 'B', label: '一个人待在家里，享受难得的清静', scores: { E: 0, I: 1, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 } },
    ],
  },
  {
    id: 'q2',
    dimension: 'EI',
    text: '在工作中遇到问题时，你通常会？',
    reverseScored: false,
    options: [
      { key: 'A', label: '直接找同事讨论，很快就能聊出结果', scores: { E: 1, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 } },
      { key: 'B', label: '先自己想一想，理清思路再说', scores: { E: 0, I: 1, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 } },
    ],
  },
  {
    id: 'q3',
    dimension: 'EI',
    text: '你参加社交活动的频率是？',
    reverseScored: false,
    options: [
      { key: 'A', label: '越多越好，人多的地方才有意思', scores: { E: 1, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 } },
      { key: 'B', label: '偶尔参加，太频繁会觉得累', scores: { E: 0, I: 1, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 } },
    ],
  },
  {
    id: 'q4',
    dimension: 'EI',
    text: '第一次见面时，你更容易？',
    reverseScored: false,
    options: [
      { key: 'A', label: '主动打招呼，轻松地打开话题', scores: { E: 1, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 } },
      { key: 'B', label: '等对方先开口，观察一下再说', scores: { E: 0, I: 1, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 } },
    ],
  },
  {
    id: 'q5',
    dimension: 'EI',
    text: '你在微信群里的风格通常是？',
    reverseScored: false,
    options: [
      { key: 'A', label: '消息秒回，群里的话痨担当', scores: { E: 1, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 } },
      { key: 'B', label: '经常潜水，看到好笑的消息才冒个泡', scores: { E: 0, I: 1, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 } },
    ],
  },
  {
    id: 'q6',
    dimension: 'EI',
    text: '和陌生人聊天时，你通常感觉？',
    reverseScored: false,
    options: [
      { key: 'A', label: '有趣！新朋友意味着新的故事', scores: { E: 1, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 } },
      { key: 'B', label: '有点尴尬，不知道该聊什么', scores: { E: 0, I: 1, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 } },
    ],
  },
  {
    id: 'q7',
    dimension: 'EI',
    text: '当众发言时，你通常？',
    reverseScored: true, // 反向计分：选A反而说明你更I
    options: [
      { key: 'A', label: '有点紧张，恨不得赶紧说完下台', scores: { E: 0, I: 1, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 } },
      { key: 'B', label: '很兴奋，感觉自己是全场的焦点', scores: { E: 1, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 } },
    ],
  },

  // ==================== S/N 维度（7题） ====================
  {
    id: 'q8',
    dimension: 'SN',
    text: '你看小说的偏好是？',
    reverseScored: false,
    options: [
      { key: 'A', label: '喜欢基于现实背景的故事，越真实越好', scores: { E: 0, I: 0, S: 1, N: 0, T: 0, F: 0, J: 0, P: 0 } },
      { key: 'B', label: '更喜欢奇幻、科幻，越超现实越有意思', scores: { E: 0, I: 0, S: 0, N: 1, T: 0, F: 0, J: 0, P: 0 } },
    ],
  },
  {
    id: 'q9',
    dimension: 'SN',
    text: '老板布置了一个任务，你的反应是？',
    reverseScored: false,
    options: [
      { key: 'A', label: '严格按照要求执行，不要出岔子', scores: { E: 0, I: 0, S: 1, N: 0, T: 0, F: 0, J: 0, P: 0 } },
      { key: 'B', label: '想想有没有更好的方案，不一定照搬', scores: { E: 0, I: 0, S: 0, N: 1, T: 0, F: 0, J: 0, P: 0 } },
    ],
  },
  {
    id: 'q10',
    dimension: 'SN',
    text: '你更相信哪种信息？',
    reverseScored: false,
    options: [
      { key: 'A', label: '实实在在的数据和事实', scores: { E: 0, I: 0, S: 1, N: 0, T: 0, F: 0, J: 0, P: 0 } },
      { key: 'B', label: '直觉告诉我的一些可能性', scores: { E: 0, I: 0, S: 0, N: 1, T: 0, F: 0, J: 0, P: 0 } },
    ],
  },
  {
    id: 'q11',
    dimension: 'SN',
    text: '描述你理想中的房子，你更关注？',
    reverseScored: false,
    options: [
      { key: 'A', label: '房间要实用、采光好、收纳空间够大', scores: { E: 0, I: 0, S: 1, N: 0, T: 0, F: 0, J: 0, P: 0 } },
      { key: 'B', label: '要有独特的风格，能体现我的个性', scores: { E: 0, I: 0, S: 0, N: 1, T: 0, F: 0, J: 0, P: 0 } },
    ],
  },
  {
    id: 'q12',
    dimension: 'SN',
    text: '你更擅长发现什么？',
    reverseScored: false,
    options: [
      { key: 'A', label: '具体的问题和可行的解决方案', scores: { E: 0, I: 0, S: 1, N: 0, T: 0, F: 0, J: 0, P: 0 } },
      { key: 'B', label: '别人看不到的联系和可能性', scores: { E: 0, I: 0, S: 0, N: 1, T: 0, F: 0, J: 0, P: 0 } },
    ],
  },
  {
    id: 'q13',
    dimension: 'SN',
    text: '做计划时，你更倾向于？',
    reverseScored: false,
    options: [
      { key: 'A', label: '制定详细的步骤，一步一步来', scores: { E: 0, I: 0, S: 1, N: 0, T: 0, F: 0, J: 0, P: 0 } },
      { key: 'B', label: '有个大概方向就行，边走边调整', scores: { E: 0, I: 0, S: 0, N: 1, T: 0, F: 0, J: 0, P: 0 } },
    ],
  },
  {
    id: 'q14',
    dimension: 'SN',
    text: '你学习新东西的方式通常是？',
    reverseScored: true, // 反向
    options: [
      { key: 'A', label: '从抽象的理论开始，搞懂底层逻辑', scores: { E: 0, I: 0, S: 0, N: 1, T: 0, F: 0, J: 0, P: 0 } },
      { key: 'B', label: '直接动手做，做着做着就学会了', scores: { E: 0, I: 0, S: 1, N: 0, T: 0, F: 0, J: 0, P: 0 } },
    ],
  },

  // ==================== T/F 维度（7题） ====================
  {
    id: 'q15',
    dimension: 'TF',
    text: '和朋友吵架时，你更在意？',
    reverseScored: false,
    options: [
      { key: 'A', label: '谁对谁错，要把道理说清楚', scores: { E: 0, I: 0, S: 0, N: 0, T: 1, F: 0, J: 0, P: 0 } },
      { key: 'B', label: '伤了感情，要赶紧修复关系', scores: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 1, J: 0, P: 0 } },
    ],
  },
  {
    id: 'q16',
    dimension: 'TF',
    text: '买东西时，你最看重什么？',
    reverseScored: false,
    options: [
      { key: 'A', label: '性价比和实用性，这是客观标准', scores: { E: 0, I: 0, S: 0, N: 0, T: 1, F: 0, J: 0, P: 0 } },
      { key: 'B', label: '这个东西能不能让我开心', scores: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 1, J: 0, P: 0 } },
    ],
  },
  {
    id: 'q17',
    dimension: 'TF',
    text: '当你需要做决定时，你通常会？',
    reverseScored: false,
    options: [
      { key: 'A', label: '列一张利弊清单，用逻辑分析', scores: { E: 0, I: 0, S: 0, N: 0, T: 1, F: 0, J: 0, P: 0 } },
      { key: 'B', label: '问问内心的感受，什么让我更舒服', scores: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 1, J: 0, P: 0 } },
    ],
  },
  {
    id: 'q18',
    dimension: 'TF',
    text: '你看电影更容易被什么打动？',
    reverseScored: false,
    options: [
      { key: 'A', label: '精彩的剧情反转和宏大的世界观', scores: { E: 0, I: 0, S: 0, N: 0, T: 1, F: 0, J: 0, P: 0 } },
      { key: 'B', label: '感人的角色命运，让我哭得稀里哗啦', scores: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 1, J: 0, P: 0 } },
    ],
  },
  {
    id: 'q19',
    dimension: 'TF',
    text: '同事向你诉苦时，你的反应是？',
    reverseScored: false,
    options: [
      { key: 'A', label: '帮他分析问题，找出解决方案', scores: { E: 0, I: 0, S: 0, N: 0, T: 1, F: 0, J: 0, P: 0 } },
      { key: 'B', label: '先安慰他，陪伴比建议更重要', scores: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 1, J: 0, P: 0 } },
    ],
  },
  {
    id: 'q20',
    dimension: 'TF',
    text: '当别人批评你的工作时，你的第一反应是？',
    reverseScored: false,
    options: [
      { key: 'A', label: '看看他说的有没有道理，有则改之', scores: { E: 0, I: 0, S: 0, N: 0, T: 1, F: 0, J: 0, P: 0 } },
      { key: 'B', label: '有点难过，他是不是对我有意见', scores: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 1, J: 0, P: 0 } },
    ],
  },
  {
    id: 'q21',
    dimension: 'TF',
    text: '你觉得什么更重要？',
    reverseScored: true, // 反向
    options: [
      { key: 'A', label: '做一个善解人意的人', scores: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 1, J: 0, P: 0 } },
      { key: 'B', label: '做一个有能力和独立的人', scores: { E: 0, I: 0, S: 0, N: 0, T: 1, F: 0, J: 0, P: 0 } },
    ],
  },

  // ==================== J/P 维度（7题） ====================
  {
    id: 'q22',
    dimension: 'JP',
    text: '你的书桌通常是什么状态？',
    reverseScored: false,
    options: [
      { key: 'A', label: '整整齐齐，每样东西都在固定位置', scores: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 1, P: 0 } },
      { key: 'B', label: '乱中有序，我知道每样东西在哪', scores: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 1 } },
    ],
  },
  {
    id: 'q23',
    dimension: 'JP',
    text: '你通常什么时候开始写假期作业/任务？',
    reverseScored: false,
    options: [
      { key: 'A', label: '刚布置就开始，早完成早安心', scores: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 1, P: 0 } },
      { key: 'B', label: '到最后一天，deadline是第一生产力', scores: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 1 } },
    ],
  },
  {
    id: 'q24',
    dimension: 'JP',
    text: '计划好的周末突然下雨了，你会？',
    reverseScored: false,
    options: [
      { key: 'A', label: '赶紧调整计划，重新安排室内活动', scores: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 1, P: 0 } },
      { key: 'B', label: '正好在家躺着休息，随遇而安', scores: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 1 } },
    ],
  },
  {
    id: 'q25',
    dimension: 'JP',
    text: '你更喜欢什么样的工作方式？',
    reverseScored: false,
    options: [
      { key: 'A', label: '有明确的目标和截止日期', scores: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 1, P: 0 } },
      { key: 'B', label: '自由度越高越好，自己安排时间', scores: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 1 } },
    ],
  },
  {
    id: 'q26',
    dimension: 'JP',
    text: '出门前你通常会？',
    reverseScored: false,
    options: [
      { key: 'A', label: '提前想好要带什么，临走再检查一遍', scores: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 1, P: 0 } },
      { key: 'B', label: '拿上手机和钥匙就出门了，其他的再说', scores: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 1 } },
    ],
  },
  {
    id: 'q27',
    dimension: 'JP',
    text: '你对"计划赶不上变化"这句话的态度是？',
    reverseScored: false,
    options: [
      { key: 'A', label: '讨厌！计划被打乱整个人都不好了', scores: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 1, P: 0 } },
      { key: 'B', label: '正常！随机应变才是生活的乐趣', scores: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 1 } },
    ],
  },
  {
    id: 'q28',
    dimension: 'JP',
    text: '你整理房间的频率是？',
    reverseScored: true, // 反向
    options: [
      { key: 'A', label: '看不下去了才整理，乱着也挺好', scores: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 1 } },
      { key: 'B', label: '每周固定整理一次，井井有条才舒服', scores: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 1, P: 0 } },
    ],
  },
];

export function getQuestions() {
  return questions;
}

