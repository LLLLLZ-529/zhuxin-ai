import { dangerWords } from './data'

export type ConversationMessage = {
  role: 'user' | 'assistant'
  content: string
}

export type AgentResponse = {
  message: string
  quickReplies: string[]
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  recommendedAction: string | null
  mode: 'mock' | 'live'
  provider?: 'local' | 'openai' | 'deepseek'
}

type Topic = {
  keys: string[]
  label: string
  empathy: string[]
  questions: string[]
  replies: string[]
  steps: string[]
}

const topics: Record<string, Topic> = {
  wage: {
    keys: ['工资', '欠薪', '工钱', '钱', '没发钱', '经济'], label: '工资和钱的压力',
    empathy: ['钱迟迟不到手，家里还等着用，换谁都会着急。', '干了活却拿不到该拿的钱，这种憋屈很真实。'],
    questions: ['现在是拖了多久，还是对方一直没给明确日期？', '你最担心的是眼前生活费，还是家里的开销？'],
    replies: ['拖了一个月以内', '已经拖很久了', '家里急着用钱', '想知道怎么留证据'],
    steps: ['先把合同、考勤、工牌和聊天记录拍照留好', '记下欠款金额、工作日期和对方承诺', '和可信任的工友一起确认情况，避免一个人硬扛'],
  },
  conflict: {
    keys: ['工头', '老板', '骂', '辱骂', '同事', '吵架', '冲突', '矛盾'], label: '工地上的人际冲突',
    empathy: ['被人当众骂或者顶着压力干活，心里窝火很正常。', '工地上天天见面，闹了矛盾确实让人又气又难受。'],
    questions: ['这是偶尔吵了两句，还是已经经常发生？', '你现在更想先消消气，还是想想怎么跟对方说？'],
    replies: ['偶尔吵两句', '经常被骂', '有威胁或动手', '我现在特别生气'],
    steps: ['先离开争吵现场几分钟，别在最气的时候做决定', '把时间、地点和发生的事简单记下来', '等情绪稳一点，只说事实和你的具体要求'],
  },
  fatigue: {
    keys: ['累', '加班', '疲劳', '吃不消', '没力气', '干不动'], label: '连续工作和疲劳',
    empathy: ['连续这么扛着，身体和心都会被耗空。', '不是你不够能撑，是身体真的在提醒你该缓一下了。'],
    questions: ['你现在更像是身体特别累，还是心里也烦得厉害？', '最近一天大概能睡几个小时？'],
    replies: ['身体特别累', '心里很烦', '睡也睡不够', '都有'],
    steps: ['现在先喝点水，坐下让肩膀松一分钟', '今晚只给自己定一个最小目标：早点躺下 20 分钟', '如果有胸痛、晕厥或明显身体不适，尽快找现场医疗人员'],
  },
  sleep: {
    keys: ['睡', '失眠', '夜班', '半夜', '总醒', '醒来', '宿舍', '太吵', '做梦', '脑子停不下来'], label: '睡眠问题',
    empathy: ['人已经很累，脑子却停不下来，确实特别折磨。', '睡不好会把第二天的疲惫和烦躁都放大。'],
    questions: ['你是一直睡不着、半夜醒，还是宿舍环境影响更多？', '这种情况大概持续几天了？'],
    replies: ['一直睡不着', '半夜总醒', '宿舍太吵', '夜班作息乱'],
    steps: ['睡前把明天要做的事写三条，让脑子先放下', '做 3 轮吸气 4 秒、呼气 6 秒', '如果长期靠喝酒入睡或持续数周，建议找医生或专业人员聊聊'],
  },
  family: {
    keys: ['家里', '老婆', '丈夫', '孩子', '父母', '想家', '家人', '异地'], label: '异地和家庭牵挂',
    empathy: ['人在外面干活，最难受的往往就是想家却回不去。', '你一边扛工作，一边惦记家里，心里当然会沉。'],
    questions: ['你最想念的是谁，还是最近和家里闹了别扭？', '你想先把心里话说出来，还是让我帮你写一句话？'],
    replies: ['想孩子了', '担心父母', '和爱人吵架了', '帮我写句话'],
    steps: ['不用等有大段时间，先发一句“我今天想到你了”', '约一个双方都方便的十分钟，只聊近况不解决争执', '把担心分成“今天能做”和“以后再处理”两件事'],
  },
  anger: {
    keys: ['生气', '愤怒', '火大', '想打', '控制不住', '气死', '想骂'], label: '强烈愤怒',
    empathy: ['你现在这股火很大，我先陪你稳住，不急着讲道理。', '听得出来你真的被逼得很火大。先保证你和别人都安全。'],
    questions: ['你现在和对方还在一起吗？能不能先走开几步？', '现在这股气从 1 到 5，大概有几分？'],
    replies: ['我已经走开了', '还在现场', '先带我冷静', '我怕控制不住'],
    steps: ['马上和争吵现场拉开距离', '手里如果有工具先放下，去有其他人的地方', '慢慢呼气，呼气时间比吸气长'],
  },
  safety: {
    keys: ['危险', '工伤', '受伤', '高空', '安全绳', '事故'], label: '工作安全担忧',
    empathy: ['担心出事不是胆小，安全本来就该放在工期前面。', '感觉现场不安全时，你的警觉很重要。'],
    questions: ['危险是正在发生，还是你担心接下来的工作安排？', '现场有没有安全员或你信得过的班组长？'],
    replies: ['危险正在发生', '防护不到位', '担心会受伤', '想记录这件事'],
    steps: ['如果危险正在发生，先停止靠近并提醒身边的人', '找现场安全负责人说明具体位置和问题', '在确保自身安全的前提下记录时间、地点和隐患'],
  },
  lonely: {
    keys: ['孤独', '没人说', '一个人', '没人懂', '没意思', '心里难受'], label: '孤独和情绪低落',
    empathy: ['一个人憋着这么久，真的会很沉。你愿意说出来已经不容易。', '我在听。你不用把话组织得很完整。'],
    questions: ['这种难受是今天突然加重，还是已经持续一阵子了？', '你现在更想有人听着，还是想找一个能做的小办法？'],
    replies: ['先听我说', '已经很久了', '今天特别难受', '给我一个小办法'],
    steps: ['先给一个信得过的人发一句“我今天有点难受”', '去有人的地方坐一会儿，不要一直独处', '只做一件能让身体舒服一点的小事，比如洗脸或喝热水'],
  },
}

