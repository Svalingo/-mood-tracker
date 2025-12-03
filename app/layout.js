import './globals.css'

export const metadata = {
  title: '心境追踪 Mood Tracker',
  description: '双相障碍情绪与生理数据分析',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
