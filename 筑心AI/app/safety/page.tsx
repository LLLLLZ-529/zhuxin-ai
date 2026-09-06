'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/UI'
import { PhoneIcon, ShieldExclamationIcon } from '@heroicons/react/24/solid'

export default function Safety() {
  const [state, setState] = useState('')
  return <><Header title="安全关怀" sub="安全关怀 Agent · 你不需要一个人扛"/><div className="px-5 py-7">
    <div className="rounded-[28px] border border-red-100 bg-red-50 p-6 md:p-8"><ShieldExclamationIcon className="h-10 w-10 text-red-600"/><h2 className="mt-4 text-2xl font-bold">我很重视你刚刚说的话</h2><p className="mt-3 max-w-3xl leading-7 text-slate-700">现在最重要的是先确保你是安全的。你现在有没有马上伤害自己或别人的危险？</p></div>
    {!state ? <div className="mt-5 grid gap-3 md:grid-cols-3">{['有，我现在有危险', '没有，目前安全', '我不确定'].map(value => <button key={value} onClick={() => setState(value)} className={`min-h-16 rounded-2xl px-5 text-left font-bold shadow-sm ${value.startsWith('有') ? 'bg-red-600 text-white' : 'bg-white'}`}>{value}</button>)}</div>
      : <div className="mt-6"><h3 className="text-xl font-bold">{state.startsWith('没有') ? '谢谢你告诉我。我们继续待在一起。' : '请马上让一个现实中的人来到你身边'}</h3><p className="mt-2 text-sm leading-6 text-slate-600">去有人的安全位置，远离可能伤害自己或他人的物品。不要独处。</p><div className="mt-5 grid gap-3 md:grid-cols-2"><a href="tel:110" className="flex min-h-16 items-center gap-4 rounded-2xl bg-red-600 px-5 font-bold text-white"><PhoneIcon className="h-6 w-6"/>联系紧急服务 110 / 120</a><Link href="/profile?contact=1" className="flex min-h-16 items-center rounded-2xl bg-white px-5 font-bold shadow-sm">联系我设置的紧急联系人</Link><Link href={`/chat?agent=safety&topic=${encodeURIComponent(state)}`} className="flex min-h-14 items-center justify-center rounded-2xl bg-ink font-bold text-white md:col-span-2">继续和安全关怀 Agent 保持对话</Link></div><p className="mt-5 text-xs leading-5 text-slate-500">筑心 AI 不能替代紧急服务。不会在未经你明确操作和许可时自动发送私人信息。</p></div>}
  </div></>
}
