'use client'
import { useState } from 'react'
export default function TestScfPage() {
  const url = "https://1376899516-0t589lho57.ap-guangzhou.tencentscf.com/"
  const [result, setResult] = useState("")
  async function runTest() {
    const payload = {
      message: "今天加班很累",
      messages: [{ role: "user", content: "我想聊聊" }]
    }
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      setResult(JSON.stringify(data,null,2))
    } catch(e){
      setResult("请求失败："+String(e))
    }
  }
  return (
    <div className="p-8">
      <h1>SCF POST测试工具</h1>
      <button onClick={runTest} className="my-4 rounded bg-blue-500 px-4 py-2 text-white">发起POST请求</button>
      <pre className="mt-4 whitespace-pre-wrap rounded bg-slate-100 p-4">{result}</pre>
    </div>
  )
}
