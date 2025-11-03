// Netlify Function: Submit Proposal to Board
// This function receives a proposal and gets responses from all board members

const fetch = require('node-fetch');

// Board member configuration
const getBoardConfig = () => {
  return {
    chairman: {
      role: 'Chairman',
      provider: process.env.CHAIRMAN_PROVIDER || 'groq',
      model: process.env.CHAIRMAN_MODEL || 'llama-3.1-70b-versatile',
      systemPrompt: 'You are the Chairman of the board. Your role is to make final, balanced decisions after considering all perspectives. Provide a clear recommendation with reasoning.',
      temperature: 0.3
    },
    ceo: {
      role: 'CEO',
      provider: process.env.CEO_PROVIDER || 'anthropic',
      model: process.env.CEO_MODEL || 'claude-sonnet-4.5',
      systemPrompt: 'You are the CEO. Focus on overall strategy, company vision, and long-term growth. Consider market positioning and competitive advantages.',
      temperature: 0.5
    },
    cfo: {
      role: 'CFO',
      provider: process.env.CFO_PROVIDER || 'groq',
      model: process.env.CFO_MODEL || 'llama-3.1-70b-versatile',
      systemPrompt: 'You are the CFO. Analyze financial implications, ROI, budgets, and financial risks. Provide concrete numbers and financial projections.',
      temperature: 0.2
    },
    cto: {
      role: 'CTO',
      provider: process.env.CTO_PROVIDER || 'groq',
      model: process.env.CTO_MODEL || 'llama-3.1-70b-versatile',
      systemPrompt: 'You are the CTO. Evaluate technical feasibility, scalability, security, and implementation complexity. Suggest technical approaches.',
      temperature: 0.4
    },
    cpo: {
      role: 'CPO',
      provider: process.env.CPO_PROVIDER || 'groq',
      model: process.env.CPO_MODEL || 'mixtral-8x7b-32768',
      systemPrompt: 'You are the CPO. Focus on user experience, product-market fit, features, and customer value. Think about user needs and product roadmap.',
      temperature: 0.7
    },
    cmo: {
      role: 'CMO',
      provider: process.env.CMO_PROVIDER || 'gemini',
      model: process.env.CMO_MODEL || 'gemini-1.5-flash',
      systemPrompt: 'You are the CMO. Analyze marketing strategy, brand positioning, customer acquisition, and market opportunities. Consider messaging and channels.',
      temperature: 0.8
    }
  };
};

// Get API key for provider
const getApiKey = (provider) => {
  const keyMap = {
    'groq': process.env.GROQ_API_KEY,
    'anthropic': process.env.ANTHROPIC_API_KEY,
    'openai': process.env.OPENAI_API_KEY,
    'together': process.env.TOGETHER_API_KEY,
    'nvidia': process.env.NVIDIA_API_KEY,
    'gemini': process.env.GOOGLE_API_KEY,
    'azure-openai': process.env.AZURE_OPENAI_API_KEY,
    'bedrock': process.env.AWS_ACCESS_KEY_ID
  };
  return keyMap[provider];
};

// Call LLM provider
async function callLLM(config, proposal) {
  const apiKey = getApiKey(config.provider);
  
  if (!apiKey) {
    throw new Error(`API key not found for provider: ${config.provider}`);
  }

  const messages = [
    { role: 'system', content: config.systemPrompt },
    { role: 'user', content: proposal }
  ];

  let response;
  let tokens = 0;
  
  try {
    switch(config.provider) {
      case 'groq':
        response = await callGroq(apiKey, config.model, messages, config.temperature);
        break;
      case 'anthropic':
        response = await callAnthropic(apiKey, config.model, messages, config.temperature);
        break;
      case 'openai':
        response = await callOpenAI(apiKey, config.model, messages, config.temperature);
        break;
      case 'gemini':
        response = await callGemini(apiKey, config.model, messages, config.temperature);
        break;
      case 'nvidia':
        response = await callNVIDIA(apiKey, config.model, messages, config.temperature);
        break;
      default:
        throw new Error(`Provider not implemented: ${config.provider}`);
    }
    
    return response;
    
  } catch (error) {
    console.error(`Error calling ${config.provider}:`, error);
    return {
      response: `[Error from ${config.role}: ${error.message}]`,
      tokens: 0,
      cost: '$0.00'
    };
  }
}

