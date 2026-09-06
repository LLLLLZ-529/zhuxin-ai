import type { Config } from 'tailwindcss'
const config: Config = { content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'], theme: { extend: { colors: { ink:'#17211d', cream:'#f6f4ed', brand:'#167c5a', mint:'#dff3e9', amber:'#f4a340' }, boxShadow:{soft:'0 12px 30px rgba(29,74,57,.08)'} } }, plugins: [] }
export default config
