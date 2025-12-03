import './globals.css'

export const metadata = {
  title: '心境追踪 Mood Tracker',
  description: '我们不判断，只陪你一起看见自己的情绪波动',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&family=ZCOOL+XiaoWei&family=Noto+Serif+SC:wght@300;400&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
