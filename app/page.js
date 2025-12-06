'use client'
import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, ComposedChart, Bar } from 'recharts'

const i18n = {
  zh: {
    title: '我们不判断，只陪你一起看见自己的情绪波动', subtitle: '',
    login: '登录', register: '注册', logout: '退出登录', email: '邮箱', password: '密码',
    loginBtn: '登录', registerBtn: '注册', switchToRegister: '没有账号？注册', switchToLogin: '已有账号？登录',
    tabs: { input: '📝 记录', analysis: '🔍 分析', trends: '📊 趋势' },
    date: '日期', moodScore: '今日情绪评分', moodDesc: '描述你的感受',
    moodPlaceholder: '今天感觉如何？有什么特别的想法或经历？',
    watchData: 'Apple Watch 数据', 
    sleep: '睡眠时长', sleepHours: '小时', sleepMins: '分钟',
    hrv: 'HRV', hrvHint: '心率变异性，反映自主神经调节能力，数值越高通常表示恢复状态越好',
    steps: '步数', stepUnit: '步', exercise: '运动时长', minutes: '分钟',
    sleepHR: '睡眠心率范围', min: '最低', max: '最高',
    medication: '💊 用药记录', medPlaceholder: '记录今天的用药情况，如：碳酸锂 300mg 早晚各一次',
    medTaken: '已按时服药', submit: '提交并分析', submitNoApi: '📋 记录并生成对话提示',
    noApiHint: '未配置 API，提交后将生成对话提示', saving: '保存中...', analyzing: 'AI 正在分析...',
    saved: '✨ 记录已保存', copyHint: '💬 复制下面的内容，发送给你信赖的大模型进行对话分析',
    copy: '📋 复制到剪贴板', copied: '已复制！', viewTrends: '查看趋势',
    status: '当前状态', summary: '📋 摘要', analysis: '🔍 详细分析',
    warnings: '⚠️ 注意事项', suggestions: '💡 建议',
    waiting: '等待分析', twoMethods: '两种分析方式',
    method1: '💬 方式一：与你所信赖的大模型对话', method1Desc: '提交记录后，复制生成的提示词进行对话分析',
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
    configured: '已配置', notConfigured: '⚠️ 未配置 API Key 时，可复制提示词与大模型对话',
    done: '完成', configApi: '⚙️ 配置 API'
  },
  en: {
    title: 'We don\'t judge. We just help you see your emotional waves.', subtitle: '',
    login: 'Login', register: 'Register', logout: 'Logout', email: 'Email', password: 'Password',
    loginBtn: 'Login', registerBtn: 'Register', switchToRegister: 'No account? Register', switchToLogin: 'Have account? Login',
    tabs: { input: '📝 Record', analysis: '🔍 Analysis', trends: '📊 Trends' },
    date: 'Date', moodScore: 'Today\'s Mood Score', moodDesc: 'Describe your feelings',
    moodPlaceholder: 'How are you feeling today? Any special thoughts or experiences?',
    watchData: 'Apple Watch Data', 
    sleep: 'Sleep', sleepHours: 'h', sleepMins: 'm',
    hrv: 'HRV', hrvHint: 'Heart Rate Variability - reflects autonomic nervous system regulation. Higher values generally indicate better recovery.',
    steps: 'Steps', stepUnit: 'steps', exercise: 'Exercise', minutes: 'min',
    sleepHR: 'Sleep Heart Rate Range', min: 'Min', max: 'Max',
    medication: '💊 Medication Log', medPlaceholder: 'Record today\'s medication, e.g.: Lithium 300mg twice daily',
    medTaken: 'Medication taken as scheduled', submit: 'Submit & Analyze', submitNoApi: '📋 Record & Generate Prompt',
    noApiHint: 'No API configured. A prompt will be generated.', saving: 'Saving...', analyzing: 'AI analyzing...',
    saved: '✨ Record Saved', copyHint: '💬 Copy and send to your trusted AI for analysis',
    copy: '📋 Copy to Clipboard', copied: 'Copied!', viewTrends: 'View Trends',
    status: 'Current Status', summary: '📋 Summary', analysis: '🔍 Detailed Analysis',
    warnings: '⚠️ Warnings', suggestions: '💡 Suggestions',
    waiting: 'Waiting for analysis', twoMethods: 'Two Analysis Methods',
    method1: '💬 Method 1: Chat with your trusted AI', method1Desc: 'Copy the generated prompt for conversation analysis',
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
    configured: 'Configured', notConfigured: '⚠️ Without API Key, you can copy prompts to chat with AI',
    done: 'Done', configApi: '⚙️ Configure API'
  }
}

