# 🚀 Complete Deployment Guide

## Deploy Raincloud in 3 Easy Steps

---

## Step 1: Get Your Free API Keys (5 minutes)

### Required (FREE):

#### 1. Groq (FREE - instant approval)
```
1. Go to: https://console.groq.com/keys
2. Sign up with Google/GitHub
3. Click "Create API Key"
4. Copy key (starts with gsk_)
```

#### 2. Google Gemini (FREE - instant)
```
1. Go to: https://ai.google.dev/
2. Click "Get API Key"
3. Create new key
4. Copy key (starts with AIza)
```

#### 3. NVIDIA NIM (FREE tier - instant)
```
1. Go to: https://build.nvidia.com/
2. Sign up
3. Generate API key
4. Copy key (starts with nvapi)
```

### Optional (Premium for CEO role):

#### 4. Anthropic Claude ($10-20/month)
```
1. Go to: https://console.anthropic.com/
2. Sign up and add payment
3. Create API key
4. Copy key (starts with sk-ant-)
```

**Save all keys somewhere safe!**

---

## Step 2: Deploy to Netlify (5 minutes)

### Method A: Deploy from GitHub (Recommended)

```bash
# 1. Push code to GitHub
git init
git add .
git commit -m "Initial Raincloud deployment"
git remote add origin YOUR_GITHUB_REPO
git push -u origin main

# 2. Go to Netlify
# Visit: https://app.netlify.com/
# Click "Add new site" → "Import an existing project"
# Select GitHub → Choose your repo
# Click "Deploy site"
```

### Method B: Deploy via Netlify CLI

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Login to Netlify
netlify login

# 3. Initialize site
netlify init

# 4. Deploy
netlify deploy --prod
```

### Method C: Drag & Drop

```bash
# 1. Build locally
npm install

# 2. Go to Netlify
# Visit: https://app.netlify.com/drop
# Drag the entire raincloud-app folder
# Done!
```

---

## Step 3: Configure Environment Variables (2 minutes)

### In Netlify Dashboard:

```
1. Go to: Site settings → Environment variables
2. Click "Add a variable"
3. Add each of these:
```

### Required Variables (Free Setup):

```bash
GROQ_API_KEY = gsk_xxxxx
GOOGLE_API_KEY = AIza_xxxxx
NVIDIA_API_KEY = nvapi_xxxxx
```

### Optional Variables (Hybrid Setup):

```bash
# Add Claude for CEO role
ANTHROPIC_API_KEY = sk-ant-xxxxx

# Customize providers per role
CEO_PROVIDER = anthropic
CEO_MODEL = claude-sonnet-4.5

CHAIRMAN_PROVIDER = groq
CFO_PROVIDER = groq
CTO_PROVIDER = nvidia
CPO_PROVIDER = groq
CMO_PROVIDER = gemini
```

### Click "Save" and redeploy!

```
Site overview → Trigger deploy
```

---

## ✅ Verify Your Deployment

### 1. Visit Your Site
```
Your site is live at: https://YOUR-SITE.netlify.app
```

### 2. Test Connection
```
Click "Settings" → "Test API Connection"
Should see: "✅ Connection successful!"
```

### 3. Submit Test Proposal
```
Enter: "Should we expand into Europe?"
Click "Submit to Board"
Wait 5-10 seconds
See responses from all board members
```

---

## 🎯 Configuration Options

### Option A: All Free ($0/month)
```bash
# Netlify Environment Variables:
GROQ_API_KEY=xxx
GOOGLE_API_KEY=xxx
NVIDIA_API_KEY=xxx

# That's it! Nothing else needed.
```

### Option B: Hybrid ($10-20/month)
```bash
# Add Anthropic for CEO:
ANTHROPIC_API_KEY=xxx
CEO_PROVIDER=anthropic

# Keep others free:
GROQ_API_KEY=xxx
NVIDIA_API_KEY=xxx
GOOGLE_API_KEY=xxx
```

### Option C: Cloud-Native
```bash
# If on AWS:
AWS_BEDROCK_ENABLED=true
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_REGION=us-east-1

# If on Azure:
AZURE_AI_STUDIO_KEY=xxx
AZURE_AI_STUDIO_ENDPOINT=xxx

# If on GCP:
GCP_PROJECT_ID=xxx
GCP_LOCATION=us-central1
```

---

## 🔧 Customization

### Change Board Member Roles

Edit in Netlify Environment Variables:

```bash
# CEO uses Claude (premium)
CEO_PROVIDER=anthropic
CEO_MODEL=claude-sonnet-4.5

