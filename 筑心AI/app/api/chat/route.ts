import { NextResponse } from 'next/server'
// 前端启动时的连接检查（GET）
export async function GET() {
  return NextResponse.json({ connected: true, provider: 'deepseek', model: 'deepseek-chat' })
}
// 聊天请求（POST），转发到腾讯云SCF
export async function POST(req: Request) {
  const { agent, message, messages } = await req.json()
  const SCF_URL = "https://xxxxxxxxxx.ap-guangzhou.tencentscf.com/"
  try {
    const res = await fetch(SCF_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agent, message, messages })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || '云函数调用失败')
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json(
      { error: '连接异常', message: '模型暂时无法回应' },
      { status: 500 }
    )
  }
}