const API_PROVIDERS = {
  openai: { name: 'OpenAI', baseUrl: 'https://api.openai.com/v1/chat/completions', defaultModel: 'gpt-4o', models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'], formatRequest: (msgs, model) => ({ model, messages: msgs, max_tokens: 1500 }), parseResponse: d => d.choices[0].message.content },
  anthropic: { name: 'Anthropic Claude', baseUrl: 'https://api.anthropic.com/v1/messages', defaultModel: 'claude-sonnet-4-20250514', models: ['claude-sonnet-4-20250514', 'claude-3-5-sonnet-20241022'], formatRequest: (msgs, model) => ({ model, max_tokens: 1500, system: msgs.find(m => m.role === 'system')?.content || '', messages: msgs.filter(m => m.role !== 'system') }), parseResponse: d => d.content[0].text, extraHeaders: { 'anthropic-version': '2023-06-01' } },
  deepseek: { name: 'DeepSeek', baseUrl: 'https://api.deepseek.com/chat/completions', defaultModel: 'deepseek-chat', models: ['deepseek-chat', 'deepseek-coder'], formatRequest: (msgs, model) => ({ model, messages: msgs, max_tokens: 1500 }), parseResponse: d => d.choices[0].message.content },
  moonshot: { name: 'Moonshot (月之暗面)', baseUrl: 'https://api.moonshot.cn/v1/chat/completions', defaultModel: 'moonshot-v1-8k', models: ['moonshot-v1-8k', 'moonshot-v1-32k'], formatRequest: (msgs, model) => ({ model, messages: msgs, max_tokens: 1500 }), parseResponse: d => d.choices[0].message.content },
  zhipu: { name: '智谱 GLM', baseUrl: 'https://open.bigmodel.cn/api/paas/v4/chat/completions', defaultModel: 'glm-4', models: ['glm-4', 'glm-4-flash'], formatRequest: (msgs, model) => ({ model, messages: msgs, max_tokens: 1500 }), parseResponse: d => d.choices[0].message.content },
  custom: { name: 'Custom API', baseUrl: '', defaultModel: '', models: [], formatRequest: (msgs, model) => ({ model, messages: msgs, max_tokens: 1500 }), parseResponse: d => d.choices?.[0]?.message?.content || d.content?.[0]?.text || '' }
}

// ============ 系统级 Prompt ============
const SYSTEM_PROMPT = `You are a mood tracking analysis assistant. Your approach is:

1. NON-PATHOLOGIZING: Use "energy level" instead of "depression", use "elevated state" instead of "mania". Focus on energy and stability, not diagnostic labels.

2. DATA-DRIVEN: Base all observations on the actual data provided. Compare against user's own baseline when history is available.

3. CROSS-VALIDATION: Check if language sentiment matches physiological signals (e.g., "tired" + low HRV = consistent).

4. ACTIONABLE: Provide micro-interventions that are specific, achievable, and empathetic.

Output strict JSON only.`

const analyzeWithAI = async (entry, history, config, lang) => {
  const isZh = lang === 'zh'
  
  // 计算历史基线
  const recentHistory = history.slice(-30)
  const avgMood = recentHistory.length > 0 ? (recentHistory.reduce((a, h) => a + h.moodScore, 0) / recentHistory.length).toFixed(1) : null
  const avgSleep = recentHistory.length > 0 ? (recentHistory.reduce((a, h) => a + h.sleep, 0) / recentHistory.length).toFixed(1) : null
  const last7 = history.slice(-7)
  
  // 睡眠时间格式化
  const fmtSleep = (hours) => {
    const h = Math.floor(hours)
    const m = Math.round((hours - h) * 60)
    return isZh ? `${h}小时${m > 0 ? m + '分钟' : ''}` : `${h}h${m > 0 ? m + 'm' : ''}`
  }
  
  const prompt = isZh ? `请分析以下情绪记录，使用去病理化的语言框架。

【今日数据】
- 日期：${entry.date}
- 用户文本："${entry.moodText || '（无）'}"
- 情绪评分：${entry.moodScore}/10
- 睡眠：${fmtSleep(entry.sleep)} | HRV：${entry.hrv}ms（心率变异性，反映自主神经调节能力，数值越高通常表示恢复状态越好）| 睡眠心率：${entry.sleepHRMin}-${entry.sleepHRMax}bpm
- 步数：${entry.steps} | 运动：${entry.exercise}分钟
- 用药：${entry.medication || '未记录'} | 按时服药：${entry.medicationTaken ? '是' : '否'}

【历史基线（过去30天）】
- 平均情绪：${avgMood || '无数据'}
- 平均睡眠：${avgSleep ? fmtSleep(parseFloat(avgSleep)) : '无数据'}
- 数据点数：${recentHistory.length}

【近7天趋势】
${last7.map(h => `${h.date}: 情绪=${h.moodScore}, 睡眠=${fmtSleep(h.sleep)}`).join('\n') || '无历史数据'}

【分析框架】

1. 状态评估（去病理化）
   - energy_level: "high" / "moderate" / "low"（不用"躁狂"/"抑郁"）
   - stability_score: 0-1（基于近7天波动计算）
   - alert_level: "green" / "yellow" / "orange" / "red"
   - primary_signal: 主要信号类型（acute_decline / gradual_decline / elevated_state / mixed / stable）

2. 语言特征分析
   - sentiment.valence: -1到1
   - sentiment.trajectory: 与历史基线比较的趋势
   - coherence.score: 0-1（思维连贯性）
   - coherence.anomaly_detected: 是否检测到思维跳跃
   - verbosity.status: "normal" / "poverty_of_speech" / "pressured_speech"
   - risk_topics_detected: 检测到的高危话题（somatic_concerns/sleep_issues/social_conflict/hopelessness）

3. 多模态交叉验证
   - consistency: 语言描述与生理数据是否一致
   - physiological_context.sleep_status: "adequate" / "acute_deficit" / "chronic_deficit"
   - physiological_context.hrv_status: "normal" / "suppressed" / "elevated"

4. 用户端内容（这是最重要的部分，要写得详细且有共情）
   - daily_insight: 2-3句话的今日洞察，用温和、非评判的语言
   - micro_interventions: 2-3个具体可行的小建议，每个包含type和content

5. 系统标记
   - requires_attention: 是否需要关注
   - check_safety: 是否检测到安全相关表达
   - baseline_update: 是否将今日数据计入基线

【输出JSON格式】
{
  "current_state": {
    "energy_level": "low/moderate/high",
    "stability_score": 0.0-1.0,
    "alert_level": "green/yellow/orange/red",
    "primary_signal": "信号类型"
  },
  "linguistic_markers": {
    "sentiment": {"valence": -1到1, "trajectory": "improving/stable/declining"},
    "coherence": {"score": 0-1, "anomaly_detected": true/false},
    "verbosity": {"status": "normal/poverty_of_speech/pressured_speech"},
    "risk_topics_detected": {"somatic_concerns": bool, "sleep_issues": bool, "social_conflict": bool, "hopelessness": bool}
  },
  "cross_validation": {
    "consistency": true/false,
    "physiological_context": {
      "sleep_status": "adequate/acute_deficit/chronic_deficit",
      "hrv_status": "normal/suppressed/elevated"
    }
  },
  "user_facing": {
    "daily_insight": "今日洞察（温和、有共情、2-3句话）",
    "micro_interventions": [
      {"type": "stabilization/self_care/connection/movement", "content": "具体建议"}
    ]
  },
  "system_flags": {
    "requires_attention": false,
    "check_safety": false,
    "baseline_update": true
  }
}

请确保 daily_insight 内容温和有共情，micro_interventions 给出2-3个具体可执行的建议。
只输出JSON。` 
  
  : `Please analyze the following mood record using a non-pathologizing language framework.

【Today's Data】
- Date: ${entry.date}
- User Text: "${entry.moodText || '(none)'}"
- Mood Score: ${entry.moodScore}/10
- Sleep: ${fmtSleep(entry.sleep)} | HRV: ${entry.hrv}ms (Heart Rate Variability - reflects autonomic nervous system regulation, higher values generally indicate better recovery) | Sleep HR: ${entry.sleepHRMin}-${entry.sleepHRMax}bpm
- Steps: ${entry.steps} | Exercise: ${entry.exercise}min
- Medication: ${entry.medication || 'Not recorded'} | Taken: ${entry.medicationTaken ? 'Yes' : 'No'}

【Historical Baseline (past 30 days)】
- Average Mood: ${avgMood || 'No data'}
- Average Sleep: ${avgSleep ? fmtSleep(parseFloat(avgSleep)) : 'No data'}
- Data Points: ${recentHistory.length}

【Last 7 Days Trend】
${last7.map(h => `${h.date}: mood=${h.moodScore}, sleep=${fmtSleep(h.sleep)}`).join('\n') || 'No historical data'}

【Analysis Framework】

1. State Assessment (Non-pathologizing)
   - energy_level: "high" / "moderate" / "low" (NOT "manic"/"depressed")
   - stability_score: 0-1 (based on 7-day fluctuation)
   - alert_level: "green" / "yellow" / "orange" / "red"
   - primary_signal: signal type (acute_decline / gradual_decline / elevated_state / mixed / stable)

2. Linguistic Markers
   - sentiment.valence: -1 to 1
   - sentiment.trajectory: trend compared to baseline
   - coherence.score: 0-1
   - coherence.anomaly_detected: thought jumping detected?
   - verbosity.status: "normal" / "poverty_of_speech" / "pressured_speech"
   - risk_topics_detected: somatic_concerns/sleep_issues/social_conflict/hopelessness

3. Cross-Validation
   - consistency: does language match physiological data?
   - physiological_context.sleep_status: "adequate" / "acute_deficit" / "chronic_deficit"
   - physiological_context.hrv_status: "normal" / "suppressed" / "elevated"

4. User-Facing Content (most important - be detailed and empathetic)
   - daily_insight: 2-3 sentences, warm and non-judgmental
   - micro_interventions: 2-3 specific, actionable suggestions with type and content

5. System Flags
   - requires_attention: needs attention?
   - check_safety: safety-related expressions detected?
   - baseline_update: include today in baseline?

【Output JSON Format】
{
  "current_state": {
    "energy_level": "low/moderate/high",
    "stability_score": 0.0-1.0,
    "alert_level": "green/yellow/orange/red",
    "primary_signal": "signal type"
  },
  "linguistic_markers": {
    "sentiment": {"valence": -1 to 1, "trajectory": "improving/stable/declining"},
    "coherence": {"score": 0-1, "anomaly_detected": true/false},
    "verbosity": {"status": "normal/poverty_of_speech/pressured_speech"},
    "risk_topics_detected": {"somatic_concerns": bool, "sleep_issues": bool, "social_conflict": bool, "hopelessness": bool}
  },
  "cross_validation": {
    "consistency": true/false,
    "physiological_context": {
      "sleep_status": "adequate/acute_deficit/chronic_deficit",
      "hrv_status": "normal/suppressed/elevated"
    }
  },
  "user_facing": {
    "daily_insight": "Today's insight (warm, empathetic, 2-3 sentences)",
    "micro_interventions": [
      {"type": "stabilization/self_care/connection/movement", "content": "specific suggestion"}
    ]
  },
  "system_flags": {
    "requires_attention": false,
    "check_safety": false,
    "baseline_update": true
  }
}

Ensure daily_insight is warm and empathetic, micro_interventions should have 2-3 specific actionable suggestions.
Output JSON only.`

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: prompt }
  ]

  const provider = API_PROVIDERS[config.provider]
  const model = config.model || provider.defaultModel
  
  try {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: config.provider,
        apiKey: config.apiKey,
        model: model,
        customUrl: config.customUrl,
        messages: messages
      })
    })
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    const data = await res.json()
    if (data.error) throw new Error(data.error)
    let text = data.content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const parsed = JSON.parse(text)
    
    // 转换新结构到兼容 UI 的格式
    const energyLabels = {
      zh: { high: '高能量状态', moderate: '能量适中', low: '低能量状态' },
      en: { high: 'High energy state', moderate: 'Moderate energy', low: 'Low energy state' }
    }
    
    const signalLabels = {
      zh: { 
        acute_decline: '急性下降', 
        gradual_decline: '逐渐走低', 
        elevated_state: '能量偏高', 
        mixed: '混合状态', 
        stable: '稳定' 
      },
      en: { 
        acute_decline: 'Acute decline', 
        gradual_decline: 'Gradual decline', 
        elevated_state: 'Elevated state', 
        mixed: 'Mixed state', 
        stable: 'Stable' 
      }
    }
    
    const energy = parsed.current_state?.energy_level || 'moderate'
    const signal = parsed.current_state?.primary_signal || 'stable'
    const alertLevel = parsed.current_state?.alert_level || 'green'
    
    // 构建状态文本
    const statusText = `${energyLabels[lang][energy]} · ${signalLabels[lang][signal]}`
    
    // 构建详细分析文本
    const buildAnalysisText = (p, lang) => {
      const isZh = lang === 'zh'
      let text = ''
      
      // 语言特征
      if (p.linguistic_markers) {
        const lm = p.linguistic_markers
        const valence = lm.sentiment?.valence
        const trajectory = lm.sentiment?.trajectory
        const coherence = lm.coherence?.score
        const verbosity = lm.verbosity?.status
        
        if (isZh) {
          text += `【语言特征】情感倾向 ${valence > 0 ? '偏积极' : valence < 0 ? '偏消极' : '中性'}（${valence?.toFixed(2) || 'N/A'}），`
          text += `趋势${trajectory === 'improving' ? '改善中' : trajectory === 'declining' ? '下降中' : '稳定'}。`
          text += `思维连贯性 ${(coherence * 100)?.toFixed(0) || 'N/A'}%。`
          if (verbosity === 'poverty_of_speech') text += '表达较为简短。'
          if (verbosity === 'pressured_speech') text += '表达较为急促。'
        } else {
          text += `[Linguistic] Sentiment ${valence > 0 ? 'positive' : valence < 0 ? 'negative' : 'neutral'} (${valence?.toFixed(2) || 'N/A'}), `
          text += `trajectory ${trajectory || 'stable'}. `
          text += `Coherence ${(coherence * 100)?.toFixed(0) || 'N/A'}%. `
          if (verbosity === 'poverty_of_speech') text += 'Speech appears limited. '
          if (verbosity === 'pressured_speech') text += 'Speech appears pressured. '
        }
        
        // 高危话题
        const risks = lm.risk_topics_detected || {}
        const detectedRisks = Object.entries(risks).filter(([k, v]) => v).map(([k]) => k)
        if (detectedRisks.length > 0) {
          text += isZh ? `\n检测到关注点：${detectedRisks.join('、')}。` : `\nTopics detected: ${detectedRisks.join(', ')}. `
        }
      }
      
      // 交叉验证
      if (p.cross_validation) {
        const cv = p.cross_validation
        text += '\n'
        if (isZh) {
          text += `【身心一致性】${cv.consistency ? '语言描述与生理数据一致' : '语言与生理数据存在差异'}。`
          text += `睡眠状态：${cv.physiological_context?.sleep_status === 'adequate' ? '充足' : cv.physiological_context?.sleep_status === 'chronic_deficit' ? '长期不足' : '短期不足'}，`
          text += `自主神经：${cv.physiological_context?.hrv_status === 'normal' ? '正常' : cv.physiological_context?.hrv_status === 'suppressed' ? '受抑' : '偏高'}。`
        } else {
          text += `[Cross-validation] ${cv.consistency ? 'Language matches physiology' : 'Discrepancy between language and physiology'}. `
          text += `Sleep: ${cv.physiological_context?.sleep_status || 'N/A'}, HRV: ${cv.physiological_context?.hrv_status || 'N/A'}. `
        }
      }
      
      return text
    }
    
    // 构建建议列表
    const suggestions = parsed.user_facing?.micro_interventions?.map(i => i.content) || []
    
    // 构建警告列表
    const warnings = []
    if (parsed.system_flags?.check_safety) {
      warnings.push(isZh 
        ? '你的感受值得被认真对待。如果你正在经历持续的痛苦，请考虑联系你信任的人或专业人士。'
        : 'Your feelings deserve to be taken seriously. If you are experiencing persistent pain, please consider reaching out to someone you trust or a professional.')
    }
    if (parsed.system_flags?.requires_attention) {
      warnings.push(isZh ? '今日数据需要关注' : 'Today\'s data requires attention')
    }
    
    return {
      status: statusText,
      statusColor: alertLevel,
      summary: parsed.user_facing?.daily_insight || '',
      analysis: buildAnalysisText(parsed, lang),
      warnings: warnings,
      suggestions: suggestions,
      trendDirection: parsed.current_state?.primary_signal?.includes('decline') ? 'down' : 
                      parsed.current_state?.primary_signal === 'elevated_state' ? 'up' : 'stable',
      // 保留原始数据供高级用户查看
      rawData: parsed
    }
  } catch (e) {
    return { status: isZh ? '分析完成' : 'Analysis complete', statusColor: 'gray', summary: e.message, analysis: '', warnings: [], suggestions: [], trendDirection: 'stable' }
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
    moodText: '', moodScore: 5, sleepHours: 7, sleepMins: 0, hrv: 50,
    sleepHRMin: 48, sleepHRMax: 58, steps: 5000, exercise: 30,
    medication: '', medicationTaken: false
  })
  const [activeTab, setActiveTab] = useState('input')
  const [showHistory, setShowHistory] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [apiConfig, setApiConfig] = useState({ provider: 'openai', apiKey: '', model: '', customUrl: '' })
  const [showSettings, setShowSettings] = useState(false)

  const t = i18n[lang]
  const emojis = ['😢','😔','😕','😐','🙂','😊','😄','😁','🤩','🌟']

  useEffect(() => {
    const savedLang = localStorage.getItem('mood_lang')
    if (savedLang) setLang(savedLang)
    const savedApi = localStorage.getItem('mood_api_config')
    if (savedApi) setApiConfig(JSON.parse(savedApi))
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
      if (session?.user) loadEntries(session.user.id)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) loadEntries(session.user.id)
    })
  }, [])

  const loadEntries = async (userId) => {
    const { data, error } = await supabase.from('mood_entries')
      .select('*').eq('user_id', userId)
      .order('date', { ascending: true })
    if (!error && data) {
      setEntries(data.map(e => ({
        id: e.id, date: e.date, moodScore: e.mood_score, moodText: e.mood_text,
        sleep: e.sleep, hrv: e.hrv, sleepHRMin: e.sleep_hr_min, sleepHRMax: e.sleep_hr_max,
        steps: e.steps, exercise: e.exercise, medication: e.medication, medicationTaken: e.medication_taken
      })))
    }
  }

  // 睡眠时间转换辅助函数
  const getSleepTotal = () => (entry.sleepHours || 0) + (entry.sleepMins || 0) / 60
  const formatSleep = (hours) => {
    const h = Math.floor(hours)
    const m = Math.round((hours - h) * 60)
    return lang === 'zh' ? `${h}小时${m > 0 ? m + '分钟' : ''}` : `${h}h${m > 0 ? m + 'm' : ''}`
  }
  const formatSleepShort = (hours) => {
    const h = Math.floor(hours)
    const m = Math.round((hours - h) * 60)
    return `${h}:${m.toString().padStart(2, '0')}`
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

【生理数据】睡眠${formatSleep(e.sleep)} | HRV ${e.hrv}ms（心率变异性，反映自主神经调节能力）| 睡眠心率${e.sleepHRMin}-${e.sleepHRMax}bpm | 步数${e.steps} | 运动${e.exercise}分钟

【用药】${e.medication || '未记录'} | 按时服药：${e.medicationTaken ? '是' : '否'}

${h.length ? `【历史】\n${h.slice(-7).map(x => `${x.date}: 情绪${x.moodScore}, 睡眠${formatSleep(x.sleep)}, 用药${x.medication || '未记录'}`).join('\n')}` : '（首条记录）'}

请分析情绪状态、生理关联、用药依从性、趋势变化、预警信号和建议。谢谢！` 

: `Hi, I'm tracking my bipolar disorder. Please analyze:

【Today】${e.date}
- Mood: ${e.moodScore}/10
- Feeling: ${e.moodText}

【Data】Sleep ${formatSleep(e.sleep)} | HRV ${e.hrv}ms (Heart Rate Variability, reflects autonomic nervous system regulation) | Sleep HR ${e.sleepHRMin}-${e.sleepHRMax}bpm | Steps ${e.steps} | Exercise ${e.exercise}min

【Medication】${e.medication || 'Not recorded'} | Taken: ${e.medicationTaken ? 'Yes' : 'No'}

${h.length ? `【History】\n${h.slice(-7).map(x => `${x.date}: mood${x.moodScore}, sleep${formatSleep(x.sleep)}, med${x.medication || 'N/A'}`).join('\n')}` : '(First record)'}

Please analyze mood state, physiological correlations, medication adherence, trends, warnings, and suggestions. Thanks!`

  const handleSubmit = async () => {
    if (!entry.moodText.trim()) { alert(t.enterMood); return }
    setIsAnalyzing(true)
    
    const sleepTotal = getSleepTotal()
    
    // 保存到数据库
    const { error } = await supabase.from('mood_entries').insert({
      user_id: user.id, date: entry.date, mood_score: entry.moodScore,
      mood_text: entry.moodText, sleep: sleepTotal, hrv: entry.hrv,
      sleep_hr_min: entry.sleepHRMin, sleep_hr_max: entry.sleepHRMax,
      steps: entry.steps, exercise: entry.exercise,
      medication: entry.medication, medication_taken: entry.medicationTaken
    })
    
    if (!error) {
      await loadEntries(user.id)
      
      // 构建带有计算后睡眠时间的 entry 用于分析
      const entryForAnalysis = { ...entry, sleep: sleepTotal }
      
      if (apiConfig.apiKey) {
        const result = await analyzeWithAI(entryForAnalysis, entries, apiConfig, lang)
        setAnalysis(result)
        setActiveTab('analysis')
      } else {
        setGeneratedPrompt(genPrompt(entryForAnalysis, entries))
        setShowPrompt(true)
      }
      
      setEntry(prev => ({ ...prev, moodText: '', medication: '', medicationTaken: false }))
    }
    setIsAnalyzing(false)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const deleteEntry = async (id) => {
    if (!confirm(t.confirmDelete)) return
    await supabase.from('mood_entries').delete().eq('id', id)
    await loadEntries(user.id)
  }

  // 样式常量
  const statusStyle = c => ({
    green: { bg: '#dcfce7', border: '#86efac', text: '#15803d' },
    yellow: { bg: '#fef9c3', border: '#fde047', text: '#a16207' },
    blue: { bg: '#dbeafe', border: '#93c5fd', text: '#1d4ed8' },
    purple: { bg: '#f3e8ff', border: '#d8b4fe', text: '#7c3aed' },
    gray: { bg: '#f3f4f6', border: '#d1d5db', text: '#4b5563' }
  }[c] || { bg: '#f3f4f6', border: '#d1d5db', text: '#4b5563' })
  
  const inputStyle = { width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: 16, color: '#475569', fontSize: 15, outline: 'none', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }
  const btnPrimary = { width: '100%', padding: '16px 24px', background: 'linear-gradient(135deg,#a78bfa 0%,#f472b6 100%)', border: 'none', borderRadius: 16, color: '#fff', fontSize: 16, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(167,139,250,0.3)' }
  const cardStyle = { background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(10px)', borderRadius: 24, padding: 28, border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }
  const modal = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 20 }
  const modalBox = { background: 'rgba(255,255,255,0.9)', borderRadius: 24, padding: 28, width: '100%', maxWidth: 500, maxHeight: '80vh', overflow: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', color: '#334155' }

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
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
              <button onClick={toggleLang} style={{ padding: '6px 12px', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 8, color: '#7c3aed', fontSize: 12, cursor: 'pointer' }}>
                {lang === 'zh' ? 'EN' : '中文'}
              </button>
            </div>
            <h1 style={{ fontSize: 20, fontWeight: 300, marginBottom: 8, lineHeight: 1.8, fontFamily: '"ZCOOL XiaoWei", "Ma Shan Zheng", "ZCOOL QingKe HuangYou", "Noto Serif SC", serif', background: 'linear-gradient(135deg,#8b5cf6 0%,#ec4899 50%,#f472b6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '0.05em' }}>{t.title}</h1>
          </div>
          
          <div style={cardStyle}>
            <h2 style={{ fontSize: 20, marginBottom: 24, textAlign: 'center', color: '#334155' }}>{authMode === 'login' ? t.login : t.register}</h2>
            <form onSubmit={handleAuth}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: '#64748b' }}>{t.email}</label>
                <input type="email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} required style={inputStyle} />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: '#64748b' }}>{t.password}</label>
                <input type="password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} required minLength={6} style={inputStyle} />
              </div>
              {authError && <p style={{ color: authError.includes('成功') || authError.includes('Registered') ? '#16a34a' : '#dc2626', fontSize: 14, marginBottom: 16, textAlign: 'center' }}>{authError}</p>}
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
      <div style={{ position: 'absolute', top: '-20%', right: '-20%', width: '60%', height: '60%', background: 'radial-gradient(circle,rgba(236,72,153,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-20%', left: '-20%', width: '60%', height: '60%', background: 'radial-gradient(circle,rgba(139,92,246,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        
        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: 12, color: '#64748b' }}>{user.email}</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={toggleLang} style={{ padding: '6px 12px', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 8, color: '#7c3aed', fontSize: 12, cursor: 'pointer' }}>{lang === 'zh' ? 'EN' : '中文'}</button>
              <button onClick={handleLogout} style={{ padding: '6px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, color: '#dc2626', fontSize: 12, cursor: 'pointer' }}>{t.logout}</button>
            </div>
          </div>
          <h1 style={{ fontSize: 18, fontWeight: 300, letterSpacing: '0.03em', lineHeight: 1.8, marginBottom: 8, fontFamily: '"ZCOOL XiaoWei", "Ma Shan Zheng", "ZCOOL QingKe HuangYou", "Noto Serif SC", serif', background: 'linear-gradient(135deg,#8b5cf6 0%,#ec4899 50%,#f472b6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t.title}</h1>
        </header>

        {/* Navigation */}
        <nav style={{ display: 'flex', gap: 8, marginBottom: 24, padding: 6, background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(10px)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.6)' }}>
          {['input','analysis','trends'].map(id => (
            <button key={id} onClick={() => setActiveTab(id)} style={{ flex: 1, padding: 12, border: 'none', borderRadius: 12, background: activeTab === id ? 'linear-gradient(135deg,#a78bfa,#f472b6)' : 'transparent', color: activeTab === id ? '#fff' : '#64748b', fontSize: 14, fontWeight: activeTab === id ? 600 : 400, cursor: 'pointer', transition: 'all 0.2s ease' }}>
              {t.tabs[id]}
            </button>
          ))}
          <button onClick={() => setShowSettings(true)} style={{ padding: '12px 16px', border: 'none', borderRadius: 12, background: apiConfig.apiKey ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: apiConfig.apiKey ? '#16a34a' : '#dc2626', fontSize: 14, cursor: 'pointer' }}>⚙️</button>
        </nav>

        {/* Prompt Modal */}
        {showPrompt && <div style={modal}><div style={{...modalBox, maxWidth: 600, display: 'flex', flexDirection: 'column'}}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}><h2 style={{ fontSize: 18, color: '#334155' }}>{t.saved}</h2><button onClick={() => setShowPrompt(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 24, cursor: 'pointer' }}>×</button></div>
          <div style={{ background: 'rgba(139,92,246,0.1)', borderRadius: 12, padding: 16, marginBottom: 20, border: '1px solid rgba(139,92,246,0.2)' }}><p style={{ margin: 0, fontSize: 14, color: '#7c3aed' }}>{t.copyHint}</p></div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.5)', borderRadius: 12, padding: 16, marginBottom: 20, overflow: 'auto', maxHeight: 300 }}><pre style={{ margin: 0, fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-wrap', color: '#475569' }}>{generatedPrompt}</pre></div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => { copyToClipboard(generatedPrompt); alert(t.copied) }} style={{...btnPrimary, flex: 1}}>{t.copy}</button>
            <button onClick={() => { setShowPrompt(false); setActiveTab('trends') }} style={{ flex: 1, padding: '16px 24px', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 16, color: '#7c3aed', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>{t.viewTrends}</button>
          </div>
        </div></div>}

        {/* Settings Modal */}
        {showSettings && <div style={modal}><div style={modalBox}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}><h2 style={{ fontSize: 18, color: '#334155' }}>{t.apiSettings}</h2><button onClick={() => setShowSettings(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 24, cursor: 'pointer' }}>×</button></div>
          <div style={{ marginBottom: 20 }}><label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: '#64748b' }}>{t.provider}</label><select value={apiConfig.provider} onChange={e => saveApiConfig({...apiConfig, provider: e.target.value, model: ''})} style={{...inputStyle, cursor: 'pointer'}}>{Object.entries(API_PROVIDERS).map(([k,v]) => <option key={k} value={k}>{v.name}</option>)}</select></div>
          <div style={{ marginBottom: 20 }}><label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: '#64748b' }}>{t.apiKey}</label><input type="password" value={apiConfig.apiKey} onChange={e => saveApiConfig({...apiConfig, apiKey: e.target.value})} placeholder={t.apiKeyPlaceholder} style={inputStyle} /></div>
          {API_PROVIDERS[apiConfig.provider].models.length > 0 && <div style={{ marginBottom: 20 }}><label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: '#64748b' }}>{t.model}</label><select value={apiConfig.model || API_PROVIDERS[apiConfig.provider].defaultModel} onChange={e => saveApiConfig({...apiConfig, model: e.target.value})} style={{...inputStyle, cursor: 'pointer'}}>{API_PROVIDERS[apiConfig.provider].models.map(m => <option key={m} value={m}>{m}</option>)}</select></div>}
          {apiConfig.provider === 'custom' && <div style={{ marginBottom: 20 }}><label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: '#64748b' }}>{t.apiUrl}</label><input type="text" value={apiConfig.customUrl} onChange={e => saveApiConfig({...apiConfig, customUrl: e.target.value})} placeholder="https://..." style={inputStyle} /></div>}
          <div style={{ padding: 16, background: apiConfig.apiKey ? '#dcfce7' : '#fef9c3', borderRadius: 12, border: `1px solid ${apiConfig.apiKey ? '#86efac' : '#fde047'}` }}><p style={{ margin: 0, fontSize: 13, color: apiConfig.apiKey ? '#15803d' : '#a16207' }}>{apiConfig.apiKey ? `✓ ${t.configured} ${API_PROVIDERS[apiConfig.provider].name}` : t.notConfigured}</p></div>
          <button onClick={() => setShowSettings(false)} style={{...btnPrimary, marginTop: 20}}>{t.done}</button>
        </div></div>}

        {/* Input Tab */}
        {activeTab === 'input' && (
          <div style={cardStyle}>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: '#64748b' }}>{t.date}</label>
              <input type="date" value={entry.date} onChange={e => setEntry({...entry, date: e.target.value})} style={inputStyle} />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', marginBottom: 12, fontSize: 13, color: '#64748b' }}>{t.moodScore}</label>
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
              <h3 style={{ fontSize: 14, color: '#7c3aed', marginBottom: 16 }}>{t.medication}</h3>
              <textarea value={entry.medication} onChange={e => setEntry({...entry, medication: e.target.value})} placeholder={t.medPlaceholder} style={{...inputStyle, height: 80, marginBottom: 12, resize: 'vertical'}} />
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14, color: '#64748b' }}>
                <input type="checkbox" checked={entry.medicationTaken} onChange={e => setEntry({...entry, medicationTaken: e.target.checked})} style={{ width: 18, height: 18, accentColor: '#8b5cf6' }} />
                {t.medTaken}
              </label>
            </div>

            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: 14, color: '#64748b', marginBottom: 16 }}>⌚ {t.watchData}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
                {/* 睡眠时长 - 小时和分钟分开 */}
                <div style={{ padding: 14, background: 'rgba(255,255,255,0.4)', borderRadius: 12, border: '1px solid rgba(139,92,246,0.1)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b', marginBottom: 8 }}><span>🌙</span>{t.sleep}</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input type="number" value={entry.sleepHours} onChange={e => setEntry({...entry, sleepHours: +e.target.value})} min={0} max={23} style={{ width: 50, padding: '8px 10px', background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: 8, color: '#334155', fontSize: 16, fontWeight: 500 }} />
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>{t.sleepHours}</span>
                    <input type="number" value={entry.sleepMins} onChange={e => setEntry({...entry, sleepMins: +e.target.value})} min={0} max={59} step={5} style={{ width: 50, padding: '8px 10px', background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: 8, color: '#334155', fontSize: 16, fontWeight: 500 }} />
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>{t.sleepMins}</span>
                  </div>
                </div>
                {/* HRV - 带提示 */}
                <div style={{ padding: 14, background: 'rgba(255,255,255,0.4)', borderRadius: 12, border: '1px solid rgba(139,92,246,0.1)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b', marginBottom: 4 }}>
                    <span>💓</span>{t.hrv}
                    <span title={t.hrvHint} style={{ cursor: 'help', fontSize: 10, color: '#a78bfa', border: '1px solid #a78bfa', borderRadius: '50%', width: 14, height: 14, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>?</span>
                  </label>
                  <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 6, lineHeight: 1.4 }}>{t.hrvHint}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="number" value={entry.hrv} onChange={e => setEntry({...entry, hrv: +e.target.value})} min={10} max={150} style={{ width: 80, padding: '8px 10px', background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: 8, color: '#334155', fontSize: 16, fontWeight: 500 }} />
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>ms</span>
                  </div>
                </div>
                {/* 步数 */}
                <div style={{ padding: 14, background: 'rgba(255,255,255,0.4)', borderRadius: 12, border: '1px solid rgba(139,92,246,0.1)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b', marginBottom: 8 }}><span>🚶</span>{t.steps}</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="number" value={entry.steps} onChange={e => setEntry({...entry, steps: +e.target.value})} min={0} max={30000} step={500} style={{ width: 80, padding: '8px 10px', background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: 8, color: '#334155', fontSize: 16, fontWeight: 500 }} />
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>{t.stepUnit}</span>
                  </div>
                </div>
                {/* 运动时长 */}
                <div style={{ padding: 14, background: 'rgba(255,255,255,0.4)', borderRadius: 12, border: '1px solid rgba(139,92,246,0.1)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b', marginBottom: 8 }}><span>🏃</span>{t.exercise}</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="number" value={entry.exercise} onChange={e => setEntry({...entry, exercise: +e.target.value})} min={0} max={180} step={5} style={{ width: 80, padding: '8px 10px', background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: 8, color: '#334155', fontSize: 16, fontWeight: 500 }} />
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>{t.minutes}</span>
                  </div>
                </div>
                {/* 睡眠心率范围 */}
                <div style={{ padding: 14, background: 'rgba(255,255,255,0.4)', borderRadius: 12, border: '1px solid rgba(139,92,246,0.1)', gridColumn: 'span 2' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b', marginBottom: 10 }}><span>😴</span>{t.sleepHR}</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, color: '#94a3b8' }}>{t.min}</span>
                      <input type="number" value={entry.sleepHRMin} onChange={e => setEntry({...entry, sleepHRMin: +e.target.value})} min={30} max={100} style={{ width: 70, padding: '8px 10px', background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: 8, color: '#334155', fontSize: 16, fontWeight: 500 }} />
                    </div>
                    <span style={{ color: '#94a3b8' }}>—</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, color: '#94a3b8' }}>{t.max}</span>
                      <input type="number" value={entry.sleepHRMax} onChange={e => setEntry({...entry, sleepHRMax: +e.target.value})} min={30} max={120} style={{ width: 70, padding: '8px 10px', background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: 8, color: '#334155', fontSize: 16, fontWeight: 500 }} />
                    </div>
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>bpm</span>
                  </div>
                </div>
              </div>
            </div>

            <button onClick={handleSubmit} disabled={isAnalyzing} style={{...btnPrimary, opacity: isAnalyzing ? 0.7 : 1}}>
              {isAnalyzing ? (apiConfig.apiKey ? t.analyzing : t.saving) : (apiConfig.apiKey ? t.submit : t.submitNoApi)}
            </button>
            {!apiConfig.apiKey && <p style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', marginTop: 12 }}>{t.noApiHint}</p>}
          </div>
        )}

        {/* Analysis Tab */}
        {activeTab === 'analysis' && (
          <div style={cardStyle}>
            {analysis ? <>
              <div style={{ background: statusStyle(analysis.statusColor).bg, border: `1px solid ${statusStyle(analysis.statusColor).border}`, borderRadius: 16, padding: 20, marginBottom: 24, textAlign: 'center' }}>
                <div style={{ fontSize: 14, color: statusStyle(analysis.statusColor).text, marginBottom: 8 }}>{t.status}</div>
                <div style={{ fontSize: 24, fontWeight: 500, color: statusStyle(analysis.statusColor).text }}>{analysis.status}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.4)', borderRadius: 12, padding: 20, marginBottom: 20 }}><h3 style={{ fontSize: 14, color: '#64748b', marginBottom: 12 }}>{t.summary}</h3><p style={{ fontSize: 15, lineHeight: 1.7, color: '#334155' }}>{analysis.summary}</p></div>
              <div style={{ background: 'rgba(255,255,255,0.4)', borderRadius: 12, padding: 20, marginBottom: 20 }}><h3 style={{ fontSize: 14, color: '#64748b', marginBottom: 12 }}>{t.analysis}</h3><p style={{ fontSize: 14, lineHeight: 1.8, color: '#475569', whiteSpace: 'pre-wrap' }}>{analysis.analysis}</p></div>
              {analysis.warnings?.length > 0 && <div style={{ background: 'rgba(167,139,250,0.1)', borderRadius: 12, padding: 20, marginBottom: 20, border: '1px solid rgba(167,139,250,0.2)' }}><h3 style={{ fontSize: 14, color: '#7c3aed', marginBottom: 12 }}>{t.warnings}</h3><ul style={{ margin: 0, paddingLeft: 20 }}>{analysis.warnings.map((w,i) => <li key={i} style={{ fontSize: 14, color: '#6b21a8', marginBottom: 8, lineHeight: 1.6 }}>{w}</li>)}</ul></div>}
              {analysis.suggestions?.length > 0 && <div style={{ background: '#dcfce7', borderRadius: 12, padding: 20, border: '1px solid #86efac' }}><h3 style={{ fontSize: 14, color: '#15803d', marginBottom: 12 }}>{t.suggestions}</h3><ul style={{ margin: 0, paddingLeft: 20 }}>{analysis.suggestions.map((s,i) => <li key={i} style={{ fontSize: 14, color: '#16a34a', marginBottom: 8, lineHeight: 1.6 }}>{s}</li>)}</ul></div>}
            </> : (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: 48, marginBottom: 20 }}>👁️</div>
                <h3 style={{ fontSize: 18, color: '#334155', marginBottom: 12 }}>{apiConfig.apiKey ? t.waiting : t.twoMethods}</h3>
                {!apiConfig.apiKey && <div style={{ textAlign: 'left', maxWidth: 400, margin: '0 auto' }}>
                  <div style={{ background: 'rgba(139,92,246,0.1)', borderRadius: 12, padding: 20, marginBottom: 16, border: '1px solid rgba(139,92,246,0.2)' }}><h4 style={{ fontSize: 14, color: '#7c3aed', marginBottom: 8 }}>{t.method1}</h4><p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>{t.method1Desc}</p></div>
                  <div style={{ background: 'rgba(236,72,153,0.1)', borderRadius: 12, padding: 20, border: '1px solid rgba(236,72,153,0.2)' }}><h4 style={{ fontSize: 14, color: '#db2777', marginBottom: 8 }}>{t.method2}</h4><p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>{t.method2Desc}</p><button onClick={() => setShowSettings(true)} style={{ marginTop: 12, padding: '10px 16px', background: 'linear-gradient(135deg,#a78bfa,#f472b6)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, cursor: 'pointer' }}>{t.configApi}</button></div>
                </div>}
              </div>
            )}
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === 'trends' && (
          <div style={cardStyle}>
            <h3 style={{ fontSize: 16, marginBottom: 24, color: '#334155' }}>{t.trendsTitle}</h3>
            {entries.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
                <p>{t.noData}</p>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 32 }}>
                  <h4 style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>{t.moodTrend}</h4>
                  <div style={{ height: 200 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={entries.slice(-14)}>
                        <defs><linearGradient id="mg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/></linearGradient></defs>
                        <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={d => d.slice(5)} axisLine={{ stroke: 'rgba(139,92,246,0.2)' }} />
                        <YAxis domain={[1, 10]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: 'rgba(139,92,246,0.2)' }} />
                        <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 12, color: '#334155', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                        <Area type="monotone" dataKey="moodScore" stroke="#8b5cf6" strokeWidth={2} fill="url(#mg)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div style={{ marginBottom: 32 }}>
                  <h4 style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>{t.sleepHrv}</h4>
                  <div style={{ height: 200 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={entries.slice(-14)}>
                        <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={d => d.slice(5)} axisLine={{ stroke: 'rgba(139,92,246,0.2)' }} />
                        <YAxis yAxisId="left" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: 'rgba(139,92,246,0.2)' }} />
                        <YAxis yAxisId="right" orientation="right" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: 'rgba(139,92,246,0.2)' }} />
                        <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 12, color: '#334155', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                        <Bar yAxisId="left" dataKey="sleep" fill="rgba(139,92,246,0.5)" radius={[4,4,0,0]} name={`${t.sleep}(h)`} />
                        <Line yAxisId="right" type="monotone" dataKey="hrv" stroke="#ec4899" strokeWidth={2} dot={{ fill: '#ec4899', r: 3 }} name="HRV(ms)" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div style={{ marginBottom: 32 }}>
                  <h4 style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>{t.sleepHRRange}</h4>
                  <div style={{ height: 200 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={entries.slice(-14)}>
                        <defs>
                          <linearGradient id="hrg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f472b6" stopOpacity={0.3}/><stop offset="95%" stopColor="#f472b6" stopOpacity={0}/></linearGradient>
                        </defs>
                        <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={d => d.slice(5)} axisLine={{ stroke: 'rgba(139,92,246,0.2)' }} />
                        <YAxis domain={['dataMin - 5', 'dataMax + 5']} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: 'rgba(139,92,246,0.2)' }} />
                        <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 12, color: '#334155' }} />
                        <Area type="monotone" dataKey="sleepHRMax" stroke="#f472b6" strokeWidth={2} fill="url(#hrg)" name={t.highestHR} />
                        <Area type="monotone" dataKey="sleepHRMin" stroke="#a78bfa" strokeWidth={2} fill="transparent" name={t.lowestHR} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <button onClick={() => setShowHistory(!showHistory)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: '#64748b', fontSize: 14, cursor: 'pointer', marginBottom: showHistory ? 16 : 0 }}>
                    <span>{showHistory ? '▼' : '▶'}</span> {t.history} ({entries.length} {t.records})
                  </button>
                  {showHistory && (
                    <div style={{ maxHeight: 300, overflow: 'auto' }}>
                      {entries.slice().reverse().map(e => (
                        <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(255,255,255,0.4)', borderRadius: 12, marginBottom: 8, border: '1px solid rgba(139,92,246,0.1)' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                              <span style={{ fontSize: 12, color: '#64748b' }}>{e.date}</span>
                              <span style={{ fontSize: 20 }}>{emojis[e.moodScore-1]}</span>
                              <span style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>{e.moodScore}/10</span>
                            </div>
                            <p style={{ fontSize: 13, color: '#475569', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 400 }}>{e.moodText}</p>
                          </div>
                          <button onClick={() => deleteEntry(e.id)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 12, cursor: 'pointer', padding: '4px 8px' }}>{t.delete}</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Footer */}
        <footer style={{ marginTop: 32, textAlign: 'center', padding: 20 }}>
          <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.8 }}>{t.disclaimer}</p>
          <p style={{ fontSize: 12, color: '#94a3b8' }}>{t.disclaimer2}</p>
        </footer>
      </div>
    </div>
  )
}
