import { NextResponse } from 'next/server'
import { AgentResponse, ConversationMessage, generateMockResponse } from '@/lib/mock-ai'
import { agents, isAgentKey, type AgentKey } from '@/lib/agents'

const SYSTEM_PROMPT = `你是“筑心 AI”，一个专门陪伴建筑工人的心理健康辅助智能体。
要求：
1. 使用简单、温暖、口语化的中文，每次回复 2～5 句话。
2. 必须直接回应用户最新一句话，先理解感受，再给具体回应。
3. 熟悉加班、欠薪、工头冲突、工伤风险、高温、宿舍、异地家庭、经济和睡眠压力。
4. 用户只想发泄时先倾听；用户要办法时给 1～3 个能马上执行的步骤。
5. 用户说“帮我放松、冷静、缓一缓”时，立刻带领一个 30～60 秒练习，不要继续问分类问题。
6. 用户点击快捷选项是在回答你上一轮的问题。必须接受这个新信息并推进对话，绝不能把上一轮的问题再问一遍。
7. 不得重复、改写或近似复述上一条 assistant 回复，不得询问用户已经回答过的问题。
8. 不做医学诊断，不推荐处方药，不保证治疗结果。
9. 任何工地建议都必须先保证现场安全：只能建议前往指定安全休息区；绝不能让用户在作业区摘安全帽、移除防护装备、靠墙蹲下、闭眼或做影响警觉的动作。
10. 返回严格 JSON：{"message":"回复","quickReplies":["选项1","选项2","选项3"],"riskLevel":"low|medium|high","recommendedAction":null}。
11. quickReplies 必须贴合本轮内容，2～4 个，帮助对话进入下一步。`

type ProviderResult = { response: AgentResponse | null; error: string | null }

function instructionsFor(agent: AgentKey, retry = false) {
  const retryRule = retry ? '\n这是一次防重复重试：上一版回答与历史内容重复。请换一个角度，针对最新信息给出新的、具体的下一步。' : ''
  return `${SYSTEM_PROMPT}\n\n当前角色：${agents[agent].name}\n角色重点：${agents[agent].focus}${retryRule}`
}

function plainInstructionsFor(agent: AgentKey, retry = false) {
  return `你是“筑心 AI”的${agents[agent].name}。${agents[agent].focus}
请直接回应用户最新一句话，使用简单温暖的中文，只回复 2～5 句话。
用户点击选项是在回答上一轮问题，必须推进对话，不得重复上一条回复或已回答的问题。
用户要求放松时立即带领 30～60 秒练习。不要医学诊断，不要推荐药物。
如果涉及工地，先让用户前往指定安全休息区并保持防护装备；禁止建议在作业区摘安全帽、闭眼、蹲靠墙面或降低警觉。
${retry ? '上一版内容重复，请换一个角度给出新的具体回应。' : ''}
只输出自然语言正文，不要 JSON、标题、代码块或快捷选项。`
}

function normalized(value: string) {
  return value.replace(/[\s，。！？、；：“”‘’.,!?;:'"]/g, '').toLowerCase()
}

function parseJsonObject(raw: string) {
  const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start < 0 || end <= start) return null
  try { return JSON.parse(cleaned.slice(start, end + 1)) }
  catch { return null }
}

function repeatsPrevious(message: string, history: ConversationMessage[]) {
  const previous = [...history].reverse().find(item => item.role === 'assistant')?.content
  if (!previous) return false
  const currentValue = normalized(message)
  const previousValue = normalized(previous)
  return currentValue === previousValue || (currentValue.length > 30 && (currentValue.includes(previousValue) || previousValue.includes(currentValue)))
}

function extractOpenAIText(data: any) {
  if (typeof data?.output_text === 'string') return data.output_text
  return (data?.output ?? []).flatMap((item: any) => item?.content ?? []).filter((item: any) => item?.type === 'output_text').map((item: any) => item?.text ?? '').join('')
}

async function generateOpenAI(message: string, history: ConversationMessage[], agent: AgentKey): Promise<ProviderResult> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return { response: null, error: '未配置 OpenAI Key' }
  try {
    const apiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-5.4-mini', instructions: instructionsFor(agent), input: [...history.slice(-10), { role: 'user', content: message }], max_output_tokens: 500 }),
      signal: AbortSignal.timeout(20_000),
    })
    if (!apiResponse.ok) return { response: null, error: `HTTP ${apiResponse.status}` }
    const raw = extractOpenAIText(await apiResponse.json())
    const match = raw.match(/\{[\s\S]*\}/)
    if (!match) return { response: null, error: '模型没有返回 JSON' }
    const parsed = JSON.parse(match[0])
    if (typeof parsed.message !== 'string' || !Array.isArray(parsed.quickReplies)) return { response: null, error: '返回格式不完整' }
    return { response: { ...parsed, riskLevel: parsed.riskLevel || 'low', recommendedAction: parsed.recommendedAction || null, mode: 'live', provider: 'openai' }, error: null }
  } catch (error) {
    return { response: null, error: error instanceof Error ? error.message : '请求失败' }
  }
}

