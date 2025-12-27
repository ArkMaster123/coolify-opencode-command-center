# 🔑 Coolify API Setup Guide

## What You Need from Coolify

You need **2 things** from your Coolify instance:

1. **Coolify API URL** - Your Coolify instance URL
2. **Coolify API Token** - Authentication token for API access

---

## 📍 Where to Get Them

### Step 1: Get Your Coolify API URL

Your Coolify API URL is simply your Coolify instance URL. For example:
- `https://coolify.th3ark.com` (if you have a domain)
- `http://78.47.113.109:8000` (if using IP address)
- `http://localhost:8000` (if running locally)

**How to find it:**
- Check your Coolify dashboard URL
- It's the base URL where you access Coolify
- Usually port `8000` by default

### Step 2: Create API Token in Coolify Dashboard

1. **Log into your Coolify dashboard**
   - Go to your Coolify URL (e.g., `https://coolify.th3ark.com`)

2. **Navigate to API Settings**
   - Click on **Settings** (gear icon, usually top right)
   - Go to **Keys & Tokens** → **API tokens**
   - Or direct path: `Settings → Keys & Tokens → API tokens`

3. **Create New Token**
   - Click **"Create New Token"** or **"Generate Token"**
   - Give it a name (e.g., "AI Command Center")
   - Select permissions (usually "Full Access" or "Server Management")
   - Click **"Generate"** or **"Create"**

4. **Copy the Token** ⚠️
   - **IMPORTANT**: Copy the token immediately - you won't be able to see it again!
   - It will look something like: `coolify_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - Save it securely

---

## 📁 Where to Put Them

### For Local Development

Create a `.env.local` file in your project root:

```bash
# In ai-command-center directory
touch .env.local
```

Add these variables:

```env
# Coolify API Configuration
COOLIFY_API_URL=https://coolify.th3ark.com
COOLIFY_API_TOKEN=coolify_your_token_here

# OpenCode Configuration (for local dev)
OPENCODE_MODE=client
OPENCODE_SERVER_URL=http://127.0.0.1:4096

# Next.js
NODE_ENV=development
PORT=3000
```

### For Production (Coolify Deployment)

Add them as **Environment Variables** in Coolify:

1. **In Coolify Dashboard:**
   - Go to your **AI Command Center** service/resource
   - Click **Environment Variables** or **Settings**
   - Click **"Add Environment Variable"**

2. **Add these variables:**
   ```
   COOLIFY_API_URL=https://coolify.th3ark.com
   COOLIFY_API_TOKEN=coolify_your_token_here
   ```

3. **Or use the Coolify UI:**
   - Navigate to: `Your Service → Settings → Environment Variables`
   - Add each variable one by one
   - Click **"Save"**

---

## ✅ Verify It Works

### Test Locally

1. **Start your Next.js app:**
   ```bash
   npm run dev
   ```

2. **Check the API health endpoint:**
   ```bash
   curl http://localhost:3000/api/coolify/health
   ```

3. **Or test in browser:**
   - Go to: `http://localhost:3000`
   - Check if Coolify status shows "Connected" (green badge)

### Test API Directly

```bash
# Replace with your actual values
COOLIFY_API_URL="https://coolify.th3ark.com"
COOLIFY_API_TOKEN="coolify_your_token_here"

# Test health check
curl -H "Authorization: Bearer $COOLIFY_API_TOKEN" \
     $COOLIFY_API_URL/api/healthcheck

# Test servers endpoint
curl -H "Authorization: Bearer $COOLIFY_API_TOKEN" \
     $COOLIFY_API_URL/api/servers
```

---

## 🔒 Security Best Practices

1. **Never commit `.env.local` to Git**
   - It's already in `.gitignore`
   - Keep tokens secret!

2. **Use different tokens for different environments**
   - Local dev token
   - Production token
   - Each with appropriate permissions

3. **Rotate tokens regularly**
   - Delete old tokens in Coolify
   - Generate new ones
   - Update your `.env` files

4. **Use minimal permissions**
   - Only grant permissions needed
   - Don't use "Full Access" unless necessary

---

## 📋 Complete Environment Variables Template

### `.env.local` (Local Development)

```env
# Coolify API Configuration
COOLIFY_API_URL=https://coolify.th3ark.com
COOLIFY_API_TOKEN=coolify_your_token_here

# OpenCode Configuration
OPENCODE_MODE=client
OPENCODE_SERVER_URL=http://127.0.0.1:4096
DEFAULT_MODEL=opencode/grok-code

# Next.js
NODE_ENV=development
PORT=3000
```

### Production (Coolify Environment Variables)

```env
# Coolify API Configuration
COOLIFY_API_URL=https://coolify.th3ark.com
COOLIFY_API_TOKEN=coolify_your_token_here

# OpenCode Configuration (Embedded Mode)
OPENCODE_MODE=embedded
OPENCODE_PORT=4097
DEFAULT_MODEL=opencode/grok-code

# Next.js
NODE_ENV=production
PORT=3000
NIXPACKS_NODE_VERSION=22
```

---

## 🐛 Troubleshooting

### "Coolify not configured" Error

**Problem**: API returns "Coolify not configured"

**Solution**:
1. Check `.env.local` exists and has both variables
2. Restart Next.js dev server: `npm run dev`
3. Verify variable names are exact: `COOLIFY_API_URL` and `COOLIFY_API_TOKEN`

### "401 Unauthorized" Error

**Problem**: API returns 401 Unauthorized

**Solution**:
1. Check token is correct (no extra spaces)
2. Verify token hasn't expired
3. Regenerate token in Coolify dashboard
4. Check token has correct permissions

### "Connection Refused" Error

**Problem**: Can't connect to Coolify API

**Solution**:
1. Verify `COOLIFY_API_URL` is correct
2. Check Coolify is running and accessible
3. Test URL in browser: `https://coolify.th3ark.com/api/healthcheck`
4. Check firewall/network settings

---

## 📚 Reference Links

- **Coolify API Docs**: https://coolify.io/docs/api-reference/api
- **Coolify API Auth**: https://coolify.io/docs/api-reference/authorization
- **Coolify Dashboard**: Your Coolify instance URL

---

## ✅ Quick Checklist

- [ ] Logged into Coolify dashboard
- [ ] Navigated to `Settings → Keys & Tokens → API tokens`
- [ ] Created new API token
- [ ] Copied token (saved securely)
- [ ] Created `.env.local` file
- [ ] Added `COOLIFY_API_URL` and `COOLIFY_API_TOKEN`
- [ ] Tested API connection
- [ ] Verified "Connected" status in app

---

**That's it!** Once you have these two values, add them to `.env.local` and you're ready to go! 🚀

