'use client'

import Link from 'next/link'
import { useState } from 'react'
import { moods } from '@/lib/data'
import { ArrowRightIcon, BellIcon, ShieldCheckIcon, SparklesIcon } from '@heroicons/react/24/outline'

const features = [
  ['💬', '找人聊聊', '随时有人听', '/chat'], ['😊', '今日心情', '花 10 秒记一下', '/mood'],
  ['🧠', '心理自测', '了解最近状态', '/assessment'], ['😮‍💨', '快速减压', '30 秒就能开始', '/relax'],
  ['😴', '睡眠助手', '今晚睡踏实点', '/sleep'], ['🏗️', '工地烦心事', '懂你的工作难处', '/work'],
  ['🏠', '家庭烦恼', '把想说的说出来', '/family'], ['🌳', '工友树洞', '匿名丢下烦恼', '/treehole'],
  ['😡', '我很生气', '先稳住，再处理', '/anger'], ['🆘', '我需要帮助', '立即获得安全支持', '/safety'],
]

export default function Home() {
  const [picked, setPicked] = useState<number | null>(null)
  return <div className="pb-8">
    <header className="flex min-h-[84px] items-center border-b border-black/5 px-5 md:px-8">
      <div><p className="text-sm text-slate-500">2026年8月 · 星期日</p><h1 className="mt-0.5 text-2xl font-bold">首页概览</h1></div>
      <div className="ml-auto flex items-center gap-3"><div className="hidden rounded-full border bg-white px-4 py-2 text-xs font-semibold text-brand lg:block">● 服务正常</div><button className="relative grid h-11 w-11 place-items-center rounded-full bg-white shadow-sm" aria-label="消息"><BellIcon className="h-5 w-5"/><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-amber"/></button></div>
    </header>

    <section className="px-5 pt-5 md:px-8 md:pt-8">
      <div className="relative overflow-hidden rounded-[32px] bg-brand text-white shadow-soft">
        <div className="absolute inset-0 dot-grid opacity-25"/>
        <div className="relative grid gap-8 p-6 md:p-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:p-10">
          <div><div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs text-emerald-100"><SparklesIcon className="h-4 w-4"/>懂工地的心理伙伴</div><h2 className="mt-5 text-3xl font-bold leading-tight lg:text-[38px]">晚上好，今天辛苦了。</h2><p className="mt-3 max-w-xl text-sm leading-7 text-white/65 lg:text-base">这里不是医院，也没有人评判你。工作、睡眠、家里或心里的烦闷，都可以慢慢说。</p><div className="mt-7 flex flex-wrap gap-3"><Link href="/chat" className="flex min-h-12 items-center gap-2 rounded-2xl bg-white px-6 font-bold text-brand">开始聊聊 <ArrowRightIcon className="h-4 w-4"/></Link><Link href="/relax?start=3" className="flex min-h-12 items-center rounded-2xl bg-white/10 px-6 font-bold text-white ring-1 ring-white/15">做 3 分钟放松</Link></div></div>
          <div className="rounded-[26px] bg-white p-5 text-ink shadow-xl md:p-6"><div className="flex items-center justify-between"><div><p className="text-xs font-bold text-brand">今日打卡</p><h3 className="mt-1 text-xl font-bold">今天心情怎么样？</h3></div><span className="rounded-full bg-mint px-3 py-1.5 text-xs font-semibold text-brand">约 10 秒</span></div><div className="mt-5 grid grid-cols-5 gap-2">{moods.map(mood => <button key={mood.score} onClick={() => setPicked(mood.score)} className={`flex min-h-20 flex-col items-center justify-center rounded-2xl text-3xl transition ${picked === mood.score ? 'scale-[1.03] bg-amber/15 ring-2 ring-amber' : 'bg-slate-50 hover:bg-mint'}`}><span>{mood.e}</span><span className="mt-1 text-[11px] text-slate-500">{mood.label}</span></button>)}</div>{picked ? <Link href="/mood" className="mt-4 flex min-h-11 items-center justify-center gap-1 rounded-xl bg-brand text-sm font-bold text-white">继续记录 <ArrowRightIcon className="h-4 w-4"/></Link> : <p className="mt-4 text-center text-xs text-slate-400">按第一感觉选，不需要想太久</p>}</div>
        </div>
      </div>
    </section>

    <section className="px-5 py-7 md:px-8 md:py-8"><div className="mb-4 flex items-end justify-between"><div><p className="text-xs font-bold tracking-widest text-brand">快捷服务</p><h2 className="mt-1 text-2xl font-bold">现在就能帮你</h2></div><span className="hidden text-sm text-slate-400 md:block">所有功能都可以直接使用</span></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{features.map(([icon, title, desc, href]) => <Link href={href} key={title} className={`group min-h-36 rounded-[24px] border bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-lg active:scale-[.98] ${title === '我需要帮助' ? 'border-red-100' : 'border-white'}`}><div className="flex items-start justify-between"><span className={`grid h-12 w-12 place-items-center rounded-2xl text-2xl ${title === '我需要帮助' ? 'bg-red-50' : 'bg-mint'}`}>{icon}</span><ArrowRightIcon className="h-4 w-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-brand"/></div><h3 className="mt-4 font-bold">{title}</h3><p className="mt-1 text-xs text-slate-500">{desc}</p></Link>)}</div></section>

    <section className="grid gap-5 px-5 md:px-8 lg:grid-cols-[1.35fr_.65fr]">
      <div className="rounded-[28px] bg-ink p-6 text-white md:p-7"><div className="flex items-start justify-between"><div><p className="text-xs text-white/45">本周心理状态</p><h2 className="mt-1 text-xl font-bold">撑得有点久了，今晚缓一缓</h2></div><Link href="/report" className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-white/75">查看完整报告 →</Link></div><div className="mt-7 grid gap-5 md:grid-cols-3">{[['情绪',68,'bg-emerald-400','正在回升'],['压力',78,'bg-amber','需要关注'],['睡眠',52,'bg-sky-400','恢复不足']].map(([name,value,color,note]) => <div key={String(name)} className="rounded-2xl bg-white/5 p-4"><div className="flex items-end justify-between"><span className="text-sm font-bold">{name}</span><b className="text-2xl">{value}</b></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10"><div className={`h-full rounded-full ${color}`} style={{width:`${value}%`}}/></div><p className="mt-2 text-xs text-white/40">{note}</p></div>)}</div><div className="mt-5 flex flex-wrap items-center gap-4 rounded-2xl bg-white/5 p-4"><div className="text-2xl">💡</div><p className="min-w-[220px] flex-1 text-sm leading-6 text-white/65">你最近的工作压力有点高。试试 3 分钟身体放松，把今天留在今天。</p><Link href="/relax?start=3" className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-ink">开始放松</Link></div></div>
      <div className="flex flex-col gap-4"><div className="flex-1 rounded-[28px] bg-white p-6 shadow-soft"><p className="text-xs font-bold text-brand">今天的小目标</p><h3 className="mt-2 text-xl font-bold">下班后，先照顾自己 3 分钟</h3><div className="mt-5 space-y-3">{['喝一杯水','松开肩膀和手','睡前少看 10 分钟手机'].map((item,index) => <div key={item} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-sm"><span className={`grid h-6 w-6 place-items-center rounded-full text-xs font-bold ${index===0?'bg-brand text-white':'border border-slate-300 text-slate-400'}`}>{index===0?'✓':index+1}</span>{item}</div>)}</div></div><div className="flex items-start gap-3 rounded-[24px] bg-mint p-5 text-sm leading-6 text-brand"><ShieldCheckIcon className="mt-0.5 h-6 w-6 shrink-0"/><p><b>你的隐私，只属于你。</b><br/><span className="text-brand/70">聊天不会提供给工头或公司。</span></p></div></div>
    </section>
  </div>
}
