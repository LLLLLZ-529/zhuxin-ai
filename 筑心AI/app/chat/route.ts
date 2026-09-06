// 前端启动时的连接检查（GET）
export async function GET() {
  return Response.json({ connected: true, provider: 'deepseek', model: 'deepseek-chat' })
}

// 聊天请求（POST），转发到腾讯云SCF
export async function POST(req: Request) {
  const { agent, message, messages } = await req.json()
  // ===== 改成你自己的SCF公网URL =====
  const SCF_URL = "https://1376899516-0t589lho57.ap-guangzhou.tencentscf.com/"

  try {
    const res = await fetch(SCF_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agent, message, messages })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || '云函数调用失败')
    return Response.json(data)
  } catch (err) {
    return Response.json(
      { error: '连接异常', message: '模型暂时无法回应' },
      { status: 500 }
    )
  }
}
