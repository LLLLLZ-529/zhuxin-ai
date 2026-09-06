'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header, Pill, Toast } from '@/components/UI'
import { moods, saveMood } from '@/lib/data'

const tags = ['工作太累', '老板 / 工头', '工资', '家庭', '睡眠', '身体不舒服', '同事关系', '工作安全', '天气', '说不上来']

export default function Mood() {
  const [step, setStep] = useState(1)
  const [score, setScore] = useState(0)
  const [picked, setPicked] = useState<string[]>([])
  const [note, setNote] = useState('')
  const [toast, setToast] = useState(false)
  function done() { saveMood({ score, tags: picked, note, date: new Date().toISOString() }); setStep(4); setToast(true); setTimeout(() => setToast(false), 1800) }
  const context = `${moods.find(item => item.score === score)?.label || ''}；${picked.join('、')}${note ? `；${note}` : ''}`
  return <><Header title="今日心情" sub={step < 4 ? `第 ${step} 步 / 3` : '情绪整理 Agent 已准备好'}/><div className="px-5 py-7">
    {step === 1 && <><p className="text-sm font-bold text-brand">不用想太久</p><h2 className="mt-2 text-2xl font-bold">今天感觉怎么样？</h2><div className="mt-6 grid gap-3 md:grid-cols-5">{moods.map(mood => <button key={mood.score} onClick={() => { setScore(mood.score); setTimeout(() => setStep(2), 180) }} className={`flex min-h-28 items-center gap-4 rounded-2xl border bg-white px-5 text-left shadow-sm md:flex-col md:justify-center ${score === mood.score ? 'border-brand ring-2 ring-brand/15' : ''}`}><span className="text-3xl">{mood.e}</span><span className="font-bold">{mood.label}</span></button>)}</div></>}
    {step === 2 && <><h2 className="text-2xl font-bold">今天最影响你的是什么？</h2><p className="mt-2 text-sm text-slate-500">可以多选，也可以跳过</p><div className="mt-6 flex flex-wrap gap-3">{tags.map(tag => <Pill key={tag} active={picked.includes(tag)} onClick={() => setPicked(current => current.includes(tag) ? current.filter(value => value !== tag) : [...current, tag])}>{tag}</Pill>)}</div><button onClick={() => setStep(3)} className="mt-8 min-h-14 w-full rounded-2xl bg-brand font-bold text-white">下一步</button></>}
    {step === 3 && <><h2 className="text-2xl font-bold">想记一句今天发生的事吗？</h2><p className="mt-2 text-sm text-slate-500">这一步可以不填，内容会一起交给情绪 Agent</p><textarea value={note} onChange={event => setNote(event.target.value)} className="mt-6 h-36 w-full resize-none rounded-3xl border bg-white p-5 outline-none focus:border-brand" placeholder="比如：今天活儿很多，但工友帮了我一把…"/><button onClick={done} className="mt-5 min-h-14 w-full rounded-2xl bg-brand font-bold text-white">记下今天</button></>}
    {step === 4 && <div className="text-center"><div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-mint text-5xl">{moods.find(mood => mood.score === score)?.e}</div><h2 className="mt-6 text-2xl font-bold">今天的心情已经记下来了</h2><p className="mt-2 text-slate-500">情绪：{score < 3 ? '偏低' : score === 3 ? '一般' : '还不错'} · 压力：{picked.length > 3 ? '偏高' : '中等'}</p><div className="mx-auto mt-8 grid max-w-3xl gap-3 md:grid-cols-3"><Link href="/relax?start=3" className="flex min-h-14 items-center justify-center rounded-2xl bg-white font-bold shadow-sm">做 3 分钟减压</Link><Link href={`/chat?agent=mood&topic=${encodeURIComponent(context)}`} className="flex min-h-14 items-center justify-center rounded-2xl bg-brand font-bold text-white">让情绪 Agent 回答</Link><Link href="/" className="flex min-h-14 items-center justify-center rounded-2xl bg-white text-sm text-slate-500">今天先这样</Link></div></div>}
  </div>{toast && <Toast text="已安全保存在本机"/>}</>
}
