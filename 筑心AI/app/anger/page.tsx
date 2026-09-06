'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/UI'

export default function Anger() {
  const [level, setLevel] = useState(0)
  const [calm, setCalm] = useState(false)
  const [sec, setSec] = useState(60)
  useEffect(() => { if (!calm || sec === 0) return; const timer = setInterval(() => setSec(value => value - 1), 1000); return () => clearInterval(timer) }, [calm, sec])
  return <><Header title="我现在很生气" sub="冷静支持 Agent · 先稳住，再处理"/><div className="px-5 py-7">
    {!calm ? <><div className="rounded-[28px] bg-red-50 p-6 md:p-8"><div className="text-5xl">🔥</div><h2 className="mt-4 text-2xl font-bold">你现在有多生气？</h2><p className="mt-2 text-slate-500">1 是有点烦，5 是快控制不住</p></div><div className="mt-7 flex max-w-2xl justify-between gap-3">{[1,2,3,4,5].map(value => <button key={value} onClick={() => setLevel(value)} className={`grid h-14 flex-1 place-items-center rounded-2xl text-xl font-bold ${level === value ? 'bg-red-500 text-white ring-4 ring-red-100' : 'bg-white shadow-sm'}`}>{value}</button>)}</div>{level > 0 && <div className="mt-8 grid gap-3 md:grid-cols-2"><button onClick={() => setCalm(true)} className="min-h-14 rounded-2xl bg-ink font-bold text-white">先让我冷静 60 秒</button><Link href={`/chat?agent=anger&topic=${level}级愤怒`} className="flex min-h-14 items-center justify-center rounded-2xl bg-white px-5 font-bold shadow-sm">让冷静 Agent 听我说</Link>{level === 5 && <Link href="/safety" className="flex min-h-14 items-center justify-center rounded-2xl bg-red-100 px-5 font-bold text-red-700 md:col-span-2">我怕自己控制不住</Link>}</div>}</>
      : <div className="text-center"><p className="text-7xl font-bold text-brand">{sec}</p><h2 className="mt-3 text-2xl font-bold">先不急着解决问题</h2><div className="mx-auto mt-7 grid max-w-4xl gap-3 text-left md:grid-cols-2">{['暂时离开争吵现场', '慢慢呼吸，呼气更长', '喝一口水', '现在先不做决定'].map((item,index) => <div key={item} className="flex min-h-14 items-center gap-3 rounded-2xl bg-white px-4 shadow-sm"><span className="grid h-8 w-8 place-items-center rounded-full bg-mint font-bold text-brand">{index+1}</span><b>{item}</b></div>)}</div>{sec === 0 && <div className="mx-auto mt-6 grid max-w-xl grid-cols-2 gap-3"><button onClick={() => { setCalm(false); setSec(60) }} className="min-h-14 rounded-2xl bg-brand font-bold text-white">好一些</button><Link href="/chat?agent=anger&topic=冷静后仍然很生气" className="flex min-h-14 items-center justify-center rounded-2xl bg-white font-bold shadow-sm">还是很生气</Link></div>}</div>}
  </div></>
}
