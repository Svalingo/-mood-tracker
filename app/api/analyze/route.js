import { NextResponse } from 'next/server'

const API_PROVIDERS = {
  openai: { baseUrl: 'https://api.openai.com/v1/chat/completions', parseResponse: d => d.choices[0].message.content },
  anthropic: { baseUrl: 'https://api.anthropic.com/v1/messages', parseResponse: d => d.content[0].text, extraHeaders: { 'anthropic-version': '2023-06-01' } },
  deepseek: { baseUrl: 'https://api.deepseek.com/chat/completions', parseResponse: d => d.choices[0].message.content },
  moonshot: { baseUrl: 'https://api.moonshot.cn/v1/chat/completions', parseResponse: d => d.choices[0].message.content },
  zhipu: { baseUrl: 'https://open.bigmodel.cn/api/paas/v4/chat/completions', parseResponse: d => d.choices[0].message.content },
  custom: { baseUrl: '', parseResponse: d => d.choices?.[0]?.message?.content || d.content?.[0]?.text || '' }
}

export async function POST(request) {
  try {
    const { provider, apiKey, model, customUrl, messages } = await request.json()
    
    const providerConfig = API_PROVIDERS[provider] || API_PROVIDERS.custom
    const baseUrl = provider === 'custom' ? customUrl : providerConfig.baseUrl
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }
    
    if (provider === 'anthropic') {
      headers['x-api-key'] = apiKey
      headers['anthropic-version'] = '2023-06-01'
      delete headers['Authorization']
    }
    
    let body
    if (provider === 'anthropic') {
      body = JSON.stringify({
        model,
        max_tokens: 1500,
        system: messages.find(m => m.role === 'system')?.content || '',
        messages: messages.filter(m => m.role !== 'system')
      })
    } else {
      body = JSON.stringify({ model, messages, max_tokens: 1500 })
    }
    
    const res = await fetch(baseUrl, { method: 'POST', headers, body })
    
    if (!res.ok) {
      const error = await res.text()
      return NextResponse.json({ error }, { status: res.status })
    }
    
    const data = await res.json()
    const content = providerConfig.parseResponse(data)
    
    return NextResponse.json({ content })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