# CFO uses Groq (free)
CFO_PROVIDER=groq
CFO_MODEL=llama-3.1-70b-versatile

# CTO uses NVIDIA (free)
CTO_PROVIDER=nvidia
CTO_MODEL=meta/llama-3.1-70b-instruct

# CMO uses Gemini (free)
CMO_PROVIDER=gemini
CMO_MODEL=gemini-1.5-flash
```

### Available Providers:
- `groq` - FREE, fast
- `nvidia` - FREE tier, GPU-optimized
- `gemini` - FREE tier, large context
- `anthropic` - Premium ($3/M tokens)
- `openai` - Premium ($2.5-30/M tokens)
- `together` - Cheap ($0.88/M tokens)
- `mistral` - Medium ($1-8/M tokens)

---

## 🆘 Troubleshooting

### "API key not found"
```
Solution: Add API keys to Netlify environment variables
Path: Site settings → Environment variables
```

### "Failed to submit proposal"
```
1. Check browser console (F12)
2. Verify API keys are correct
3. Try "Test Connection" button
4. Check provider status pages
```

### "Groq rate limit exceeded"
```
Solution: Add backup provider
Add: TOGETHER_API_KEY=xxx (cheap alternative)
```

### "Cost is too high"
```
Solution: Switch to free providers
Change: CEO_PROVIDER from 'anthropic' to 'groq'
Result: $0/month instead of $10-20/month
```

### "Deployment failed"
```
1. Check build logs in Netlify
2. Verify package.json is correct
3. Make sure netlify.toml exists
4. Try: netlify deploy --prod again
```

---

## 📊 Monitoring

### View Logs
```
Netlify Dashboard → Functions → View logs
See all API calls and responses
```

### Track Costs
```
Check "Session Cost" in UI footer
Estimate: Each decision costs $0.00-0.05
```

### Monitor Uptime
```
Netlify provides 99.9% uptime SLA
Check status: status.netlify.com
```

---

## 🔐 Security Checklist

- [x] API keys in environment variables (not code)
- [x] .env is in .gitignore
- [x] No keys committed to Git
- [x] HTTPS enabled (automatic on Netlify)
- [x] Serverless functions (backend hidden)

---

## 🚀 Advanced: Custom Domain

### Add Your Domain:

```
1. Buy domain (e.g., raincloud.com)
2. Netlify Dashboard → Domain settings
3. Add custom domain
4. Update DNS records
5. Wait 24-48 hours for propagation
```

---

## 📈 Scaling Tips

### For High Traffic:
1. Netlify auto-scales (no action needed)
2. Add caching headers
3. Use CDN (automatic)

### For Better Performance:
1. Use fastest providers (Groq, NVIDIA)
2. Reduce max_tokens in functions
3. Enable function caching

### For Lower Costs:
1. Use more free providers
2. Cache common responses
3. Set rate limits

---

## 🎓 Next Steps

### After Deployment:
1. ✅ Test with example proposals
2. ✅ Customize board member providers
3. ✅ Monitor costs in Settings panel
4. ✅ Share with team
5. ✅ Add custom domain (optional)

### To Improve:
1. Read COST_OPTIMIZATION.md
2. Try different provider combinations
3. Monitor response quality
4. Adjust based on needs

---

## 📞 Need Help?

### Resources:
- Check README.md for detailed info
- Read .env.example for all providers
- Review error messages carefully
- Test API keys individually

### Common Issues:
- Provider rate limits → Add backup provider
- High costs → Switch to free providers
- Slow responses → Use faster providers (Groq, NVIDIA)
- API errors → Verify keys in Netlify

---

## ✅ Deployment Checklist

### Before Deploy:
- [ ] Got API keys (Groq, NVIDIA, Gemini)
- [ ] Code is ready
- [ ] .env.example reviewed

### During Deploy:
- [ ] Pushed to GitHub (or using CLI/drag-drop)
- [ ] Site created on Netlify
- [ ] Environment variables added

### After Deploy:
- [ ] Tested connection
- [ ] Submitted test proposal
- [ ] Verified all board members respond
- [ ] Checked session cost

### Optional:
- [ ] Added custom domain
- [ ] Configured premium providers
- [ ] Customized board members
- [ ] Set up monitoring

---

## 🎉 You're Done!

Your Raincloud board is now live and ready to provide AI-powered insights!

**Site URL**: `https://YOUR-SITE.netlify.app`
**Cost**: $0-20/month
**Setup Time**: 10-15 minutes

---

**Questions? Check README.md or the docs/ folder!**
