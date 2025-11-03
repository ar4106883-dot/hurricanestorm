// Netlify Function: Get Board Configuration
// Returns current board configuration and provider status

exports.handler = async (event, context) => {
  const config = {
    chairman: {
      provider: process.env.CHAIRMAN_PROVIDER || 'groq',
      model: process.env.CHAIRMAN_MODEL || 'llama-3.1-70b-versatile',
      cost: '$0.00',
      costTier: 'free'
    },
    ceo: {
      provider: process.env.CEO_PROVIDER || 'anthropic',
      model: process.env.CEO_MODEL || 'claude-sonnet-4.5',
      cost: '$3/M tokens',
      costTier: 'premium'
    },
    cfo: {
      provider: process.env.CFO_PROVIDER || 'groq',
      model: process.env.CFO_MODEL || 'llama-3.1-70b-versatile',
      cost: '$0.00',
      costTier: 'free'
    },
    cto: {
      provider: process.env.CTO_PROVIDER || 'groq',
      model: process.env.CTO_MODEL || 'llama-3.1-70b-versatile',
      cost: '$0.00',
      costTier: 'free'
    },
    cpo: {
      provider: process.env.CPO_PROVIDER || 'groq',
      model: process.env.CPO_MODEL || 'mixtral-8x7b-32768',
      cost: '$0.00',
      costTier: 'free'
    },
    cmo: {
      provider: process.env.CMO_PROVIDER || 'gemini',
      model: process.env.CMO_MODEL || 'gemini-1.5-flash',
      cost: '$0.00',
      costTier: 'free'
    }
  };

  // Check which providers are configured
  const activeProviders = new Set();
  const apiKeys = {
    'groq': process.env.GROQ_API_KEY,
    'anthropic': process.env.ANTHROPIC_API_KEY,
    'openai': process.env.OPENAI_API_KEY,
    'together': process.env.TOGETHER_API_KEY,
    'nvidia': process.env.NVIDIA_API_KEY,
    'gemini': process.env.GOOGLE_API_KEY
  };

  // Check which providers have API keys
  for (const [provider, key] of Object.entries(apiKeys)) {
    if (key) {
      activeProviders.add(provider);
    }
  }

  // Count free providers
  const freeProviders = Object.values(config).filter(m => m.costTier === 'free').length;

  // Estimate cost per 10K tokens
  const paidProviders = Object.values(config).filter(m => m.costTier !== 'free');
  let estimatedCost = 0;
  if (paidProviders.length > 0) {
    estimatedCost = paidProviders.length * 0.03; // Rough estimate
  }

  // Build member list
  const members = Object.entries(config).map(([role, cfg]) => ({
    role: role.toUpperCase(),
    ...cfg
  }));

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      members: members,
      activeProviders: Array.from(activeProviders),
      freeProviders: freeProviders,
      estimatedCost: `$${estimatedCost.toFixed(2)}`,
      configType: freeProviders === 6 ? 'All Free' : freeProviders > 3 ? 'Hybrid' : 'Premium'
    })
  };
};