function pick<T>(items: T[], seed: string) {
  let value = 0
  for (const char of seed) value = (value * 31 + char.charCodeAt(0)) >>> 0
  return items[value % items.length]
}

function findTopic(text: string, history: ConversationMessage[], agent = 'general') {
  const context = `${history.slice(-5).map(item => item.content).join(' ')} ${text}`
  const preferred: Record<string, string> = { work: 'fatigue', sleep: 'sleep', family: 'family', anger: 'anger', treehole: 'lonely', mood: 'lonely', safety: 'safety' }
  let best: [string, number] = [preferred[agent] || 'lonely', agent === 'general' ? 0 : 2]
  for (const [name, topic] of Object.entries(topics)) {
    const score = topic.keys.reduce((sum, key) => sum + (context.includes(key) ? key.length : 0), 0)
    if (score > best[1]) best = [name, score]
  }
  return topics[best[0]]
}

export function generateMockResponse(message: string, history: ConversationMessage[] = [], agent = 'general'): AgentResponse {
  const text = message.trim()
  const critical = dangerWords.some(word => text.includes(word))
  if (critical) return {
    message: '我很重视你刚刚说的话。现在最重要的是先确保你是安全的。你现在有没有马上伤害自己或别人的危险？',
    quickReplies: ['有，我现在有危险', '没有，目前安全', '我不确定'], riskLevel: 'critical', recommendedAction: 'safety_mode', mode: 'mock',
  }

  const violent = ['想打人', '想砍', '弄死他', '控制不住'].some(word => text.includes(word))
  if (violent) return {
    message: '先和对方拉开距离，把手里的工具放下，去有其他人的地方。你现在和对方还在一起吗？',
    quickReplies: ['已经走开了', '还在现场', '有人陪着我', '我需要紧急帮助'], riskLevel: 'high', recommendedAction: 'safety_mode', mode: 'mock',
  }

  if (/^(你好|在吗|嗨|hello|有人吗)[！!。\s]*$/i.test(text)) return {
    message: '在呢。今天工地上还顺利吗？不想打字太多，也可以直接点一个。',
    quickReplies: ['今天太累了', '有件烦心事', '最近睡不好', '就想随便聊聊'], riskLevel: 'low', recommendedAction: null, mode: 'mock',
  }

  const topic = findTopic(text, history, agent)
  const wantsListening = /听我说|发泄|别给建议|只想说|骂两句/.test(text)
  const wantsPlan = /怎么办|办法|建议|怎么做|帮我分析|解决/.test(text)
  const wantsMessage = /写句话|怎么开口|发消息/.test(text)

  if (wantsMessage) return {
    message: '可以这样说：“最近我工作有点忙，但一直惦记着你。前几天没顾上好好说话，不是我不在乎。你最近怎么样？”你想要更简单，还是更温柔一点？',
    quickReplies: ['更简单一点', '更温柔一点', '写给孩子', '写给爱人'], riskLevel: 'low', recommendedAction: null, mode: 'mock',
  }

  if (wantsListening) return {
    message: `${pick(topic.empathy, text)}你慢慢说，最让你难受的那一段是什么？我先听着，不急着给办法。`,
    quickReplies: ['事情是这样的…', '最气的是…', '我也说不清', '我说完了'], riskLevel: 'low', recommendedAction: null, mode: 'mock',
  }

  if (wantsPlan) return {
    message: `${pick(topic.empathy, text)}先别一下扛完，可以从这三步开始：\n1. ${topic.steps[0]}；\n2. ${topic.steps[1]}；\n3. ${topic.steps[2]}。\n哪一步对你现在最有用？`,
    quickReplies: ['先做第一步', '第二步更有用', '还是有点难', '换个办法'], riskLevel: 'low', recommendedAction: null, mode: 'mock',
  }

  const question = pick(topic.questions, `${text}${history.length}`)
  return {
    message: `${pick(topic.empathy, text)}${question}`,
    quickReplies: topic.replies, riskLevel: topic === topics.anger ? 'medium' : 'low', recommendedAction: null, mode: 'mock',
  }
}
