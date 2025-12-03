'use client'
import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, ComposedChart, Bar } from 'recharts'

const i18n = {
  zh: {
    title: '心境追踪', subtitle: '双相障碍情绪与生理数据分析',
    login: '登录', register: '注册', logout: '退出登录', email: '邮箱', password: '密码',
    loginBtn: '登录', registerBtn: '注册', switchToRegister: '没有账号？注册', switchToLogin: '已有账号？登录',
    tabs: { input: '📝 记录', analysis: '🔍 分析', trends: '📊 趋势' },
    date: '日期', moodScore: '今日情绪评分', moodDesc: '描述你的感受',
    moodPlaceholder: '今天感觉如何？有什么特别的想法或经历？',
    watchData: 'Apple Watch 数据', sleep: '睡眠时长', hours: '小时', hrv: 'HRV',
    steps: '步数', stepUnit: '步', exercise: '运动时长', minutes: '分钟',
    sleepHR: '睡眠心率范围', min: '最低', max: '最高',
    medication: '💊 用药记录', medPlaceholder: '记录今天的用药情况，如：碳酸锂 300mg 早晚各一次',
    medTaken: '已按时服药', submit: '提交并分析', submitNoApi: '📋 记录并生成对话提示',
    noApiHint: '未配置 API，提交后将生成对话提示', saving: '保存中...', analyzing: 'AI 正在分析...',
    saved: '✨ 记录已保存', copyHint: '💬 复制下面的内容，发送给 Claude 进行对话分析',
    copy: '📋 复制到剪贴板', copied: '已复制！', viewTrends: '查看趋势',
    status: '当前状态', summary: '📋 摘要', analysis: '🔍 详细分析', 
    warnings: '⚠️ 注意事项', suggestions: '💡 建议',
    waiting: '等待分析', twoMethods: '两种分析方式',
    method1: '💬 方式一：与 Claude 对话', method1Desc: '提交记录后，复制生成的提示词进行对话分析',
    method2: '⚡ 方式二：自动 API 分析', method2Desc: '配置 API Key 后，获得即时分析结果',
    trendsTitle: '📈 情绪与生理指标趋势', noData: '暂无数据，开始记录后这里将显示趋势图表',
    moodTrend: '情绪评分', sleepHrv: '睡眠 & HRV', sleepHRRange: '睡眠心率范围',
    show: '显示', hide: '隐藏', history: '历史记录', records: '条',
    disclaimer: '⚠️ 本应用仅供辅助记录和参考，不能替代专业医疗诊断。',
    disclaimer2: '如感到严重不适，请及时联系你的医生或心理健康专业人士。',
    delete: '删除', confirmDelete: '确定删除这条记录吗？',
    enterMood: '请输入今天的情绪感受', lowestHR: '最低心率', highestHR: '最高心率',
    loginError: '登录失败，请检查邮箱和密码', registerError: '注册失败',
    registerSuccess: '注册成功！', loading: '加载中...',
    apiSettings: '⚙️ API 设置', provider: '选择 API 服务商', apiKey: 'API Key',
    apiKeyPlaceholder: '输入你的 API Key', model: '模型', apiUrl: 'API 地址',
    configured: '已配置', notConfigured: '⚠️ 未配置 API Key 时，可复制提示词与 Claude 对话',
    done: '完成', configApi: '⚙️ 配置 API'
  },
  en: {
    title: 'Mood Tracker', subtitle: 'Bipolar Disorder Emotion & Physiological Data Analysis',
    login: 'Login', register: 'Register', logout: 'Logout', email: 'Email', password: 'Password',
    loginBtn: 'Login', registerBtn: 'Register', switchToRegister: 'No account? Register', switchToLogin: 'Have account? Login',
    tabs: { input: '📝 Record', analysis: '🔍 Analysis', trends: '📊 Trends' },
    date: 'Date', moodScore: 'Today\'s Mood Score', moodDesc: 'Describe your feelings',
    moodPlaceholder: 'How are you feeling today? Any special thoughts or experiences?',
    watchData: 'Apple Watch Data', sleep: 'Sleep', hours: 'hrs', hrv: 'HRV',
    steps: 'Steps', stepUnit: 'steps', exercise: 'Exercise', minutes: 'min',
    sleepHR: 'Sleep Heart Rate Range', min: 'Min', max: 'Max',
    medication: '💊 Medication Log', medPlaceholder: 'Record today\'s medication, e.g.: Lithium 300mg twice daily',
    medTaken: 'Medication taken as scheduled', submit: 'Submit & Analyze', submitNoApi: '📋 Record & Generate Prompt',
    noApiHint: 'No API configured. A prompt will be generated.', saving: 'Saving...', analyzing: 'AI analyzing...',
    saved: '✨ Record Saved', copyHint: '💬 Copy the content below and send it to Claude for analysis',
    copy: '📋 Copy to Clipboard', copied: 'Copied!', viewTrends: 'View Trends',
    status: 'Current Status', summary: '📋 Summary', analysis: '🔍 Detailed Analysis',
    warnings: '⚠️ Warnings', suggestions: '💡 Suggestions',
    waiting: 'Waiting for analysis', twoMethods: 'Two Analysis Methods',
    method1: '💬 Method 1: Chat with Claude', method1Desc: 'Copy the generated prompt for conversation analysis',
    method2: '⚡ Method 2: Auto API Analysis', method2Desc: 'Configure API Key for instant analysis',
    trendsTitle: '📈 Mood & Physiological Trends', noData: 'No data yet. Trends will appear after you start recording.',
    moodTrend: 'Mood Score', sleepHrv: 'Sleep & HRV', sleepHRRange: 'Sleep HR Range',
    show: 'Show', hide: 'Hide', history: 'History', records: 'records',
    disclaimer: '⚠️ This app is for reference only and cannot replace professional medical diagnosis.',
    disclaimer2: 'If you feel severe discomfort, please contact your doctor or mental health professional.',
    delete: 'Delete', confirmDelete: 'Delete this record?',
    enterMood: 'Please enter your mood description', lowestHR: 'Lowest HR', highestHR: 'Highest HR',
    loginError: 'Login failed, please check email and password', registerError: 'Registration failed',
    registerSuccess: 'Registered!', loading: 'Loading...',
    apiSettings: '⚙️ API Settings', provider: 'Select API Provider', apiKey: 'API Key',
    apiKeyPlaceholder: 'Enter your API Key', model: 'Model', apiUrl: 'API URL',
    configured: 'Configured', notConfigured: '⚠️ Without API Key, you can copy prompts to chat with Claude',
    done: 'Done', configApi: '⚙️ Configure API'
  }
}

