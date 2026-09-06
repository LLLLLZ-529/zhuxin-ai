'use client'
import { useEffect, useState } from 'react'
import { Header } from '@/components/UI'

const tools = [
  { label: '30 秒', name: '深呼吸', desc: '先停一下', seconds: 30 },
  { label: '1 分钟', name: '快速冷静', desc: '稳住情绪', seconds: 60 },
  { label: '3 分钟', name: '身体放松', desc: '松开紧绷', seconds: 180 },
  { label: '5 分钟', name: '下班放松', desc: '切换到休息', seconds: 300 },
  { label: '10 分钟', name: '睡前扫描', desc: '慢慢入睡', seconds: 600 },
]

export default function Relax() {
  const [active, setActive] = useState(false)
  const [paused, setPaused] = useState(false)
  const [seconds, setSeconds] = useState(180)
  const [done, setDone] = useState(false)

  function start(durationSeconds: number) {
    setSeconds(durationSeconds)
    setDone(false)
    setPaused(false)
    setActive(true)
  }

  useEffect(() => {
    const requested = Number(new URLSearchParams(window.location.search).get('start'))
    if (requested > 0) start(requested * 60)
  }, [])

  useEffect(() => {
    if (!active || paused || done) return
    const id = setInterval(() => setSeconds(value => {
      if (value <= 1) { setDone(true); setActive(false); return 0 }
      return value - 1
    }), 1000)
    return () => clearInterval(id)
  }, [active, paused, done])

  if (active || done) return <>
    <Header title="呼吸练习" sub="跟着圆圈慢慢来" />
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      {!done ? <>
        <div className={`grid h-52 w-52 place-items-center rounded-full bg-brand/10 ${paused ? '' : 'breathe'}`}><div className="grid h-36 w-36 place-items-center rounded-full bg-brand text-white shadow-[0_0_60px_rgba(22,124,90,.28)]"><div><p className="text-2xl font-bold">吸气 · 呼气</p><p className="mt-1 text-sm text-white/70">4 秒 · 6 秒</p></div></div></div>
        <p className="mt-10 font-mono text-3xl font-bold">{String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}</p>
        <p className="mt-2 text-sm text-slate-500">肩膀放松，不需要吸得很用力</p>
        <div className="mt-8 flex gap-3"><button onClick={() => setPaused(!paused)} className="min-h-12 rounded-2xl bg-ink px-8 font-bold text-white">{paused ? '继续' : '暂停'}</button><button onClick={() => { setActive(false); setDone(true) }} className="min-h-12 rounded-2xl bg-white px-6 font-bold shadow-sm">提前结束</button></div>
      </> : <>
        <div className="text-7xl">🍃</div><h2 className="mt-6 text-2xl font-bold">辛苦了，练习完成</h2><p className="mt-2 text-slate-500">现在感觉怎么样？</p>
        <div className="mt-6 grid w-full grid-cols-3 gap-2">{['好一些', '差不多', '还是难受'].map(value => <button key={value} onClick={() => setDone(false)} className="min-h-14 rounded-2xl bg-white text-sm font-bold shadow-sm">{value}</button>)}</div>
      </>}
    </div>
  </>

  return <><Header title="快速减压" sub="哪怕只有 30 秒也有用" /><div className="px-5 py-6">
    <div className="rounded-[28px] bg-gradient-to-br from-brand to-emerald-700 p-6 text-white"><p className="text-sm text-white/70">推荐给你</p><h2 className="mt-1 text-2xl font-bold">3 分钟，把今天放下来</h2><p className="mt-2 text-sm leading-6 text-white/70">不用学，只要跟着呼吸圆圈做。</p><button onClick={() => start(180)} className="mt-5 min-h-14 w-full rounded-2xl bg-white font-bold text-brand">开始练习</button></div>
    <h3 className="mt-7 text-lg font-bold">按你现在的时间选</h3>
    <div className="mt-3 space-y-3">{tools.map(tool => <button key={tool.label} onClick={() => start(tool.seconds)} className="flex min-h-20 w-full items-center rounded-3xl bg-white px-5 text-left shadow-sm"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-mint text-xl">😮‍💨</span><span className="ml-4"><b>{tool.name}</b><small className="mt-1 block text-slate-500">{tool.desc}</small></span><span className="ml-auto text-sm font-bold text-brand">{tool.label}</span></button>)}</div>
  </div></>
}