async function requestDeepSeek(message: string, history: ConversationMessage[], agent: AgentKey, retry: boolean, plain = false) {
  const apiKey = process.env.DEEPSEEK_API_KEY as string
  const apiResponse = await fetch(`${process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com'}/chat/completions`, {
    method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: process.env.DEEPSEEK_MODEL || 'deepseek-v4-flash',
      messages: [{ role: 'system', content: plain ? plainInstructionsFor(agent, retry) : instructionsFor(agent, retry) }, ...history.slice(-10), { role: 'user', content: message }],
      ...(plain ? {} : { response_format: { type: 'json_object' } }), thinking: { type: 'disabled' }, max_tokens: 600,
      temperature: retry ? 1 : 0.75, stream: false,
    }),
    signal: AbortSignal.timeout(25_000),
  })
  if (!apiResponse.ok) return { parsed: null, error: `HTTP ${apiResponse.status}` }
  const data = await apiResponse.json()
  const raw = data?.choices?.[0]?.message?.content
  if (typeof raw !== 'string') return { parsed: null, error: '模型没有返回内容' }
  if (plain && raw.trim()) return { parsed: { message: raw.trim(), quickReplies: [], riskLevel: 'low', recommendedAction: null }, error: null }
  const parsed = parseJsonObject(raw)
  return parsed ? { parsed, error: null } : { parsed: null, error: '模型返回了无效 JSON' }
}

async function generateDeepSeek(message: string, history: ConversationMessage[], agent: AgentKey): Promise<ProviderResult> {
  if (!process.env.DEEPSEEK_API_KEY) return { response: null, error: '未配置 DeepSeek Key' }
  try {
    let result = await requestDeepSeek(message, history, agent, false)
    if (!result.parsed) result = await requestDeepSeek(message, history, agent, true, true)
    if (!result.parsed) return { response: null, error: result.error }
    if (repeatsPrevious(result.parsed.message || '', history)) result = await requestDeepSeek(message, history, agent, true, true)
    const parsed = result.parsed
    if (!parsed || typeof parsed.message !== 'string' || !Array.isArray(parsed.quickReplies)) return { response: null, error: result.error || '返回格式不完整' }
    if (repeatsPrevious(parsed.message, history)) return { response: null, error: '模型连续返回了重复内容' }
    return { response: { ...parsed, riskLevel: parsed.riskLevel || 'low', recommendedAction: parsed.recommendedAction || null, mode: 'live', provider: 'deepseek' }, error: null }
  } catch (error) {
    return { response: null, error: error instanceof Error ? error.message : '请求失败' }
  }
}

export async function GET() {
  if (process.env.DEEPSEEK_API_KEY) {
    try {
      const response = await fetch(`${process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com'}/models`, { headers: { Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}` }, signal: AbortSignal.timeout(10_000) })
      return NextResponse.json({ provider: 'deepseek', configured: true, connected: response.ok, model: process.env.DEEPSEEK_MODEL || 'deepseek-v4-flash' }, { status: response.ok ? 200 : 503 })
    } catch { return NextResponse.json({ provider: 'deepseek', configured: true, connected: false, model: process.env.DEEPSEEK_MODEL || 'deepseek-v4-flash' }, { status: 503 }) }
  }
  if (process.env.OPENAI_API_KEY) return NextResponse.json({ provider: 'openai', configured: true, connected: true, model: process.env.OPENAI_MODEL || 'gpt-5.4-mini' })
  return NextResponse.json({ provider: 'local', configured: false, connected: true, model: 'context-mock' })
}

export async function POST(request: Request) {
  const body = await request.json()
  const message = typeof body.message === 'string' ? body.message.trim() : ''
  const agent: AgentKey = isAgentKey(body.agent) ? body.agent : 'general'
  const history: ConversationMessage[] = Array.isArray(body.messages) ? body.messages.filter((item: any) => ['user', 'assistant'].includes(item?.role) && typeof item?.content === 'string').slice(-12) : []
  if (!message) return NextResponse.json({ error: '请输入内容' }, { status: 400 })

  // 安全分类始终在本地、生成前执行。
  const safetyResult = generateMockResponse(message, history, agent)
  if (safetyResult.riskLevel === 'critical' || safetyResult.riskLevel === 'high') return NextResponse.json(safetyResult)

  if (process.env.DEEPSEEK_API_KEY) {
    const deepSeek = await generateDeepSeek(message, history, agent)
    if (deepSeek.response) return NextResponse.json(deepSeek.response)
    return NextResponse.json({ error: `DeepSeek 调用失败：${deepSeek.error}`, provider: 'deepseek' }, { status: 502 })
  }
  if (process.env.OPENAI_API_KEY) {
    const openAI = await generateOpenAI(message, history, agent)
    if (openAI.response) return NextResponse.json(openAI.response)
    return NextResponse.json({ error: `OpenAI 调用失败：${openAI.error}`, provider: 'openai' }, { status: 502 })
  }
  return NextResponse.json({ ...safetyResult, provider: 'local' })
}