// Groq API call
async function callGroq(apiKey, model, messages, temperature) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      temperature: temperature,
      max_tokens: 500
    })
  });
  
  const data = await response.json();
  return {
    response: data.choices[0].message.content,
    tokens: data.usage?.total_tokens || 0,
    cost: '$0.00' // Groq is free
  };
}

// Anthropic API call
async function callAnthropic(apiKey, model, messages, temperature) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: model,
      max_tokens: 500,
      temperature: temperature,
      messages: messages.filter(m => m.role !== 'system'),
      system: messages.find(m => m.role === 'system')?.content || ''
    })
  });
  
  const data = await response.json();
  const tokens = data.usage?.input_tokens + data.usage?.output_tokens || 0;
  const cost = (tokens / 1000000) * 3.0; // Approximate
  
  return {
    response: data.content[0].text,
    tokens: tokens,
    cost: `$${cost.toFixed(4)}`
  };
}

// OpenAI API call
async function callOpenAI(apiKey, model, messages, temperature) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      temperature: temperature,
      max_tokens: 500
    })
  });
  
  const data = await response.json();
  const tokens = data.usage?.total_tokens || 0;
  const cost = (tokens / 1000000) * 2.5; // Approximate for GPT-4o
  
  return {
    response: data.choices[0].message.content,
    tokens: tokens,
    cost: `$${cost.toFixed(4)}`
  };
}

// Gemini API call
async function callGemini(apiKey, model, messages, temperature) {
  const prompt = messages.map(m => m.content).join('\n\n');
  
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: temperature,
        maxOutputTokens: 500
      }
    })
  });
  
  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text;
  
  return {
    response: text,
    tokens: data.usageMetadata?.totalTokenCount || 0,
    cost: '$0.00' // Free tier
  };
}

// NVIDIA API call
async function callNVIDIA(apiKey, model, messages, temperature) {
  const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      temperature: temperature,
      max_tokens: 500
    })
  });
  
  const data = await response.json();
  return {
    response: data.choices[0].message.content,
    tokens: data.usage?.total_tokens || 0,
    cost: '$0.00' // Free tier
  };
}

// Main handler
exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { proposal, includeChairman = true } = JSON.parse(event.body);
    
    if (!proposal) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Proposal is required' })
      };
    }

    const boardConfig = getBoardConfig();
    const responses = [];
    let totalCost = 0;

    // Get responses from all board members (except chairman for now)
    const members = ['ceo', 'cfo', 'cto', 'cpo', 'cmo'];
    
    for (const memberKey of members) {
      const config = boardConfig[memberKey];
      console.log(`Calling ${config.role}...`);
      
      const result = await callLLM(config, proposal);
      
      responses.push({
        role: config.role,
        provider: config.provider,
        model: config.model,
        response: result.response,
        tokens: result.tokens,
        cost: result.cost
      });
      
      // Add to total cost
      const costNum = parseFloat(result.cost.replace('$', '')) || 0;
      totalCost += costNum;
    }

    // Get chairman's final decision if requested
    if (includeChairman) {
      const config = boardConfig.chairman;
      
      // Compile all responses for chairman
      const boardSummary = responses.map(r => 
        `${r.role}: ${r.response}`
      ).join('\n\n');
      
      const chairmanPrompt = `Based on the following board discussion about this proposal:

PROPOSAL: ${proposal}

BOARD RESPONSES:
${boardSummary}

As Chairman, provide your final decision and recommendation.`;

      const result = await callLLM(config, chairmanPrompt);
      
      responses.push({
        role: 'Chairman',
        provider: config.provider,
        model: config.model,
        response: result.response,
        tokens: result.tokens,
        cost: result.cost
      });
      
      const costNum = parseFloat(result.cost.replace('$', '')) || 0;
      totalCost += costNum;
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        responses: responses,
        estimatedCost: `$${totalCost.toFixed(4)}`
      })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};
