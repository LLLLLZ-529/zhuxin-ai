'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header, Toast } from '@/components/UI'

const items = ['想老婆 / 丈夫', '想孩子', '跟家里吵架', '没时间陪家人', '挣钱压力', '父母身体不好', '不知道怎么开口', '家里不理解我']

export default function Family() {
  const [pick, setPick] = useState('')
  const [style, setStyle] = useState('温柔')
  const [toast, setToast] = useState(false)
  const msg = pick.includes('孩子') ? '最近爸爸工作有点忙，但一直想着你。学校最近怎么样？有开心的事也跟爸爸说说。' : '最近工作有点忙，没顾上好好说话。其实我一直惦记着家里，也惦记着你。有空我们聊一会儿。'
  return <><Header title="家庭烦恼" sub="家庭沟通 Agent · 有些话慢慢说也行"/><div className="px-5 py-6">
    {!pick ? <><div className="rounded-[28px] bg-mint p-6 md:p-8"><div className="text-5xl">🏠</div><h2 className="mt-4 text-2xl font-bold">最让你挂心的是？</h2><p className="mt-2 text-sm text-brand/70">选择后可以生成一句话，也可以让家庭 Agent 继续聊。</p></div><div className="mt-5 grid grid-cols-2 gap-3">{items.map(item => <button key={item} onClick={() => setPick(item)} className="min-h-20 rounded-3xl bg-white p-4 text-left font-bold shadow-sm transition hover:-translate-y-0.5">{item}</button>)}</div></>
      : <><div className="rounded-[28px] bg-white p-6 shadow-soft md:p-8"><p className="text-xs font-bold text-brand">先帮你写一句 · {style}</p><p className="mt-4 text-lg leading-8">{msg}</p></div><div className="mt-4 flex gap-2">{['更简单', '更温柔', '换一种'].map(value => <button key={value} onClick={() => setStyle(value)} className="min-h-11 flex-1 rounded-2xl bg-mint text-xs font-bold text-brand">{value}</button>)}</div><div className="mt-5 grid gap-3 md:grid-cols-2"><button onClick={async () => { await navigator.clipboard?.writeText(msg); setToast(true); setTimeout(() => setToast(false), 1500) }} className="min-h-14 rounded-2xl bg-white font-bold text-brand shadow-sm">复制这段话</button><Link href={`/chat?agent=family&topic=${encodeURIComponent(pick)}`} className="flex min-h-14 items-center justify-center rounded-2xl bg-brand font-bold text-white">让家庭 Agent 继续回答</Link></div><button onClick={() => setPick('')} className="mt-3 min-h-12 w-full text-sm text-slate-500">重新选择</button></>}
  </div>{toast && <Toast text="已复制，可以发给家人了"/>}</>
}
