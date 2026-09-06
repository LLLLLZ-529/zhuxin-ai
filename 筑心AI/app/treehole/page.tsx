'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/UI'

export default function Treehole() {
  const [text, setText] = useState('')
  const [sent, setSent] = useState(false)
  const [reply, setReply] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  async function askAgent(support: string) {
    setReply(support)
    if (support === '不用回复') { setAnswer('好，我安静地陪你一会儿。你写下的烦恼只留在这里。'); return }
    setLoading(true)
    try {
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ agent: 'treehole', message: `${text}\n我希望你：${support}`, messages: [] }) })
      const data = await response.json()
      setAnswer(data.message || '我在听。你愿意写下这些，已经很不容易了。')
    } catch { setAnswer('连接有点慢，但我还在。你可以继续说。') }
    finally { setLoading(false) }
  }

  return <><Header title="工友树洞" sub="树洞倾听 Agent · 匿名表达"/><div className="px-5 py-7">
    <div className="text-center"><div className="text-7xl">🌳</div><h2 className="mt-4 text-2xl font-bold">这里可以随便说</h2><p className="mt-2 text-sm text-slate-500">不需要说得完整，也没人会评判你。</p></div>
    {!sent ? <><textarea value={text} onChange={event => setText(event.target.value)} className="mt-7 h-40 w-full resize-none rounded-[28px] border bg-white p-5 outline-none focus:border-brand" placeholder="今天有什么想丢进树洞里的？"/><button onClick={() => text.trim() && setSent(true)} disabled={!text.trim()} className="mt-4 min-h-14 w-full rounded-2xl bg-brand font-bold text-white disabled:bg-slate-300">把纸条丢进去</button></>
      : <><div className="relative mx-auto mt-7 h-28 overflow-hidden"><div className="paper-drop absolute left-1/2 h-12 w-16 -translate-x-1/2 rounded bg-amber-100 shadow">📝</div><div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-6xl">🕳️</div></div><div className="rounded-3xl bg-white p-5 text-center shadow-sm"><h3 className="font-bold">烦恼已经收好了</h3><p className="mt-2 text-sm text-slate-500">你希望树洞 Agent 怎么陪你？</p><div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">{['听我说', '安慰我', '帮我想办法', '不用回复'].map(value => <button key={value} onClick={() => void askAgent(value)} className={`min-h-12 rounded-2xl font-bold ${reply === value ? 'bg-brand text-white' : 'bg-mint text-brand'}`}>{value}</button>)}</div>{loading && <p className="mt-4 animate-pulse rounded-2xl bg-slate-50 p-4 text-sm">树洞 Agent 正在认真听…</p>}{answer && !loading && <p className="mt-4 whitespace-pre-line rounded-2xl bg-slate-50 p-4 text-left text-sm leading-7">{answer}</p>}</div><div className="mt-4 flex gap-3"><button onClick={() => { setSent(false); setText(''); setAnswer(''); setReply('') }} className="min-h-12 flex-1 rounded-2xl bg-white font-bold shadow-sm">再写一张</button><Link href={`/chat?agent=treehole&topic=${encodeURIComponent(text.slice(0, 30))}`} className="flex min-h-12 flex-1 items-center justify-center rounded-2xl bg-ink font-bold text-white">继续聊下去</Link></div></>}
  </div></>
}
