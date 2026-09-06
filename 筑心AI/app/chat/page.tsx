'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { dangerWords } from '@/lib/data'
import { agents, isAgentKey, type AgentKey } from '@/lib/agents'
import { Header } from '@/components/UI'
import { MicrophoneIcon, PaperAirplaneIcon, SparklesIcon } from '@heroicons/react/24/solid'

type Msg = { role: 'ai' | 'user'; text: string; source?: 'deepseek' | 'openai' | 'local' | 'preset' }
type ChatResponse = { message: string; quickReplies: string[]; riskLevel: string; recommendedAction: string | null; mode: 'mock' | 'live'; provider?: 'local' | 'openai' | 'deepseek' }
type ConnectionState = { status: 'checking' | 'connected' | 'error'; provider: 'local' | 'openai' | 'deepseek'; model: string }

const actions = ['帮我冷静一下', '帮我分析', '我只想发泄', '给我一个办法', '做个呼吸练习', '帮我写句话']

export default function Chat() {
  const [agent, setAgent] = useState<AgentKey>('general')
  const [msgs, setMsgs] = useState<Msg[]>([{ role: 'ai', text: agents.general.greeting, source: 'preset' }])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [quickReplies, setQuickReplies] = useState<string[]>([])
  const [mode, setMode] = useState<'mock' | 'live'>('mock')
  const [provider, setProvider] = useState<'local' | 'openai' | 'deepseek'>('local')
  const [connection, setConnection] = useState<ConnectionState>({ status: 'checking', provider: 'local', model: '' })
  const end = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const currentAgent = agents[agent]

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const requested = params.get('agent')
    const nextAgent: AgentKey = isAgentKey(requested) ? requested : 'general'
    const topic = params.get('topic')
    setAgent(nextAgent)
    setMsgs([{ role: 'ai', text: topic ? `${agents[nextAgent].greeting}\n\n你刚刚选择了“${topic}”，愿意说说具体发生了什么吗？` : agents[nextAgent].greeting, source: 'preset' }])
    setQuickReplies(topic ? ['事情是这样的…', '我只想发泄', '帮我分析', '给我一个办法'] : [])
  }, [])

  useEffect(() => {
    let active = true
    async function checkConnection() {
      try {
        const response = await fetch('/api/chat', { cache: 'no-store' })
        const data = await response.json()
        if (!active) return
        const nextProvider = data.provider || 'local'
        setConnection({ status: response.ok && data.connected ? 'connected' : 'error', provider: nextProvider, model: data.model || '' })
        if (response.ok && data.connected && nextProvider !== 'local') { setMode('live'); setProvider(nextProvider) }
      } catch { if (active) setConnection({ status: 'error', provider: 'deepseek', model: '' }) }
    }
    void checkConnection()
    return () => { active = false }
  }, [])

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, typing, quickReplies])

  async function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || typing) return
    if (dangerWords.some(word => trimmed.includes(word))) {
      router.push('/safety?from=chat')
      return
    }

    const history = msgs.map(item => ({ role: item.role === 'ai' ? 'assistant' : 'user', content: item.text }))
    setMsgs(current => [...current, { role: 'user', text: trimmed }])
    setInput('')
    setQuickReplies([])
    setTyping(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent, message: trimmed, messages: history }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || '模型请求失败')
      if (data.recommendedAction === 'safety_mode' && ['high', 'critical'].includes(data.riskLevel)) {
        router.push('/safety?from=chat')
        return
      }
      setMsgs(current => [...current, { role: 'ai', text: data.message, source: data.provider || 'local' }])
      setQuickReplies(data.quickReplies || [])
      setMode(data.mode || 'mock')
      setProvider(data.provider || 'local')
    } catch (error) {
      const detail = error instanceof Error ? error.message : '未知错误'
      setMsgs(current => [...current, { role: 'ai', text: `⚠️ DeepSeek 没有成功返回，本轮没有使用模板代答。\n${detail}`, source: 'local' }])
      setQuickReplies([])
      setConnection(current => ({ ...current, status: 'error' }))
    } finally {
      setTyping(false)
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    void send(input)
  }

  function selectAgent(nextAgent: AgentKey) {
    if (nextAgent === agent) return
    setAgent(nextAgent)
    setMsgs([{ role: 'ai', text: agents[nextAgent].greeting, source: 'preset' }])
    setQuickReplies([])
    setInput('')
    window.history.replaceState(null, '', `/chat?agent=${nextAgent}`)
  }

  return <>
    <Header title={`${currentAgent.icon} ${currentAgent.name}`} sub={connection.status === 'connected' && connection.provider === 'deepseek' ? `DeepSeek 实时回应 · ${currentAgent.description}` : `${connection.status === 'checking' ? '正在检查模型连接' : '模型连接异常'} · ${currentAgent.description}`} />
    <div className="mx-auto max-w-[1160px] px-4 pb-28 pt-5 md:px-8 md:pb-32 md:pt-8 lg:px-12">
      <div className={`mb-5 flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm ${connection.status === 'connected' ? 'border-emerald-100 bg-emerald-50 text-emerald-800' : connection.status === 'checking' ? 'border-slate-200 bg-white text-slate-500' : 'border-red-200 bg-red-50 text-red-700'}`}><span className={`h-2.5 w-2.5 rounded-full ${connection.status === 'connected' ? 'bg-emerald-500' : connection.status === 'checking' ? 'animate-pulse bg-amber' : 'bg-red-500'}`}/><b>{connection.status === 'connected' ? `${connection.provider === 'deepseek' ? 'DeepSeek' : 'AI'} 已连接` : connection.status === 'checking' ? '正在验证 API 连接…' : 'DeepSeek 连接异常'}</b>{connection.model && <span className="text-xs opacity-60">{connection.model}</span>}<span className="ml-auto hidden text-xs opacity-60 md:block">每条实时回复都会标注来源</span></div>
      <div className="mb-5 flex gap-2 overflow-x-auto pb-2">{Object.values(agents).map(item => <button key={item.key} onClick={() => selectAgent(item.key)} className={`flex min-h-11 shrink-0 items-center gap-2 rounded-2xl px-4 text-sm font-semibold transition ${agent === item.key ? 'bg-ink text-white shadow-md' : 'border bg-white text-slate-600'}`}><span>{item.icon}</span>{item.shortName}</button>)}</div>
      <div className="mb-4 flex gap-2 overflow-x-auto pb-2">{actions.map(action => <button key={action} onClick={() => action.includes('呼吸') ? router.push('/relax?start=1') : void send(action)} className="min-h-10 shrink-0 rounded-full border bg-white px-4 text-xs font-semibold">{action}</button>)}</div>
      <div className="space-y-4">
        {msgs.map((msg, index) => <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          {msg.role === 'ai' && <div className="mr-2 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-brand text-white"><SparklesIcon className="h-4 w-4" /></div>}
          <div className="max-w-[78%] md:max-w-[68%]"><div className={`whitespace-pre-line rounded-[22px] px-4 py-3 text-[15px] leading-6 md:px-5 md:py-4 md:text-base ${msg.role === 'user' ? 'rounded-br-md bg-brand text-white' : 'rounded-bl-md bg-white shadow-sm'}`}>{msg.text}</div>{msg.role === 'ai' && <p className="mt-1.5 px-2 text-[10px] font-semibold text-slate-400">{msg.source === 'deepseek' ? '● DeepSeek · 实时生成' : msg.source === 'openai' ? '● OpenAI · 实时生成' : msg.source === 'preset' ? '预设引导语' : '本地安全提示'}</p>}</div>
        </div>)}
        {msgs.length === 1 && quickReplies.length === 0 && <div className="grid grid-cols-2 gap-2 pl-10 md:grid-cols-3">{currentAgent.starters.map(starter => <button key={starter} onClick={() => void send(starter)} className="min-h-12 rounded-2xl border bg-white px-3 text-left text-sm font-medium shadow-sm">{starter}</button>)}</div>}
        {typing && <div className="ml-10 flex w-fit items-center gap-1 rounded-2xl bg-white px-4 py-3 text-slate-400"><span className="animate-pulse">●</span><span className="animate-pulse [animation-delay:150ms]">●</span><span className="animate-pulse [animation-delay:300ms]">●</span></div>}
        {!typing && quickReplies.length > 0 && <div className="flex flex-wrap gap-2 pl-10">{quickReplies.map(reply => <button key={reply} onClick={() => void send(reply)} className="min-h-11 rounded-2xl border border-brand/15 bg-mint px-4 text-left text-sm font-semibold text-brand">{reply}</button>)}</div>}
        <div ref={end} />
      </div>
    </div>
    <form onSubmit={submit} className="fixed bottom-16 left-1/2 z-40 flex w-full max-w-[480px] -translate-x-1/2 gap-2 border-t bg-white p-3 shadow-[0_-8px_30px_rgba(20,50,38,.06)] md:bottom-0 md:left-[280px] md:right-0 md:w-auto md:max-w-none md:translate-x-0 md:px-8 md:py-4 lg:px-16 xl:px-24">
      <button type="button" onClick={() => setInput('我最近天天加班，身体很累，晚上也睡不好')} className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-mint text-brand" aria-label="语音输入"><MicrophoneIcon className="h-5 w-5" /></button>
      <input value={input} onChange={event => setInput(event.target.value)} disabled={typing} className="min-w-0 flex-1 rounded-2xl bg-slate-100 px-4 outline-none disabled:opacity-60" placeholder={typing ? '筑心正在想…' : '输入想说的话…'} />
      <button disabled={typing || !input.trim()} className="grid h-12 w-12 place-items-center rounded-2xl bg-brand text-white disabled:bg-slate-300" aria-label="发送"><PaperAirplaneIcon className="h-5 w-5" /></button>
    </form>
  </>
}
