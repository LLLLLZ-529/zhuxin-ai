import type { Metadata } from 'next'
import './globals.css'
import { AppShell } from '@/components/AppShell'

export const metadata: Metadata = { title:'筑心 AI｜懂工地的心理伙伴', description:'面向建筑工人的温暖心理健康辅助工具' }
export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="zh-CN"><body><AppShell>{children}</AppShell></body></html>
}
