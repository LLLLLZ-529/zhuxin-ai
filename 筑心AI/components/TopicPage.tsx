'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from './UI'
import type { AgentKey } from '@/lib/agents'

export function TopicPage({ title, sub, emoji, items, agent }: { title: string; sub: string; emoji: string; items: string[]; agent: AgentKey }) {
  const [pick, setPick] = useState('')
  const chatUrl = `/chat?agent=${agent}&topic=${encodeURIComponent(pick)}`
  return <><Header title={title} sub={sub}/><div className="px-5 py-6">
    {!pick ? <><div className="rounded-[28px] bg-mint p-6 md:p-8"><div className="text-5xl">{emoji}</div><h2 className="mt-4 text-2xl font-bold">你最近是哪种情况？</h2><p className="mt-2 text-sm text-brand/70">点最接近的一项，对应 Agent 会接着陪你聊。</p></div><div className="mt-5 grid grid-cols-2 gap-3">{items.map(item => <button key={item} onClick={() => setPick(item)} className="min-h-20 rounded-3xl border border-white bg-white p-4 text-left font-bold shadow-sm transition hover:-translate-y-0.5 hover:border-brand/20">{item}</button>)}</div></>
      : <div><div className="rounded-[28px] bg-white p-6 shadow-soft md:p-8"><p className="text-xs font-bold text-brand">你选择了</p><h2 className="mt-2 text-2xl font-bold">{pick}</h2><p className="mt-5 leading-7 text-slate-600">这件事一直压着，确实会让人很难受。对应的支持 Agent 已准备好，会结合这个情况继续问你，而不是从头开始。</p></div><h3 className="mt-7 font-bold">现在你更需要什么？</h3><div className="mt-3 grid gap-3 md:grid-cols-2"><Link href={chatUrl} className="flex min-h-14 items-center rounded-2xl bg-brand px-5 font-bold text-white">💬 让对应 Agent 接着聊</Link><Link href="/relax?start=1" className="flex min-h-14 items-center rounded-2xl bg-white px-5 font-bold shadow-sm">😮‍💨 先让我缓一缓</Link></div><button onClick={() => setPick('')} className="mt-4 min-h-12 w-full text-sm text-slate-500">换一个情况</button></div>}
  </div></>
}
