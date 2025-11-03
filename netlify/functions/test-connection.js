// Netlify Function: Test API Connection
// Tests configured API providers to verify they're working

const fetch = require('node-fetch');

async function testProvider(provider, apiKey) {
  try {
    switch(provider) {
      case 'groq':
        return await testGroq(apiKey);
      case 'anthropic':
        return await testAnthropic(apiKey);
      case 'gemini':
        return await testGemini(apiKey);
      case 'openai':
        return await testOpenAI(apiKey);
      case 'nvidia':
        return await testNVIDIA(apiKey);
      default:
        return { success: false, error: 'Provider not implemented' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function testGroq(apiKey) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: 'test' }],
      max_tokens: 5
    })
  });
  
  if (response.ok) {
    return { success: true, provider: 'groq' };
  } else {
    const error = await response.text();
    return { success: false, error: error };
  }
}

async function testAnthropic(apiKey) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 10,
      messages: [{ role: 'user', content: 'test' }]
    })
  });
  
  if (response.ok) {
    return { success: true, provider: 'anthropic' };
  } else {
    const error = await response.text();
    return { success: false, error: error };
  }
}

async function testGemini(apiKey) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: 'test' }]
      }],
      generationConfig: {
        maxOutputTokens: 10
      }
    })
  });
  
  if (response.ok) {
    return { success: true, provider: 'gemini' };
  } else {
    const error = await response.text();
    return { success: false, error: error };
  }
}

async function testOpenAI(apiKey) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'test' }],
      max_tokens: 5
    })
  });
  
  if (response.ok) {
    return { success: true, provider: 'openai' };
  } else {
    const error = await response.text();
    return { success: false, error: error };
  }
}

async function testNVIDIA(apiKey) {
  const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'meta/llama-3.1-8b-instruct',
      messages: [{ role: 'user', content: 'test' }],
      max_tokens: 5
    })
  });
  
  if (response.ok) {
    return { success: true, provider: 'nvidia' };
  } else {
    const error = await response.text();
    return { success: false, error: error };
  }
}

exports.handler = async (event, context) => {
  const providers = {
    'groq': process.env.GROQ_API_KEY,
    'anthropic': process.env.ANTHROPIC_API_KEY,
    'gemini': process.env.GOOGLE_API_KEY,
    'openai': process.env.OPENAI_API_KEY,
    'nvidia': process.env.NVIDIA_API_KEY
  };

  const results = [];
  const workingProviders = [];
  
  for (const [provider, apiKey] of Object.entries(providers)) {
    if (apiKey) {
      console.log(`Testing ${provider}...`);
      const result = await testProvider(provider, apiKey);
      results.push({
        provider,
        ...result
      });
      if (result.success) {
        workingProviders.push(provider);
      }
    }
  }

  const allWorking = results.length > 0 && results.every(r => r.success);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      success: allWorking,
      totalProviders: results.length,
      workingProviders: workingProviders,
      results: results,
      message: allWorking 
        ? 'All providers working!' 
        : `${workingProviders.length}/${results.length} providers working`
    })
  };
};
