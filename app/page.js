'use client'
import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, ComposedChart, Bar } from 'recharts'

const i18n = {
  zh: {
    title: '我们不判断，只陪你一起看见自己的情绪波动', subtitle: '',
    login: '登录', register: '注册', logout: '退出登录', email: '邮箱', password: '密码',
    loginBtn: '登录', registerBtn: '注册', switchToRegister: '没有账号？注册', switchToLogin: '已有账号？登录',
    tabs: { input: '📝 记录', analysis: '👁️ 观察', trends: '📊 趋势' },
    date: '日期', moodScore: '今日情绪评分', moodDesc: '描述你的感受',
    moodPlaceholder: '今天感觉如何？有什么特别的想法或经历？',
    watchData: 'Apple Watch 数据', sleep: '睡眠时长', hours: '小时', hrv: 'HRV',
    steps: '步数', stepUnit: '步', exercise: '运动时长', minutes: '分钟',
    sleepHR: '睡眠心率范围', min: '最低', max: '最高',
    medication: '💊 用药记录', medPlaceholder: '记录今天的用药情况，如：碳酸锂 300mg 早晚各一次',
    medTaken: '已按时服药', submit: '提交记录', submitNoApi: '📋 记录并生成对话提示',
    noApiHint: '未配置 API，提交后将生成对话提示', saving: '保存中...', analyzing: '正在观察你的记录...',
    saved: '✨ 记录已保存', copyHint: '💬 复制下面的内容，发送给你信赖的大模型进行对话分析',
    copy: '📋 复制到剪贴板', copied: '已复制！', viewTrends: '查看趋势',
    status: '今日记录', summary: '📋 概览', observation: '👁️ 基于你的记录', analysis: '📊 详细数据',
    noteFromRecord: '💜 来自记录的观察', rawData: '📄 原始数据',
    waiting: '等待记录', twoMethods: '两种使用方式',
    method1: '💬 方式一：与你所信赖的大模型对话', method1Desc: '提交记录后，复制生成的提示词进行对话',
    method2: '⚡ 方式二：自动特征提取', method2Desc: '配置 API Key 后，获得结构化的观察结果',
    trendsTitle: '📈 情绪与生理指标趋势', noData: '暂无数据，开始记录后这里将显示趋势图表',
    moodTrend: '情绪评分', sleepHrv: '睡眠 & HRV', sleepHRRange: '睡眠心率范围',
    show: '显示', hide: '隐藏', history: '历史记录', records: '条',
    disclaimer: '本应用仅供辅助记录和自我观察，不提供任何诊断或医疗建议。',
    disclaimer2: '如果你需要支持，请联系你信任的人或专业人士。',
    delete: '删除', confirmDelete: '确定删除这条记录吗？',
    enterMood: '请输入今天的情绪感受', lowestHR: '最低心率', highestHR: '最高心率',
    loginError: '登录失败，请检查邮箱和密码', registerError: '注册失败',
    registerSuccess: '注册成功！', loading: '加载中...',
    apiSettings: '⚙️ API 设置', provider: '选择 API 服务商', apiKey: 'API Key',
    apiKeyPlaceholder: '输入你的 API Key', model: '模型', apiUrl: 'API 地址',
    configured: '已配置', notConfigured: '未配置 API Key 时，可复制提示词与大模型对话',
    done: '完成', configApi: '⚙️ 配置 API'
  },
  en: {
    title: 'We don\'t judge. We just help you see your emotional waves.', subtitle: '',
    login: 'Login', register: 'Register', logout: 'Logout', email: 'Email', password: 'Password',
    loginBtn: 'Login', registerBtn: 'Register', switchToRegister: 'No account? Register', switchToLogin: 'Have account? Login',
    tabs: { input: '📝 Record', analysis: '👁️ Observe', trends: '📊 Trends' },
    date: 'Date', moodScore: 'Today\'s Mood Score', moodDesc: 'Describe your feelings',
    moodPlaceholder: 'How are you feeling today? Any special thoughts or experiences?',
    watchData: 'Apple Watch Data', sleep: 'Sleep', hours: 'hrs', hrv: 'HRV',
    steps: 'Steps', stepUnit: 'steps', exercise: 'Exercise', minutes: 'min',
    sleepHR: 'Sleep Heart Rate Range', min: 'Min', max: 'Max',
    medication: '💊 Medication Log', medPlaceholder: 'Record today\'s medication, e.g.: Lithium 300mg twice daily',
    medTaken: 'Medication taken as scheduled', submit: 'Submit Record', submitNoApi: '📋 Record & Generate Prompt',
    noApiHint: 'No API configured. A prompt will be generated.', saving: 'Saving...', analyzing: 'Observing your record...',
    saved: '✨ Record Saved', copyHint: '💬 Copy and send to your trusted AI for conversation',
    copy: '📋 Copy to Clipboard', copied: 'Copied!', viewTrends: 'View Trends',
    status: 'Today\'s Record', summary: '📋 Overview', observation: '👁️ Based on your record', analysis: '📊 Detailed Data',
    noteFromRecord: '💜 Observations from your record', rawData: '📄 Raw Data',
    waiting: 'Awaiting record', twoMethods: 'Two Ways to Use',
    method1: '💬 Method 1: Chat with your trusted AI', method1Desc: 'Copy the generated prompt for conversation',
    method2: '⚡ Method 2: Auto Feature Extraction', method2Desc: 'Configure API Key for structured observations',
    trendsTitle: '📈 Mood & Physiological Trends', noData: 'No data yet. Trends will appear after you start recording.',
    moodTrend: 'Mood Score', sleepHrv: 'Sleep & HRV', sleepHRRange: 'Sleep HR Range',
    show: 'Show', hide: 'Hide', history: 'History', records: 'records',
    disclaimer: 'This app is for self-recording and observation only. It does not provide diagnosis or medical advice.',
    disclaimer2: 'If you need support, please reach out to someone you trust or a professional.',
    delete: 'Delete', confirmDelete: 'Delete this record?',
    enterMood: 'Please enter your mood description', lowestHR: 'Lowest HR', highestHR: 'Highest HR',
    loginError: 'Login failed, please check email and password', registerError: 'Registration failed',
    registerSuccess: 'Registered!', loading: 'Loading...',
    apiSettings: '⚙️ API Settings', provider: 'Select API Provider', apiKey: 'API Key',
    apiKeyPlaceholder: 'Enter your API Key', model: 'Model', apiUrl: 'API URL',
    configured: 'Configured', notConfigured: 'Without API Key, you can copy prompts to chat with AI',
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
const SYSTEM_PROMPT = `You are a text observation assistant that extracts structured linguistic features from user journal entries.

You are NOT allowed to:
- interpret or explain the meaning of emotions
- predict future mental states
- provide therapeutic advice or recommendations
- diagnose any mental health condition
- assume causality between data points
- use alarming or clinical language

Your task is strictly feature extraction and observation. You will output structured JSON based on the user's request.

When you detect that the user's expression shows signs of needing support (such as expressions of persistent pain, loneliness, or seeking understanding), set needs_care to true and add a gentle "care_message" field:

For Chinese: "你的感受值得被认真对待。如果你想找人聊聊，可以考虑联系你信任的人。"

For English: "Your feelings deserve to be taken seriously. If you'd like to talk to someone, consider reaching out to someone you trust."

Use gentle, non-judgmental language throughout. Avoid terms like "risk", "warning", "concern", "negative". Instead use observational language like "based on your words", "relatively", "appears to".

Output valid JSON only.`

// ============ User Prompt 模板 ============
const buildUserPrompt = (entry, history, lang) => {
  const isZh = lang === 'zh'
  return isZh ? `请分析下面的用户输入文本，并提取以下信息：

【用户文本】
"${entry.moodText || '（无）'}"

【需要提取的特征】

1. 情绪词汇（emotion_words）
   - 识别文本中的情绪相关词汇
   - 分类为：positive（积极）、negative（消极）、ambivalent（复杂/矛盾）
   - 包括但不限于：焦虑、轻松、茫然、混乱、期待、厌恶、平静、恐惧、愤怒、悲伤、快乐、无望、疲惫 等

2. 文本长度特征（text_metrics）
   - character_count: 字符数
   - sentence_count: 句子数
   - avg_sentence_length: 平均句长（字符数）

3. 自我表达检测（self_expression）
   - detected: 是否检测到自我相关表达（true/false）
   - tone: 语气标记（不做判断，仅观察）
       * neutral: 中性自述（如"我今天还行"、"我做了这件事"）
       * reflective: 反思型表达（如"我在想..."、"我觉得自己..."）
       * low_energy: 低能量表达（如"有点累"、"不太想动"）
       * seeking_support: 寻求支持的表达（如"希望有人理解"、"感觉很孤单"）
   - excerpts: 提取原文片段（不做解释，仅摘录）
   - needs_care: 如果检测到表达中包含持续痛苦或需要支持的信号，标记为 true

4. 连贯性分析（coherence）
   - score: 1-5 分（1=片段化/跳跃，5=逻辑清晰流畅）
   - indicators: 
       * logical_connectors: 逻辑连接词数量（因为、所以、但是、然后、接着 等）
       * topic_shifts: 话题转换次数
       * incomplete_thoughts: 未完成/中断的句子数
   - pattern: "linear"（线性叙述）/ "fragmented"（片段化）/ "circular"（循环反复）/ "scattered"（发散跳跃）

5. 表达丰富度（expression_richness）
   - vocabulary_diversity: 词汇多样性得分 1-5（1=重复单一，5=丰富多样）
   - unique_word_ratio: 不重复词汇占比（估算）
   - descriptive_elements:
       * adjectives_count: 形容词数量
       * metaphors_detected: 是否使用比喻/隐喻（true/false）
       * sensory_words: 感官词汇（视觉、听觉、触觉等描述）
   - expression_style: "minimal"（极简）/ "moderate"（适中）/ "elaborate"（详尽）/ "repetitive"（重复）

6. 特定话题浓度（topic_concentration）
   - detected_topics: 识别到的主要话题及其出现强度
       * self: 自我相关（0-100%）
       * others: 他人相关（0-100%）
       * work_study: 工作/学习（0-100%）
       * health: 健康/身体（0-100%）
       * relationships: 人际关系（0-100%）
       * future: 未来/计划（0-100%）
       * past: 过去/回忆（0-100%）
   - dominant_topic: 最主要的话题
   - rumination_indicators: 反刍思维指标
       * repetitive_themes: 重复出现的主题词
       * stuck_patterns: 是否有"卡住"的表达模式（如反复提及同一件事）

7. 生理数据汇总（physiological_data）
   - sleep_hours: ${entry.sleep}
   - hrv_ms: ${entry.hrv}
   - sleep_hr_range: [${entry.sleepHRMin}, ${entry.sleepHRMax}]
   - steps: ${entry.steps}
   - exercise_minutes: ${entry.exercise}

8. 用药状态（medication_status）
   - recorded: ${entry.medication ? 'true' : 'false'}
   - taken_as_scheduled: ${entry.medicationTaken ? 'true' : 'false'}
   - medication_text: "${entry.medication || ''}"

9. 历史数据模式（history_pattern）
   - recent_mood_scores: [${history.slice(-7).map(h => h.moodScore).join(', ') || '无数据'}]
   - recent_sleep_hours: [${history.slice(-7).map(h => h.sleep).join(', ') || '无数据'}]
   - data_points: ${history.length}

⚠️ 输出格式：严格 JSON，不含额外解释。
⚠️ 如果 self_expression.needs_care 为 true，请在 JSON 中添加 "care_message" 字段。`

: `Please analyze the following user text and extract these features:

【User Text】
"${entry.moodText || '(none)'}"

【Features to Extract】

1. Emotion Words (emotion_words)
   - Identify emotion-related words in the text
   - Categorize as: positive, negative, ambivalent
   - Including but not limited to: anxious, relaxed, confused, hopeful, disgusted, calm, fearful, angry, sad, happy, hopeless, exhausted, etc.

2. Text Metrics (text_metrics)
   - character_count: number of characters
   - sentence_count: number of sentences
   - avg_sentence_length: average sentence length (characters)

3. Self-Expression Detection (self_expression)
   - detected: whether self-related expression is detected (true/false)
   - tone: tone marker (observation only, no judgment)
       * neutral: neutral self-statement (e.g., "I'm okay today", "I did this")
       * reflective: reflective expression (e.g., "I'm thinking...", "I feel like...")
       * low_energy: low energy expression (e.g., "feeling tired", "don't want to move")
       * seeking_support: support-seeking expression (e.g., "wish someone understood", "feeling alone")
   - excerpts: extracted original phrases (no interpretation, just quotes)
   - needs_care: if persistent pain or support-seeking signals detected, mark as true

4. Coherence Analysis (coherence)
   - score: 1-5 (1=fragmented/jumpy, 5=logically clear and smooth)
   - indicators:
       * logical_connectors: count of logical connectors (because, so, but, then, etc.)
       * topic_shifts: number of topic changes
       * incomplete_thoughts: number of incomplete/interrupted sentences
   - pattern: "linear" / "fragmented" / "circular" / "scattered"

5. Expression Richness (expression_richness)
   - vocabulary_diversity: score 1-5 (1=repetitive/limited, 5=rich/diverse)
   - unique_word_ratio: estimated ratio of unique words
   - descriptive_elements:
       * adjectives_count: number of adjectives
       * metaphors_detected: whether metaphors are used (true/false)
       * sensory_words: sensory vocabulary (visual, auditory, tactile descriptions)
   - expression_style: "minimal" / "moderate" / "elaborate" / "repetitive"

6. Topic Concentration (topic_concentration)
   - detected_topics: identified main topics and their intensity
       * self: self-related (0-100%)
       * others: others-related (0-100%)
       * work_study: work/study (0-100%)
       * health: health/body (0-100%)
       * relationships: interpersonal (0-100%)
       * future: future/plans (0-100%)
       * past: past/memories (0-100%)
   - dominant_topic: the most prominent topic
   - rumination_indicators:
       * repetitive_themes: recurring theme words
       * stuck_patterns: whether there are "stuck" expression patterns

7. Physiological Data (physiological_data)
   - sleep_hours: ${entry.sleep}
   - hrv_ms: ${entry.hrv}
   - sleep_hr_range: [${entry.sleepHRMin}, ${entry.sleepHRMax}]
   - steps: ${entry.steps}
   - exercise_minutes: ${entry.exercise}

8. Medication Status (medication_status)
   - recorded: ${entry.medication ? 'true' : 'false'}
   - taken_as_scheduled: ${entry.medicationTaken ? 'true' : 'false'}
   - medication_text: "${entry.medication || ''}"

9. History Pattern (history_pattern)
   - recent_mood_scores: [${history.slice(-7).map(h => h.moodScore).join(', ') || 'no data'}]
   - recent_sleep_hours: [${history.slice(-7).map(h => h.sleep).join(', ') || 'no data'}]
   - data_points: ${history.length}

⚠️ Output format: Strict JSON, no additional explanations.
⚠️ If self_expression.needs_care is true, add a "care_message" field to the JSON.`
       * L1: Normal self-assessment (e.g., "I'm doing okay today")
       * L2: Negative self-assessment, non-acute (e.g., "I haven't been doing well", "I always mess up")
       * L3: Hopelessness statements, acute risk (e.g., "life isn't worth living", "I'm a burden", "don't want to continue")
   - excerpts: extracted original phrases (no interpretation, just quotes)

4. Physiological Data (physiological_data)
   - sleep_hours: ${entry.sleep}
   - hrv_ms: ${entry.hrv}
   - sleep_hr_range: [${entry.sleepHRMin}, ${entry.sleepHRMax}]
   - steps: ${entry.steps}
   - exercise_minutes: ${entry.exercise}

5. Medication Status (medication_status)
   - recorded: ${entry.medication ? 'true' : 'false'}
   - taken_as_scheduled: ${entry.medicationTaken ? 'true' : 'false'}
   - medication_text: "${entry.medication || ''}"

6. History Pattern (history_pattern)
   - recent_mood_scores: [${history.slice(-7).map(h => h.moodScore).join(', ') || 'no data'}]
   - recent_sleep_hours: [${history.slice(-7).map(h => h.sleep).join(', ') || 'no data'}]
   - data_points: ${history.length}

⚠️ Output format: Strict JSON, no additional explanations.
⚠️ If self_judgment.level is L3, you MUST add a "care_message" field to the JSON.`
}

const analyzeWithAI = async (entry, history, config, lang) => {
  const userPrompt = buildUserPrompt(entry, history, lang)
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: userPrompt }
  ]

  const provider = API_PROVIDERS[config.provider]
  const baseUrl = config.provider === 'custom' ? config.customUrl : provider.baseUrl
  const model = config.model || provider.defaultModel
  
  try {
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${config.apiKey}`, ...provider.extraHeaders }
    if (config.provider === 'anthropic') { headers['x-api-key'] = config.apiKey; delete headers['Authorization'] }
    const res = await fetch(baseUrl, { method: 'POST', headers, body: JSON.stringify(provider.formatRequest(messages, model)) })
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    const data = await res.json()
    let text = provider.parseResponse(data).replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const parsed = JSON.parse(text)
    
    // 使用 self_expression 的 needs_care 字段
    const needsCare = parsed.self_expression?.needs_care || false
    const tone = parsed.self_expression?.tone || 'neutral'
    
    // 构建摘要
    const emotionCount = parsed.emotion_words ? 
      (Array.isArray(parsed.emotion_words) ? parsed.emotion_words.length : 
       Object.values(parsed.emotion_words).flat().length) : 0
    
    // 使用更安全温和的措辞
    const toneLabels = {
      zh: { 
        neutral: '日常记录', 
        reflective: '反思时刻', 
        low_energy: '低能量期', 
        seeking_support: '需要陪伴的时刻' 
      },
      en: { 
        neutral: 'Daily record', 
        reflective: 'Reflective moment', 
        low_energy: 'Low energy period', 
        seeking_support: 'A moment needing support' 
      }
    }
    
    const statusLabels = {
      zh: { 
        neutral: '记录完成', 
        reflective: '观察到反思性表达', 
        low_energy: '观察到低能量表达', 
        seeking_support: '你的感受被看见了' 
      },
      en: { 
        neutral: 'Record complete', 
        reflective: 'Reflective expression observed', 
        low_energy: 'Low energy expression observed', 
        seeking_support: 'Your feelings are seen' 
      }
    }
    
    // 构建基于记录的观察（而非判断）
    const buildObservations = (parsed, lang) => {
      const obs = []
      const isZh = lang === 'zh'
      
      // 情绪词观察
      const emotionWords = parsed.emotion_words
      if (emotionWords) {
        const negative = emotionWords.negative?.length || 0
        const positive = emotionWords.positive?.length || 0
        if (negative > positive && negative > 0) {
          obs.push(isZh ? `基于你的文字，出现了 ${negative} 个偏低能量的情绪词` : `Based on your words, ${negative} lower-energy emotion words appeared`)
        } else if (positive > negative && positive > 0) {
          obs.push(isZh ? `基于你的文字，出现了 ${positive} 个积极的情绪词` : `Based on your words, ${positive} positive emotion words appeared`)
        }
      }
      
      // 表达风格观察
      if (parsed.expression_richness?.expression_style === 'minimal') {
        obs.push(isZh ? '基于你的记录，今天的表达相对简短' : 'Based on your entry, today\'s expression is relatively brief')
      } else if (parsed.expression_richness?.expression_style === 'elaborate') {
        obs.push(isZh ? '基于你的记录，今天写了比较多的内容' : 'Based on your entry, you wrote quite a bit today')
      }
      
      // 连贯性观察
      if (parsed.coherence) {
        if (parsed.coherence.score <= 2) {
          obs.push(isZh ? '基于你写的内容，思路看起来比较跳跃' : 'Based on what you wrote, thoughts appear somewhat scattered')
        }
        if (parsed.coherence.pattern === 'circular') {
          obs.push(isZh ? '基于你的记录，某些想法似乎在反复出现' : 'Based on your entry, some thoughts seem to be recurring')
        }
      }
      
      // 话题浓度观察
      if (parsed.topic_concentration?.detected_topics?.self > 70) {
        obs.push(isZh ? '基于你的记录，内容主要围绕自己' : 'Based on your entry, content mainly focuses on yourself')
      }
      
      // 反刍指标
      if (parsed.topic_concentration?.rumination_indicators?.stuck_patterns) {
        obs.push(isZh ? '基于你的文字，可能有一些想法在脑海中盘旋' : 'Based on your text, some thoughts may be circling')
      }
      
      // 睡眠观察
      if (parsed.physiological_data?.sleep_hours < 6) {
        obs.push(isZh ? `基于记录，睡眠时长相对偏少（${parsed.physiological_data.sleep_hours}小时）` : `Based on the record, sleep duration is relatively low (${parsed.physiological_data.sleep_hours}h)`)
      }
      
      // 如果没有特别的观察，给一个温和的默认观察
      if (obs.length === 0) {
        obs.push(isZh ? '今天的记录已保存，你可以随时回顾' : 'Today\'s record is saved, you can review it anytime')
      }
      
      return obs
    }
    
    const observations = buildObservations(parsed, lang)
    
    // 决定状态颜色（使用柔和的颜色）
    const statusColor = needsCare ? 'purple' : (tone === 'low_energy' ? 'blue' : 'green')
    
    return {
      status: statusLabels[lang][needsCare ? 'seeking_support' : tone] || statusLabels[lang].neutral,
      statusColor: statusColor,
      summary: lang === 'zh'
        ? `记录于 ${entry.date} | ${toneLabels.zh[tone] || '日常记录'} | ${emotionCount} 个情绪词`
        : `Recorded on ${entry.date} | ${toneLabels.en[tone] || 'Daily record'} | ${emotionCount} emotion words`,
      analysis: JSON.stringify(parsed, null, 2),
      observations: observations,
      warnings: needsCare ? [parsed.care_message || (lang === 'zh' 
        ? '你的感受值得被认真对待。如果你想找人聊聊，可以考虑联系你信任的人。' 
        : 'Your feelings deserve to be taken seriously. If you\'d like to talk to someone, consider reaching out to someone you trust.')] : [],
      suggestions: [],
      trendDirection: 'stable',
      rawFeatures: parsed,
      careMessage: parsed.care_message || null
    }
  } catch (e) {
    const isZh = lang === 'zh'
    return { status: isZh ? '记录已保存' : 'Record saved', statusColor: 'gray', summary: e.message, analysis: '', observations: [], warnings: [], suggestions: [], trendDirection: 'stable' }
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

  // 无 API 时生成的对话 prompt
  const genPrompt = (e, h) => lang === 'zh' ? `请分析下面的用户输入文本，并提取以下信息：

【用户文本】
"${e.moodText || '（无）'}"

【需要提取的特征】

1. 情绪词汇（emotion_words）
   - 识别文本中的情绪相关词汇
   - 分类为：positive（积极）、negative（消极）、ambivalent（复杂/矛盾）
   - 包括但不限于：焦虑、轻松、茫然、混乱、期待、厌恶、平静、恐惧、愤怒、悲伤、快乐、无望、疲惫 等

2. 文本长度特征（text_metrics）
   - character_count: 字符数
   - sentence_count: 句子数
   - avg_sentence_length: 平均句长（字符数）

3. 自我评价检测（self_judgment）
   - detected: 是否检测到自我评价（true/false）
   - level: 等级标记
       * L1: 一般自评（正常范围，如"我今天还行"）
       * L2: 消极自评（非急性，如"我最近状态不太好"、"我总是做不好"）
       * L3: 绝望语句（急性风险，如"活着没意思"、"我是个负担"、"不想继续了"）
   - excerpts: 提取原文片段（不做解释，仅摘录）

4. 连贯性分析（coherence）
   - score: 1-5 分（1=片段化/跳跃，5=逻辑清晰流畅）
   - indicators:
       * logical_connectors: 逻辑连接词数量（因为、所以、但是、然后、接着 等）
       * topic_shifts: 话题突然转换次数
       * incomplete_thoughts: 未完成/中断的句子数
   - pattern: "linear"（线性叙述）/ "fragmented"（片段化）/ "circular"（循环反复）/ "scattered"（发散跳跃）

5. 表达丰富度（expression_richness）
   - vocabulary_diversity: 词汇多样性得分 1-5（1=重复单一，5=丰富多样）
   - unique_word_ratio: 不重复词汇占比（估算）
   - descriptive_elements:
       * adjectives_count: 形容词数量
       * metaphors_detected: 是否使用比喻/隐喻（true/false）
       * sensory_words: 感官词汇（视觉、听觉、触觉等描述）
   - expression_style: "minimal"（极简）/ "moderate"（适中）/ "elaborate"（详尽）/ "repetitive"（重复）

6. 特定话题浓度（topic_concentration）
   - detected_topics: 识别到的主要话题及其出现强度
       * self: 自我相关（0-100%）
       * others: 他人相关（0-100%）
       * work_study: 工作/学习（0-100%）
       * health: 健康/身体（0-100%）
       * relationships: 人际关系（0-100%）
       * future: 未来/计划（0-100%）
       * past: 过去/回忆（0-100%）
   - dominant_topic: 最主要的话题
   - rumination_indicators: 反刍思维指标
       * repetitive_themes: 重复出现的主题词
       * stuck_patterns: 是否有"卡住"的表达模式（如反复提及同一件事）

7. 生理数据汇总（physiological_data）
   - sleep_hours: ${e.sleep}
   - hrv_ms: ${e.hrv}
   - sleep_hr_range: [${e.sleepHRMin}, ${e.sleepHRMax}]
   - steps: ${e.steps}
   - exercise_minutes: ${e.exercise}

8. 用药状态（medication_status）
   - recorded: ${e.medication ? 'true' : 'false'}
   - taken_as_scheduled: ${e.medicationTaken ? 'true' : 'false'}
   - medication_text: "${e.medication || ''}"

9. 历史数据模式（history_pattern）
   - recent_mood_scores: [${h.slice(-7).map(x => x.moodScore).join(', ') || '无数据'}]
   - recent_sleep_hours: [${h.slice(-7).map(x => x.sleep).join(', ') || '无数据'}]
   - data_points: ${h.length}

⚠️ 输出格式：严格 JSON，不含额外解释。
⚠️ 如果 self_judgment.level 为 L3，请在 JSON 末尾添加 care_message 字段：
"你的感受值得被认真对待。如果你正在经历持续的痛苦或绝望，请考虑联系可信的人或当地专业帮助。"` 

: `Please analyze the following user text and extract these features:

【User Text】
"${e.moodText || '(none)'}"

【Features to Extract】

1. Emotion Words (emotion_words)
   - Identify emotion-related words in the text
   - Categorize as: positive, negative, ambivalent
   - Including but not limited to: anxious, relaxed, confused, hopeful, disgusted, calm, fearful, angry, sad, happy, hopeless, exhausted, etc.

2. Text Metrics (text_metrics)
   - character_count: number of characters
   - sentence_count: number of sentences
   - avg_sentence_length: average sentence length (characters)

3. Self-Judgment Detection (self_judgment)
   - detected: whether self-evaluation is detected (true/false)
   - level: classification
       * L1: Normal self-assessment (e.g., "I'm doing okay today")
       * L2: Negative self-assessment, non-acute (e.g., "I haven't been doing well", "I always mess up")
       * L3: Hopelessness statements, acute risk (e.g., "life isn't worth living", "I'm a burden", "don't want to continue")
   - excerpts: extracted original phrases (no interpretation, just quotes)

4. Coherence Analysis (coherence)
   - score: 1-5 (1=fragmented/jumpy, 5=logically clear and smooth)
   - indicators:
       * logical_connectors: count of logical connectors (because, so, but, then, etc.)
       * topic_shifts: number of abrupt topic changes
       * incomplete_thoughts: number of incomplete/interrupted sentences
   - pattern: "linear" / "fragmented" / "circular" / "scattered"

5. Expression Richness (expression_richness)
   - vocabulary_diversity: score 1-5 (1=repetitive/limited, 5=rich/diverse)
   - unique_word_ratio: estimated ratio of unique words
   - descriptive_elements:
       * adjectives_count: number of adjectives
       * metaphors_detected: whether metaphors are used (true/false)
       * sensory_words: sensory vocabulary (visual, auditory, tactile descriptions)
   - expression_style: "minimal" / "moderate" / "elaborate" / "repetitive"

6. Topic Concentration (topic_concentration)
   - detected_topics: identified main topics and their intensity
       * self: self-related (0-100%)
       * others: others-related (0-100%)
       * work_study: work/study (0-100%)
       * health: health/body (0-100%)
       * relationships: interpersonal (0-100%)
       * future: future/plans (0-100%)
       * past: past/memories (0-100%)
   - dominant_topic: the most prominent topic
   - rumination_indicators:
       * repetitive_themes: recurring theme words
       * stuck_patterns: whether there are "stuck" expression patterns

7. Physiological Data (physiological_data)
   - sleep_hours: ${e.sleep}
   - hrv_ms: ${e.hrv}
   - sleep_hr_range: [${e.sleepHRMin}, ${e.sleepHRMax}]
   - steps: ${e.steps}
   - exercise_minutes: ${e.exercise}

8. Medication Status (medication_status)
   - recorded: ${e.medication ? 'true' : 'false'}
   - taken_as_scheduled: ${e.medicationTaken ? 'true' : 'false'}
   - medication_text: "${e.medication || ''}"

9. History Pattern (history_pattern)
   - recent_mood_scores: [${h.slice(-7).map(x => x.moodScore).join(', ') || 'no data'}]
   - recent_sleep_hours: [${h.slice(-7).map(x => x.sleep).join(', ') || 'no data'}]
   - data_points: ${h.length}

⚠️ Output format: Strict JSON, no additional explanations.
⚠️ If self_judgment.level is L3, add a care_message field at the end of JSON:
"Your feelings deserve to be taken seriously. If you are experiencing persistent pain or despair, please consider reaching out to someone you trust or local professional help."`

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

  // --- 🎨 新的美术风格常量 ---
  // 1. 状态标签：柔和的莫兰迪色背景 + 深色文字
  const statusStyle = c => ({
    green: { bg: '#dcfce7', border: '#86efac', text: '#15803d' },
    yellow: { bg: '#fef9c3', border: '#fde047', text: '#a16207' },
    orange: { bg: '#ffedd5', border: '#fdba74', text: '#c2410c' },
    red: { bg: '#fee2e2', border: '#fca5a5', text: '#b91c1c' },
    gray: { bg: '#f3f4f6', border: '#d1d5db', text: '#4b5563' }
  }[c] || { bg: '#f3f4f6', border: '#d1d5db', text: '#4b5563' })

  // 2. 输入框：白底+磨砂+淡紫边框
  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    background: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(139, 92, 246, 0.15)',
    borderRadius: '16px',
    color: '#475569',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.2s ease',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
  }

  // 3. 主按钮：梦幻渐变（紫到粉）
  const btnPrimary = {
    padding: '16px',
    background: 'linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)',
    border: 'none',
    borderRadius: '16px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    boxShadow: '0 4px 12px rgba(167, 139, 250, 0.3)',
    transition: 'transform 0.1s ease',
    marginTop: '10px'
  }

  // 4. 模态框：磨砂玻璃悬浮卡片
  const modal = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(12px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, padding: 20
  }

  const modalBox = {
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '24px',
    padding: '32px',
    width: '100%', maxWidth: 500,
    border: '1px solid #fff',
    boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
    maxHeight: '90vh', overflowY: 'auto',
    color: '#334155'
  }

  // 5. 卡片容器
  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(10px)',
    borderRadius: '24px',
    padding: '28px',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)'
  }
  // --- 🎨 样式替换结束 ---

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
          <div style={{ flex: 1, overflow: 'auto', background: 'rgba(0,0,0,0.03)', borderRadius: 12, padding: 16, marginBottom: 20, maxHeight: 300 }}><pre style={{ margin: 0, fontSize: 13, color: '#475569', whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.7, fontFamily: 'monospace' }}>{prompt}</pre></div>
          <div style={{ display: 'flex', gap: 12 }}><button onClick={() => copyToClipboard(prompt)} style={{...btnPrimary, flex: 1}}>{t.copy}</button><button onClick={() => { setShowPrompt(false); setActiveTab('trends') }} style={{ padding: '14px 20px', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 12, color: '#7c3aed', cursor: 'pointer' }}>{t.viewTrends}</button></div>
        </div></div>}

        {/* Settings Modal */}
        {showSettings && <div style={modal}><div style={modalBox}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}><h2 style={{ fontSize: 20, color: '#334155' }}>{t.apiSettings}</h2><button onClick={() => setShowSettings(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 24, cursor: 'pointer' }}>×</button></div>
          <div style={{ marginBottom: 20 }}><label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: '#64748b' }}>{t.provider}</label><select value={apiConfig.provider} onChange={e => saveApiConfig({...apiConfig, provider: e.target.value, model: API_PROVIDERS[e.target.value].defaultModel})} style={{...inputStyle, cursor: 'pointer'}}>{Object.entries(API_PROVIDERS).map(([k,v]) => <option key={k} value={k}>{v.name}</option>)}</select></div>
          <div style={{ marginBottom: 20 }}><label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: '#64748b' }}>{t.apiKey}</label><input type="password" value={apiConfig.apiKey} onChange={e => saveApiConfig({...apiConfig, apiKey: e.target.value})} placeholder={t.apiKeyPlaceholder} style={inputStyle} /></div>
          <div style={{ marginBottom: 20 }}><label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: '#64748b' }}>{t.model}</label>{apiConfig.provider === 'custom' ? <input type="text" value={apiConfig.model} onChange={e => saveApiConfig({...apiConfig, model: e.target.value})} style={inputStyle} /> : <select value={apiConfig.model || API_PROVIDERS[apiConfig.provider].defaultModel} onChange={e => saveApiConfig({...apiConfig, model: e.target.value})} style={{...inputStyle, cursor: 'pointer'}}>{API_PROVIDERS[apiConfig.provider].models.map(m => <option key={m} value={m}>{m}</option>)}</select>}</div>
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
                {[
                  {k:'sleep',l:t.sleep,u:t.hours,i:'🌙',min:0,max:15,step:.5},
                  {k:'hrv',l:t.hrv,u:'ms',i:'💓',min:10,max:150,step:1},
                  {k:'steps',l:t.steps,u:t.stepUnit,i:'🚶',min:0,max:30000,step:500},
                  {k:'exercise',l:t.exercise,u:t.minutes,i:'🏃',min:0,max:180,step:5}
                ].map(f => (
                  <div key={f.k} style={{ padding: 14, background: 'rgba(255,255,255,0.4)', borderRadius: 12, border: '1px solid rgba(139,92,246,0.1)' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b', marginBottom: 8 }}><span>{f.i}</span>{f.l}</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input type="number" value={entry[f.k]} onChange={e => setEntry({...entry, [f.k]: +e.target.value})} min={f.min} max={f.max} step={f.step} style={{ width: 80, padding: '8px 10px', background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: 8, color: '#334155', fontSize: 16, fontWeight: 500 }} />
                      <span style={{ fontSize: 12, color: '#94a3b8' }}>{f.u}</span>
                    </div>
                  </div>
                ))}
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

        {/* Analysis Tab - 改为观察Tab */}
        {activeTab === 'analysis' && (
          <div style={cardStyle}>
            {analysis ? <>
              {/* 状态卡片 - 使用更柔和的颜色 */}
              <div style={{ 
                background: analysis.statusColor === 'purple' ? 'rgba(167,139,250,0.15)' : 
                           analysis.statusColor === 'blue' ? 'rgba(96,165,250,0.15)' : 'rgba(134,239,172,0.15)',
                border: `1px solid ${analysis.statusColor === 'purple' ? 'rgba(167,139,250,0.3)' : 
                                     analysis.statusColor === 'blue' ? 'rgba(96,165,250,0.3)' : 'rgba(134,239,172,0.3)'}`,
                borderRadius: 16, padding: 20, marginBottom: 24, textAlign: 'center' 
              }}>
                <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>{t.status}</div>
                <div style={{ fontSize: 20, fontWeight: 400, color: '#334155' }}>{analysis.status}</div>
              </div>
              
              {/* 概览 */}
              <div style={{ background: 'rgba(255,255,255,0.4)', borderRadius: 12, padding: 20, marginBottom: 20 }}>
                <h3 style={{ fontSize: 14, color: '#64748b', marginBottom: 12 }}>{t.summary}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: '#334155' }}>{analysis.summary}</p>
              </div>
              
              {/* 基于记录的观察 - 新增温和风格 */}
              {analysis.observations?.length > 0 && (
                <div style={{ 
                  background: 'rgba(167,139,250,0.08)', 
                  borderRadius: 16, 
                  padding: 20, 
                  marginBottom: 20, 
                  border: '1px solid rgba(167,139,250,0.15)' 
                }}>
                  <h3 style={{ fontSize: 14, color: '#7c3aed', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>👁️</span> {t.observation || '基于你的记录'}
                  </h3>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                    {analysis.observations.map((obs, i) => (
                      <li key={i} style={{ 
                        fontSize: 14, 
                        color: '#475569', 
                        marginBottom: 12, 
                        lineHeight: 1.7,
                        paddingLeft: 20,
                        position: 'relative'
                      }}>
                        <span style={{ position: 'absolute', left: 0, color: '#a78bfa' }}>·</span>
                        {obs}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* 关怀信息 - 使用温暖的紫色而非红色 */}
              {analysis.warnings?.length > 0 && (
                <div style={{ 
                  background: 'rgba(167,139,250,0.1)', 
                  borderRadius: 16, 
                  padding: 20, 
                  marginBottom: 20, 
                  border: '1px solid rgba(167,139,250,0.2)' 
                }}>
                  <h3 style={{ fontSize: 14, color: '#7c3aed', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>💜</span> {lang === 'zh' ? '想对你说' : 'A note for you'}
                  </h3>
                  {analysis.warnings.map((w, i) => (
                    <p key={i} style={{ 
                      fontSize: 14, 
                      color: '#475569', 
                      marginBottom: i < analysis.warnings.length - 1 ? 12 : 0, 
                      lineHeight: 1.8 
                    }}>{w}</p>
                  ))}
                </div>
              )}
              
              {/* 原始数据折叠区 */}
              <details style={{ background: 'rgba(255,255,255,0.3)', borderRadius: 12, padding: 16, border: '1px solid rgba(139,92,246,0.1)' }}>
                <summary style={{ fontSize: 13, color: '#94a3b8', cursor: 'pointer', userSelect: 'none' }}>
                  {t.rawData || '📄 查看原始数据'}
                </summary>
                <pre style={{ 
                  marginTop: 16, 
                  fontSize: 11, 
                  lineHeight: 1.5, 
                  color: '#64748b', 
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  background: 'rgba(255,255,255,0.5)',
                  padding: 12,
                  borderRadius: 8
                }}>{analysis.analysis}</pre>
              </details>
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

                <div style={{ marginTop: 32 }}>
                  <button onClick={() => setShowHistory(!showHistory)} style={{ width: '100%', padding: 14, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 12, color: '#7c3aed', fontSize: 14, cursor: 'pointer' }}>
                    {showHistory ? t.hide : t.show} {t.history} ({entries.length} {t.records})
                  </button>
                  {showHistory && (
                    <div style={{ marginTop: 16, maxHeight: 300, overflowY: 'auto', background: 'rgba(255,255,255,0.4)', borderRadius: 12, padding: 12 }}>
                      {entries.slice().reverse().map((e, i) => (
                        <div key={e.id} style={{ padding: 12, borderBottom: i < entries.length-1 ? '1px solid rgba(139,92,246,0.1)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: '#64748b', fontSize: 13 }}>{e.date}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span>{emojis[e.moodScore-1]}</span>
                            <span style={{ color: '#94a3b8', fontSize: 12 }}>😴{e.sleep?.toFixed(1)}h | 💓{e.hrv?.toFixed(0)} {e.medication ? '| 💊' : ''}</span>
                            <button onClick={() => deleteEntry(e.id)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 14, cursor: 'pointer', padding: 4, opacity: .6 }} title={t.delete}>🗑️</button>
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

        <footer style={{ textAlign: 'center', marginTop: 32, padding: 20, color: '#94a3b8', fontSize: 12, lineHeight: 1.6 }}>
          <p>{t.disclaimer}</p>
          <p>{t.disclaimer2}</p>
        </footer>
      </div>
    </div>
  )
}