const API_PROVIDERS = {
  openai: { name: 'OpenAI', baseUrl: 'https://api.openai.com/v1/chat/completions', defaultModel: 'gpt-4o', models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'], formatRequest: (m, model) => ({ model, messages: m, max_tokens: 1500 }), parseResponse: d => d.choices[0].message.content },
  anthropic: { name: 'Anthropic Claude', baseUrl: 'https://api.anthropic.com/v1/messages', defaultModel: 'claude-sonnet-4-20250514', models: ['claude-sonnet-4-20250514', 'claude-3-5-sonnet-20241022'], formatRequest: (m, model) => ({ model, max_tokens: 1500, messages: m }), parseResponse: d => d.content[0].text, extraHeaders: { 'anthropic-version': '2023-06-01' } },
  deepseek: { name: 'DeepSeek', baseUrl: 'https://api.deepseek.com/chat/completions', defaultModel: 'deepseek-chat', models: ['deepseek-chat', 'deepseek-coder'], formatRequest: (m, model) => ({ model, messages: m, max_tokens: 1500 }), parseResponse: d => d.choices[0].message.content },
  moonshot: { name: 'Moonshot (月之暗面)', baseUrl: 'https://api.moonshot.cn/v1/chat/completions', defaultModel: 'moonshot-v1-8k', models: ['moonshot-v1-8k', 'moonshot-v1-32k'], formatRequest: (m, model) => ({ model, messages: m, max_tokens: 1500 }), parseResponse: d => d.choices[0].message.content },
  zhipu: { name: '智谱 GLM', baseUrl: 'https://open.bigmodel.cn/api/paas/v4/chat/completions', defaultModel: 'glm-4', models: ['glm-4', 'glm-4-flash'], formatRequest: (m, model) => ({ model, messages: m, max_tokens: 1500 }), parseResponse: d => d.choices[0].message.content },
  custom: { name: 'Custom API', baseUrl: '', defaultModel: '', models: [], formatRequest: (m, model) => ({ model, messages: m, max_tokens: 1500 }), parseResponse: d => d.choices?.[0]?.message?.content || d.content?.[0]?.text || '' }
}

const analyzeWithAI = async (entry, history, config, lang) => {
  const isZh = lang === 'zh'
  const prompt = isZh ? `你是一位专业的心理健康分析助手，帮助双相障碍患者追踪情绪。

当前数据：
- 日期：${entry.date}
- 情绪感受：${entry.moodText}
- 情绪评分（1-10）：${entry.moodScore}
- 睡眠：${entry.sleep}小时 | HRV：${entry.hrv}ms | 睡眠心率：${entry.sleepHRMin}-${entry.sleepHRMax}bpm
- 步数：${entry.steps} | 运动：${entry.exercise}分钟
- 用药：${entry.medication || '未记录'} | 按时服药：${entry.medicationTaken ? '是' : '否'}

历史数据（最近7天）：
${history.slice(-7).map(h => `${h.date}: 情绪=${h.moodScore}, 睡眠=${h.sleep}h, 用药=${h.medication || '未记录'}`).join('\n')}

请分析并输出JSON：
{"status":"稳定/轻度躁狂倾向/轻度抑郁倾向/需要关注","statusColor":"green/yellow/orange/red","summary":"简短总结","analysis":"详细分析","warnings":["预警信号"],"suggestions":["建议"],"trendDirection":"up/down/stable"}
只输出JSON。` : `You are a mental health assistant helping bipolar patients track mood.

Current data:
- Date: ${entry.date}
- Mood: ${entry.moodText}
- Score (1-10): ${entry.moodScore}
- Sleep: ${entry.sleep}h | HRV: ${entry.hrv}ms | Sleep HR: ${entry.sleepHRMin}-${entry.sleepHRMax}bpm
- Steps: ${entry.steps} | Exercise: ${entry.exercise}min
- Medication: ${entry.medication || 'Not recorded'} | Taken: ${entry.medicationTaken ? 'Yes' : 'No'}

History (last 7 days):
${history.slice(-7).map(h => `${h.date}: mood=${h.moodScore}, sleep=${h.sleep}h, med=${h.medication || 'N/A'}`).join('\n')}

Analyze and output JSON:
{"status":"Stable/Mild manic/Mild depressive/Needs attention","statusColor":"green/yellow/orange/red","summary":"Brief","analysis":"Detailed","warnings":["warnings"],"suggestions":["suggestions"],"trendDirection":"up/down/stable"}
Output JSON only.`

  const provider = API_PROVIDERS[config.provider]
  const baseUrl = config.provider === 'custom' ? config.customUrl : provider.baseUrl
  const model = config.model || provider.defaultModel
  try {
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${config.apiKey}`, ...provider.extraHeaders }
    if (config.provider === 'anthropic') { headers['x-api-key'] = config.apiKey; delete headers['Authorization'] }
    const res = await fetch(baseUrl, { method: 'POST', headers, body: JSON.stringify(provider.formatRequest([{ role: 'user', content: prompt }], model)) })
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    const data = await res.json()
    let text = provider.parseResponse(data).replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(text)
  } catch (e) {
    return { status: isZh ? '分析失败' : 'Analysis failed', statusColor: 'gray', summary: e.message, analysis: '', warnings: [], suggestions: [], trendDirection: 'stable' }
  }
}

export default function Home() {
  const [lang, setLang] = useState('zh')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authMode, setAuthMode] = useState('login')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  
  const [entries, setEntries] = useState([])
  const [entry, setEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    moodText: '', moodScore: 5, sleep: 7, hrv: 50,
    sleepHRMin: 48, sleepHRMax: 58, steps: 5000, exercise: 30,
    medication: '', medicationTaken: false
  })
  const [activeTab, setActiveTab] = useState('input')
  const [showHistory, setShowHistory] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [apiConfig, setApiConfig] = useState({ provider: 'openai', apiKey: '', model: '', customUrl: '' })
  const [prompt, setPrompt] = useState('')
  const [showPrompt, setShowPrompt] = useState(false)

  const t = i18n[lang]
  const emojis = ['😢','😔','😕','😐','🙂','😊','😄','😃','🤩','🌟']

  useEffect(() => {
    const savedLang = localStorage.getItem('mood_lang')
    if (savedLang) setLang(savedLang)
    const savedConfig = localStorage.getItem('mood_api_config')
    if (savedConfig) setApiConfig(JSON.parse(savedConfig))
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
      if (session?.user) loadEntries(session.user.id)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) loadEntries(session.user.id)
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadEntries = async (userId) => {
    const { data, error } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: true })
    if (!error && data) {
      setEntries(data.map(e => ({
        id: e.id, date: e.date, moodScore: e.mood_score, moodText: e.mood_text,
        sleep: e.sleep, hrv: e.hrv, sleepHRMin: e.sleep_hr_min, sleepHRMax: e.sleep_hr_max,
        steps: e.steps, exercise: e.exercise, medication: e.medication, medicationTaken: e.medication_taken
      })))
    }
  }

  const toggleLang = () => {
    const n = lang === 'zh' ? 'en' : 'zh'
    setLang(n)
    localStorage.setItem('mood_lang', n)
  }

  const saveApiConfig = (config) => {
    setApiConfig(config)
    localStorage.setItem('mood_api_config', JSON.stringify(config))
  }

  const handleAuth = async (e) => {
    e.preventDefault()
    setAuthError('')
    setAuthLoading(true)
    
    if (authMode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword })
      if (error) setAuthError(t.loginError)
    } else {
      const { error } = await supabase.auth.signUp({ email: authEmail, password: authPassword })
      if (error) setAuthError(t.registerError + ': ' + error.message)
      else { setAuthError(t.registerSuccess); setAuthMode('login') }
    }
    setAuthLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setEntries([])
    setAnalysis(null)
  }

  const genPrompt = (e, h) => lang === 'zh' ? `你好，我正在追踪我的双相障碍情况，请帮我分析：

【今日记录】${e.date}
- 情绪评分：${e.moodScore}/10
- 感受：${e.moodText}

【生理数据】睡眠${e.sleep}h | HRV ${e.hrv}ms | 睡眠心率${e.sleepHRMin}-${e.sleepHRMax}bpm | 步数${e.steps} | 运动${e.exercise}min

【用药】${e.medication || '未记录'} | 按时服药：${e.medicationTaken ? '是' : '否'}

${h.length ? `【历史】\n${h.slice(-7).map(x => `${x.date}: 情绪${x.moodScore}, 睡眠${x.sleep}h, 用药${x.medication || '未记录'}`).join('\n')}` : '（首条记录）'}

请分析情绪状态、生理关联、用药依从性、趋势变化、预警信号和建议。谢谢！` : `Hi, I'm tracking my bipolar disorder. Please analyze:

【Today】${e.date}
- Mood: ${e.moodScore}/10
- Feeling: ${e.moodText}

【Data】Sleep ${e.sleep}h | HRV ${e.hrv}ms | Sleep HR ${e.sleepHRMin}-${e.sleepHRMax}bpm | Steps ${e.steps} | Exercise ${e.exercise}min

【Medication】${e.medication || 'Not recorded'} | Taken: ${e.medicationTaken ? 'Yes' : 'No'}

${h.length ? `【History】\n${h.slice(-7).map(x => `${x.date}: mood${x.moodScore}, sleep${x.sleep}h, med${x.medication || 'N/A'}`).join('\n')}` : '(First record)'}

Please analyze mood state, physiological correlations, medication adherence, trends, warnings, and suggestions. Thanks!`

  const handleSubmit = async () => {
    if (!entry.moodText.trim()) { alert(t.enterMood); return }
    setIsAnalyzing(true)
    
    // 保存到数据库
    const { error } = await supabase.from('mood_entries').insert({
      user_id: user.id, date: entry.date, mood_score: entry.moodScore,
      mood_text: entry.moodText, sleep: entry.sleep, hrv: entry.hrv,
      sleep_hr_min: entry.sleepHRMin, sleep_hr_max: entry.sleepHRMax,
      steps: entry.steps, exercise: entry.exercise,
      medication: entry.medication, medication_taken: entry.medicationTaken
    })
    
    if (error) {
      setIsAnalyzing(false)
      alert('保存失败: ' + error.message)
      return
    }

    await loadEntries(user.id)

    // 如果没有API Key，生成对话提示
    if (!apiConfig.apiKey) {
      setPrompt(genPrompt(entry, entries))
      setShowPrompt(true)
      setIsAnalyzing(false)
      setEntry({ ...entry, moodText: '', moodScore: 5, medication: '', medicationTaken: false })
      return
    }

    // 有API Key，进行AI分析
    const result = await analyzeWithAI(entry, entries, apiConfig, lang)
    setAnalysis(result)
    setIsAnalyzing(false)
    setActiveTab('analysis')
    setEntry({ ...entry, moodText: '', moodScore: 5, medication: '', medicationTaken: false })
  }

  const deleteEntry = async (id) => {
    if (window.confirm(t.confirmDelete)) {
      await supabase.from('mood_entries').delete().eq('id', id)
      setEntries(entries.filter(e => e.id !== id))
    }
  }

  const copyToClipboard = async (text) => {
    try { await navigator.clipboard.writeText(text) } 
    catch { const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta) }
    alert(t.copied)
  }

  const statusStyle = c => ({ green: { bg: 'rgba(34,197,94,0.15)', border: '#22c55e', text: '#16a34a' }, yellow: { bg: 'rgba(250,204,21,0.15)', border: '#facc15', text: '#ca8a04' }, orange: { bg: 'rgba(249,115,22,0.15)', border: '#f97316', text: '#ea580c' }, red: { bg: 'rgba(239,68,68,0.15)', border: '#ef4444', text: '#dc2626' }, gray: { bg: 'rgba(156,163,175,0.15)', border: '#9ca3af', text: '#6b7280' } }[c] || { bg: 'rgba(156,163,175,0.15)', border: '#9ca3af', text: '#6b7280' })

  const inputStyle = { width: '100%', padding: 14, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#e8e6f0', fontSize: 15 }
  const btnPrimary = { padding: 16, background: 'linear-gradient(135deg,#8b5cf6,#6366f1)', border: 'none', borderRadius: 12, color: '#fff', fontSize: 16, fontWeight: 500, cursor: 'pointer', width: '100%' }
  const modal = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }
  const modalBox = { background: 'linear-gradient(135deg,#1a1a3e,#0f0f23)', borderRadius: 20, padding: 28, width: '100%', maxWidth: 500, border: '1px solid rgba(255,255,255,0.1)', maxHeight: '90vh', overflowY: 'auto' }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>⏳</div>
          <p>{t.loading}</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
              <button onClick={toggleLang} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 6, color: '#a0a0c0', fontSize: 12, cursor: 'pointer' }}>
                {lang === 'zh' ? 'EN' : '中文'}
              </button>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 300, marginBottom: 8, background: 'linear-gradient(90deg,#a78bfa,#60a5fa,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t.title}</h1>
            <p style={{ fontSize: 14, color: '#8b8ba7' }}>{t.subtitle}</p>
          </div>
          
          <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 20, padding: 28, border: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 style={{ fontSize: 20, marginBottom: 24, textAlign: 'center' }}>{authMode === 'login' ? t.login : t.register}</h2>
            <form onSubmit={handleAuth}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: '#a0a0c0' }}>{t.email}</label>
                <input type="email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} required style={inputStyle} />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: '#a0a0c0' }}>{t.password}</label>
                <input type="password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} required minLength={6} style={inputStyle} />
              </div>
              {authError && <p style={{ color: authError.includes('成功') || authError.includes('Registered') ? '#4ade80' : '#f87171', fontSize: 14, marginBottom: 16, textAlign: 'center' }}>{authError}</p>}
              <button type="submit" disabled={authLoading} style={{ ...btnPrimary, opacity: authLoading ? 0.7 : 1 }}>
                {authLoading ? '...' : (authMode === 'login' ? t.loginBtn : t.registerBtn)}
              </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14 }}>
              <button onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setAuthError('') }} style={{ background: 'none', border: 'none', color: '#8b5cf6', cursor: 'pointer', textDecoration: 'underline' }}>
                {authMode === 'login' ? t.switchToRegister : t.switchToLogin}
              </button>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', padding: 20, position: 'relative' }}>
      <div style={{ position: 'absolute', top: '-50%', right: '-30%', width: '80%', height: '80%', background: 'radial-gradient(circle,rgba(139,92,246,0.08) 0%,transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        
        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: '#6b6b8a' }}>{user.email}</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={toggleLang} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 6, color: '#a0a0c0', fontSize: 12, cursor: 'pointer' }}>{lang === 'zh' ? 'EN' : '中文'}</button>
              <button onClick={handleLogout} style={{ padding: '6px 12px', background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, color: '#f87171', fontSize: 12, cursor: 'pointer' }}>{t.logout}</button>
            </div>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 300, letterSpacing: '0.1em', marginBottom: 8, background: 'linear-gradient(90deg,#a78bfa,#60a5fa,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundSize: '200% 100%', animation: 'shimmer 3s ease-in-out infinite' }}>{t.title}</h1>
          <p style={{ fontSize: 14, color: '#8b8ba7' }}>{t.subtitle}</p>
        </header>

        {/* Navigation */}
        <nav style={{ display: 'flex', gap: 8, marginBottom: 24, padding: 4, background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
          {['input','analysis','trends'].map(id => (
            <button key={id} onClick={() => setActiveTab(id)} style={{ flex: 1, padding: 12, border: 'none', borderRadius: 8, background: activeTab === id ? 'linear-gradient(135deg,rgba(139,92,246,0.3),rgba(59,130,246,0.3))' : 'transparent', color: activeTab === id ? '#fff' : '#8b8ba7', fontSize: 14, cursor: 'pointer' }}>
              {t.tabs[id]}
            </button>
          ))}
          <button onClick={() => setShowSettings(true)} style={{ padding: '12px 16px', border: 'none', borderRadius: 8, background: apiConfig.apiKey ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)', color: apiConfig.apiKey ? '#4ade80' : '#f87171', fontSize: 14, cursor: 'pointer' }}>⚙️</button>
        </nav>

        {/* Prompt Modal */}
        {showPrompt && <div style={modal}><div style={{...modalBox, maxWidth: 600, display: 'flex', flexDirection: 'column'}}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}><h2 style={{ fontSize: 18, color: '#e8e6f0' }}>{t.saved}</h2><button onClick={() => setShowPrompt(false)} style={{ background: 'none', border: 'none', color: '#8b8ba7', fontSize: 24, cursor: 'pointer' }}>×</button></div>
          <div style={{ background: 'rgba(139,92,246,0.1)', borderRadius: 12, padding: 16, marginBottom: 20, border: '1px solid rgba(139,92,246,0.2)' }}><p style={{ margin: 0, fontSize: 14, color: '#c4b5fd' }}>{t.copyHint}</p></div>
          <div style={{ flex: 1, overflow: 'auto', background: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: 16, marginBottom: 20, maxHeight: 300 }}><pre style={{ margin: 0, fontSize: 13, color: '#a0a0c0', whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.7, fontFamily: 'monospace' }}>{prompt}</pre></div>
          <div style={{ display: 'flex', gap: 12 }}><button onClick={() => copyToClipboard(prompt)} style={{...btnPrimary, flex: 1}}>{t.copy}</button><button onClick={() => { setShowPrompt(false); setActiveTab('trends') }} style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#a0a0c0', cursor: 'pointer' }}>{t.viewTrends}</button></div>
        </div></div>}

        {/* Settings Modal */}
        {showSettings && <div style={modal}><div style={modalBox}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}><h2 style={{ fontSize: 20, color: '#e8e6f0' }}>{t.apiSettings}</h2><button onClick={() => setShowSettings(false)} style={{ background: 'none', border: 'none', color: '#8b8ba7', fontSize: 24, cursor: 'pointer' }}>×</button></div>
          <div style={{ marginBottom: 20 }}><label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: '#a0a0c0' }}>{t.provider}</label><select value={apiConfig.provider} onChange={e => saveApiConfig({...apiConfig, provider: e.target.value, model: API_PROVIDERS[e.target.value].defaultModel})} style={{...inputStyle, cursor: 'pointer'}}>{Object.entries(API_PROVIDERS).map(([k,v]) => <option key={k} value={k}>{v.name}</option>)}</select></div>
          <div style={{ marginBottom: 20 }}><label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: '#a0a0c0' }}>{t.apiKey}</label><input type="password" value={apiConfig.apiKey} onChange={e => saveApiConfig({...apiConfig, apiKey: e.target.value})} placeholder={t.apiKeyPlaceholder} style={inputStyle} /></div>
          <div style={{ marginBottom: 20 }}><label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: '#a0a0c0' }}>{t.model}</label>{apiConfig.provider === 'custom' ? <input type="text" value={apiConfig.model} onChange={e => saveApiConfig({...apiConfig, model: e.target.value})} style={inputStyle} /> : <select value={apiConfig.model || API_PROVIDERS[apiConfig.provider].defaultModel} onChange={e => saveApiConfig({...apiConfig, model: e.target.value})} style={{...inputStyle, cursor: 'pointer'}}>{API_PROVIDERS[apiConfig.provider].models.map(m => <option key={m} value={m}>{m}</option>)}</select>}</div>
          {apiConfig.provider === 'custom' && <div style={{ marginBottom: 20 }}><label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: '#a0a0c0' }}>{t.apiUrl}</label><input type="text" value={apiConfig.customUrl} onChange={e => saveApiConfig({...apiConfig, customUrl: e.target.value})} placeholder="https://..." style={inputStyle} /></div>}
          <div style={{ padding: 16, background: apiConfig.apiKey ? 'rgba(34,197,94,0.1)' : 'rgba(250,204,21,0.1)', borderRadius: 10, border: `1px solid ${apiConfig.apiKey ? 'rgba(34,197,94,0.3)' : 'rgba(250,204,21,0.3)'}` }}><p style={{ margin: 0, fontSize: 13, color: apiConfig.apiKey ? '#4ade80' : '#fcd34d' }}>{apiConfig.apiKey ? `✓ ${t.configured} ${API_PROVIDERS[apiConfig.provider].name}` : t.notConfigured}</p></div>
          <button onClick={() => setShowSettings(false)} style={{...btnPrimary, marginTop: 20}}>{t.done}</button>
        </div></div>}

        {/* Input Tab */}
        {activeTab === 'input' && (
          <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 20, padding: 28, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: '#a0a0c0' }}>{t.date}</label>
              <input type="date" value={entry.date} onChange={e => setEntry({...entry, date: e.target.value})} style={inputStyle} />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', marginBottom: 12, fontSize: 13, color: '#a0a0c0' }}>{t.moodScore}</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: 32 }}>{emojis[entry.moodScore-1]}</span>
                <input type="range" min="1" max="10" value={entry.moodScore} onChange={e => setEntry({...entry, moodScore: +e.target.value})} style={{ flex: 1, height: 8, borderRadius: 4, background: 'linear-gradient(90deg,#ef4444 0%,#facc15 50%,#22c55e 100%)', WebkitAppearance: 'none', cursor: 'pointer' }} />
                <span style={{ fontSize: 24, fontWeight: 600, color: entry.moodScore <= 3 ? '#ef4444' : entry.moodScore <= 6 ? '#facc15' : '#22c55e', minWidth: 40, textAlign: 'center' }}>{entry.moodScore}</span>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: '#a0a0c0' }}>{t.moodDesc}</label>
              <textarea value={entry.moodText} onChange={e => setEntry({...entry, moodText: e.target.value})} placeholder={t.moodPlaceholder} style={{...inputStyle, height: 100, resize: 'vertical', lineHeight: 1.6}} />
            </div>

            <div style={{ marginBottom: 24, padding: 20, background: 'rgba(168,85,247,0.1)', borderRadius: 16, border: '1px solid rgba(168,85,247,0.2)' }}>
              <h3 style={{ fontSize: 14, color: '#c4b5fd', marginBottom: 16 }}>{t.medication}</h3>
              <textarea value={entry.medication} onChange={e => setEntry({...entry, medication: e.target.value})} placeholder={t.medPlaceholder} style={{...inputStyle, height: 80, marginBottom: 12, resize: 'vertical'}} />
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14, color: '#a0a0c0' }}>
                <input type="checkbox" checked={entry.medicationTaken} onChange={e => setEntry({...entry, medicationTaken: e.target.checked})} style={{ width: 18, height: 18, accentColor: '#8b5cf6' }} />
                {t.medTaken}
              </label>
            </div>

            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: 14, color: '#a0a0c0', marginBottom: 16 }}>⌚ {t.watchData}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
                {[
                  {k:'sleep',l:t.sleep,u:t.hours,i:'🌙',min:0,max:15,step:.5},
                  {k:'hrv',l:t.hrv,u:'ms',i:'💓',min:10,max:150,step:1},
                  {k:'steps',l:t.steps,u:t.stepUnit,i:'🚶',min:0,max:30000,step:500},
                  {k:'exercise',l:t.exercise,u:t.minutes,i:'🏃',min:0,max:180,step:5}
                ].map(f => (
                  <div key={f.k} style={{ padding: 14, background: 'rgba(0,0,0,0.25)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#8b8ba7', marginBottom: 8 }}><span>{f.i}</span>{f.l}</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input type="number" value={entry[f.k]} onChange={e => setEntry({...entry, [f.k]: +e.target.value})} min={f.min} max={f.max} step={f.step} style={{ width: 80, padding: '8px 10px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#fff', fontSize: 16, fontWeight: 500 }} />
                      <span style={{ fontSize: 12, color: '#6b6b8a' }}>{f.u}</span>
                    </div>
                  </div>
                ))}
                <div style={{ padding: 14, background: 'rgba(0,0,0,0.25)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', gridColumn: 'span 2' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#8b8ba7', marginBottom: 10 }}><span>😴</span>{t.sleepHR}</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, color: '#6b6b8a' }}>{t.min}</span>
                      <input type="number" value={entry.sleepHRMin} onChange={e => setEntry({...entry, sleepHRMin: +e.target.value})} min={30} max={100} style={{ width: 70, padding: '8px 10px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#fff', fontSize: 16, fontWeight: 500 }} />
                    </div>
                    <span style={{ color: '#6b6b8a' }}>—</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, color: '#6b6b8a' }}>{t.max}</span>
                      <input type="number" value={entry.sleepHRMax} onChange={e => setEntry({...entry, sleepHRMax: +e.target.value})} min={30} max={120} style={{ width: 70, padding: '8px 10px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#fff', fontSize: 16, fontWeight: 500 }} />
                    </div>
                    <span style={{ fontSize: 12, color: '#6b6b8a' }}>bpm</span>
                  </div>
                </div>
              </div>
            </div>

            <button onClick={handleSubmit} disabled={isAnalyzing} style={{...btnPrimary, opacity: isAnalyzing ? 0.7 : 1}}>
              {isAnalyzing ? (apiConfig.apiKey ? t.analyzing : t.saving) : (apiConfig.apiKey ? t.submit : t.submitNoApi)}
            </button>
            {!apiConfig.apiKey && <p style={{ textAlign: 'center', fontSize: 12, color: '#6b6b8a', marginTop: 12 }}>{t.noApiHint}</p>}
          </div>
        )}

        {/* Analysis Tab */}
        {activeTab === 'analysis' && (
          <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 20, padding: 28, border: '1px solid rgba(255,255,255,0.06)' }}>
            {analysis ? <>
              <div style={{ background: statusStyle(analysis.statusColor).bg, border: `1px solid ${statusStyle(analysis.statusColor).border}`, borderRadius: 16, padding: 20, marginBottom: 24, textAlign: 'center' }}>
                <div style={{ fontSize: 14, color: statusStyle(analysis.statusColor).text, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t.status}</div>
                <div style={{ fontSize: 24, fontWeight: 500, color: statusStyle(analysis.statusColor).text }}>{analysis.status}</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: 20, marginBottom: 20 }}><h3 style={{ fontSize: 14, color: '#a0a0c0', marginBottom: 12 }}>{t.summary}</h3><p style={{ fontSize: 15, lineHeight: 1.7, color: '#d0d0e8' }}>{analysis.summary}</p></div>
              <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: 20, marginBottom: 20 }}><h3 style={{ fontSize: 14, color: '#a0a0c0', marginBottom: 12 }}>{t.analysis}</h3><p style={{ fontSize: 14, lineHeight: 1.8, color: '#b0b0d0', whiteSpace: 'pre-wrap' }}>{analysis.analysis}</p></div>
              {analysis.warnings?.length > 0 && <div style={{ background: 'rgba(239,68,68,0.1)', borderRadius: 12, padding: 20, marginBottom: 20, border: '1px solid rgba(239,68,68,0.2)' }}><h3 style={{ fontSize: 14, color: '#f87171', marginBottom: 12 }}>{t.warnings}</h3><ul style={{ margin: 0, paddingLeft: 20 }}>{analysis.warnings.map((w,i) => <li key={i} style={{ fontSize: 14, color: '#fca5a5', marginBottom: 8, lineHeight: 1.6 }}>{w}</li>)}</ul></div>}
              {analysis.suggestions?.length > 0 && <div style={{ background: 'rgba(34,197,94,0.1)', borderRadius: 12, padding: 20, border: '1px solid rgba(34,197,94,0.2)' }}><h3 style={{ fontSize: 14, color: '#4ade80', marginBottom: 12 }}>{t.suggestions}</h3><ul style={{ margin: 0, paddingLeft: 20 }}>{analysis.suggestions.map((s,i) => <li key={i} style={{ fontSize: 14, color: '#86efac', marginBottom: 8, lineHeight: 1.6 }}>{s}</li>)}</ul></div>}
            </> : (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: 48, marginBottom: 20 }}>🔮</div>
                <h3 style={{ fontSize: 18, color: '#d0d0e8', marginBottom: 12 }}>{apiConfig.apiKey ? t.waiting : t.twoMethods}</h3>
                {!apiConfig.apiKey && <div style={{ textAlign: 'left', maxWidth: 400, margin: '0 auto' }}>
                  <div style={{ background: 'rgba(139,92,246,0.1)', borderRadius: 12, padding: 20, marginBottom: 16, border: '1px solid rgba(139,92,246,0.2)' }}><h4 style={{ fontSize: 14, color: '#c4b5fd', marginBottom: 8 }}>{t.method1}</h4><p style={{ fontSize: 13, color: '#a0a0c0', margin: 0 }}>{t.method1Desc}</p></div>
                  <div style={{ background: 'rgba(59,130,246,0.1)', borderRadius: 12, padding: 20, border: '1px solid rgba(59,130,246,0.2)' }}><h4 style={{ fontSize: 14, color: '#93c5fd', marginBottom: 8 }}>{t.method2}</h4><p style={{ fontSize: 13, color: '#a0a0c0', margin: 0 }}>{t.method2Desc}</p><button onClick={() => setShowSettings(true)} style={{ marginTop: 12, padding: '10px 16px', background: 'rgba(59,130,246,0.3)', border: '1px solid rgba(59,130,246,0.4)', borderRadius: 8, color: '#93c5fd', fontSize: 13, cursor: 'pointer' }}>{t.configApi}</button></div>
                </div>}
              </div>
            )}
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === 'trends' && (
          <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 20, padding: 28, border: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 style={{ fontSize: 16, marginBottom: 24, color: '#d0d0e8' }}>{t.trendsTitle}</h3>
            {entries.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b6b8a' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
                <p>{t.noData}</p>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 32 }}>
                  <h4 style={{ fontSize: 13, color: '#8b8ba7', marginBottom: 16 }}>{t.moodTrend}</h4>
                  <div style={{ height: 200 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={entries.slice(-14)}>
                        <defs><linearGradient id="mg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/></linearGradient></defs>
                        <XAxis dataKey="date" tick={{ fill: '#6b6b8a', fontSize: 11 }} tickFormatter={d => d.slice(5)} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
                        <YAxis domain={[1, 10]} tick={{ fill: '#6b6b8a', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
                        <Tooltip contentStyle={{ background: 'rgba(15,15,35,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#e8e6f0' }} />
                        <Area type="monotone" dataKey="moodScore" stroke="#8b5cf6" strokeWidth={2} fill="url(#mg)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div style={{ marginBottom: 32 }}>
                  <h4 style={{ fontSize: 13, color: '#8b8ba7', marginBottom: 16 }}>{t.sleepHrv}</h4>
                  <div style={{ height: 200 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={entries.slice(-14)}>
                        <XAxis dataKey="date" tick={{ fill: '#6b6b8a', fontSize: 11 }} tickFormatter={d => d.slice(5)} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
                        <YAxis yAxisId="left" tick={{ fill: '#6b6b8a', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
                        <YAxis yAxisId="right" orientation="right" tick={{ fill: '#6b6b8a', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
                        <Tooltip contentStyle={{ background: 'rgba(15,15,35,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#e8e6f0' }} />
                        <Bar yAxisId="left" dataKey="sleep" fill="rgba(96,165,250,0.6)" radius={[4,4,0,0]} name={`${t.sleep}(h)`} />
                        <Line yAxisId="right" type="monotone" dataKey="hrv" stroke="#f472b6" strokeWidth={2} dot={{ fill: '#f472b6', r: 3 }} name="HRV(ms)" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div style={{ marginTop: 32 }}>
                  <button onClick={() => setShowHistory(!showHistory)} style={{ width: '100%', padding: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#a0a0c0', fontSize: 14, cursor: 'pointer' }}>
                    {showHistory ? t.hide : t.show} {t.history} ({entries.length} {t.records})
                  </button>
                  {showHistory && (
                    <div style={{ marginTop: 16, maxHeight: 300, overflowY: 'auto', background: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: 12 }}>
                      {entries.slice().reverse().map((e, i) => (
                        <div key={e.id} style={{ padding: 12, borderBottom: i < entries.length-1 ? '1px solid rgba(255,255,255,0.05)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: '#8b8ba7', fontSize: 13 }}>{e.date}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span>{emojis[e.moodScore-1]}</span>
                            <span style={{ color: '#6b6b8a', fontSize: 12 }}>😴{e.sleep?.toFixed(1)}h | 💓{e.hrv?.toFixed(0)} {e.medication ? '| 💊' : ''}</span>
                            <button onClick={() => deleteEntry(e.id)} style={{ background: 'none', border: 'none', color: '#6b6b8a', fontSize: 14, cursor: 'pointer', padding: 4, opacity: .6 }} title={t.delete}>🗑️</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        <footer style={{ textAlign: 'center', marginTop: 32, padding: 20, color: '#5a5a7a', fontSize: 12, lineHeight: 1.6 }}>
          <p>{t.disclaimer}</p>
          <p>{t.disclaimer2}</p>
        </footer>
      </div>
    </div>
  )
}
