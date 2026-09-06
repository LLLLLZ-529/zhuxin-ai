'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HomeIcon, ChatBubbleOvalLeftEllipsisIcon, WrenchScrewdriverIcon, ChartBarIcon,
  UserCircleIcon, FaceSmileIcon, ClipboardDocumentCheckIcon, MoonIcon,
  ShieldExclamationIcon, LockClosedIcon,
} from '@heroicons/react/24/outline'

const primaryNav = [
  ['/', '首页概览', HomeIcon], ['/chat', '和筑心聊聊', ChatBubbleOvalLeftEllipsisIcon],
  ['/relax', '减压工具箱', WrenchScrewdriverIcon], ['/report', '状态报告', ChartBarIcon],
  ['/profile', '个人中心', UserCircleIcon],
] as const
const quickNav = [
  ['/mood', '今日心情', FaceSmileIcon], ['/assessment', '心理自测', ClipboardDocumentCheckIcon],
  ['/sleep', '睡眠助手', MoonIcon], ['/safety', '安全关怀', ShieldExclamationIcon],
] as const
function isActive(path: string, href: string) { return href === '/' ? path === '/' : path.startsWith(href) }

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname()
  return <div className="min-h-screen bg-[#eef2ef]">
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-[280px] flex-col bg-[#10251d] p-5 text-white md:flex">
      <Link href="/" className="flex items-center gap-3 rounded-2xl px-2 py-2"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-2xl">🏗️</div><div><p className="text-[10px] font-bold tracking-[.22em] text-emerald-300">BUILDWELL AI</p><p className="text-xl font-bold">筑心 AI</p></div></Link>
      <nav className="mt-8 space-y-1.5"><p className="mb-3 px-3 text-[10px] font-bold tracking-[.18em] text-white/35">主要功能</p>{primaryNav.map(([href, label, Icon]) => { const active = isActive(path, href); return <Link key={href} href={href} className={`flex min-h-12 items-center gap-3 rounded-2xl px-3 text-sm font-semibold transition ${active ? 'bg-white text-ink shadow-lg' : 'text-white/65 hover:bg-white/10 hover:text-white'}`}><Icon className="h-5 w-5" /><span>{label}</span>{active && <span className="ml-auto h-2 w-2 rounded-full bg-brand" />}</Link> })}</nav>
      <nav className="mt-7 space-y-1"><p className="mb-3 px-3 text-[10px] font-bold tracking-[.18em] text-white/35">快捷入口</p>{quickNav.map(([href, label, Icon]) => <Link key={href} href={href} className={`flex min-h-10 items-center gap-3 rounded-xl px-3 text-sm transition ${isActive(path, href) ? 'bg-emerald-400/15 text-emerald-200' : 'text-white/55 hover:bg-white/5 hover:text-white'}`}><Icon className="h-[18px] w-[18px]" />{label}</Link>)}</nav>
      <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4"><div className="flex items-center gap-2 text-xs font-bold text-emerald-200"><LockClosedIcon className="h-4 w-4" />隐私受到保护</div><p className="mt-2 text-[11px] leading-5 text-white/45">聊天不会提供给工头或公司，管理端仅显示匿名汇总。</p></div>
      <div className="mt-3 flex items-center gap-3 rounded-2xl px-2 py-3"><div className="grid h-9 w-9 place-items-center rounded-full bg-amber/20">👷</div><div><p className="text-sm font-bold">晚上好，工友</p><p className="text-[10px] text-white/40">连续打卡 12 天</p></div></div>
    </aside>
    <div className="min-h-screen md:pl-[280px]"><main className="safe-bottom min-h-screen bg-cream md:pb-0"><div className="mx-auto min-h-screen w-full max-w-[1540px]">{children}</div></main></div>
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-black/5 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"><div className="flex w-full justify-around">{primaryNav.map(([href, label, Icon]) => { const active = isActive(path, href); return <Link key={href} href={href} className={`flex min-h-16 min-w-16 flex-col items-center justify-center gap-1 text-xs font-medium ${active ? 'text-brand' : 'text-slate-500'}`}><Icon className={`h-6 w-6 ${active ? 'stroke-[2.4]' : ''}`} /><span>{label.replace('概览', '').replace('和筑心', '').replace('减压', '').replace('状态', '').replace('个人中心', '我的')}</span></Link> })}</div></nav>
  </div>
}
