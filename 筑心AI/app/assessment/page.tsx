'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/UI'

const tests = [['压力测试','最近是不是一直绷着？','5 题'],['情绪状态','看看这一周的心情','6 题'],['焦虑状态','脑子总停不下来吗？','5 题'],['睡眠质量','了解最近的睡眠','6 题'],['工作疲劳','身体和心都累吗？','5 题'],['孤独感','异地生活还好吗？','5 题'],['愤怒程度','最近容易冒火吗？','5 题'],['酒精风险','喝酒是否影响生活？','6 题']]
const questions = ['最近一周，你是不是觉得事情太多，顾不过来？','下班以后，身体还是很难放松吗？','最近容易因为小事烦躁吗？','夜里会想着工作的事，睡不安稳吗？','你觉得自己还能应付眼前的生活吗？']

export default function Assessment() {
  const [test, setTest] = useState('')
  const [question, setQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  function answer(value: number) { const next = score + value; setScore(next); if (question === questions.length - 1) setDone(true); else setQuestion(question + 1) }
  const level = score > 10 ? '偏高' : score > 6 ? '中等' : '较轻'
  return <><Header title="心理自测" sub="只作状态提醒，不是医学诊断"/><div className="px-5 py-6">
    {!test ? <><div className="rounded-[28px] bg-ink p-6 text-white md:p-8"><div className="text-4xl">🧠</div><h2 className="mt-4 text-2xl font-bold">花两分钟，看看最近的自己</h2><p className="mt-2 text-sm text-white/60">没有对错，按第一感觉选；结果可交给对应 Agent 继续解释。</p></div><div className="mt-5 grid grid-cols-2 gap-3">{tests.map(([name,desc,count]) => <button key={name} onClick={() => setTest(name)} className="min-h-32 rounded-3xl bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5"><b>{name}</b><span className="mt-2 block text-xs leading-5 text-slate-500">{desc}</span><span className="mt-3 block text-xs font-bold text-brand">{count} · 约 2 分钟</span></button>)}</div></>
      : !done ? <><div className="flex items-center justify-between text-sm"><b className="text-brand">{test}</b><span>{question+1} / {questions.length}</span></div><div className="mt-3 h-2 rounded-full bg-slate-200"><div className="h-full rounded-full bg-brand transition-all" style={{width:`${(question+1)/questions.length*100}%`}}/></div><div className="mt-7 rounded-[28px] bg-white p-6 shadow-soft md:p-8"><p className="text-xs text-slate-400">想想最近一周</p><h2 className="mt-3 text-xl font-bold leading-8">{questions[question]}</h2></div><div className="mt-5 grid gap-3 md:grid-cols-2">{[['没有',0],['偶尔',1],['有一半时间',2],['经常',3]].map(([label,value]) => <button key={String(label)} onClick={() => answer(Number(value))} className="min-h-14 rounded-2xl bg-white px-5 text-left font-bold shadow-sm">{label}</button>)}</div></>
        : <div className="text-center"><div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-amber/20 text-5xl">🌤️</div><p className="mt-6 text-sm text-slate-500">你的近期{test}</p><h2 className="mt-1 text-3xl font-bold">{level}</h2><div className="mx-auto mt-6 max-w-2xl rounded-3xl bg-white p-5 text-left shadow-sm"><b>可能主要来自</b><ul className="mt-3 space-y-2 text-sm text-slate-600"><li>• 工作疲劳和持续紧绷</li><li>• 睡眠恢复不够</li><li>• 对经济和工期的担心</li></ul></div><div className="mx-auto mt-5 grid max-w-2xl gap-3 md:grid-cols-2"><Link href="/relax?start=3" className="flex min-h-14 items-center justify-center rounded-2xl bg-white font-bold shadow-sm">做 3 分钟减压</Link><Link href={`/chat?agent=mood&topic=${encodeURIComponent(`${test}结果：${level}，得分${score}`)}`} className="flex min-h-14 items-center justify-center rounded-2xl bg-brand font-bold text-white">让情绪 Agent 解释</Link></div><p className="mt-6 text-xs leading-5 text-slate-500">这个结果不能替代医生或专业心理咨询人员的判断。</p></div>}
  </div></>
}
