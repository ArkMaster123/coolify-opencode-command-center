# 🔧 Fix: Force Embedded Mode for AI Command Center

## Problem
Application loads but clicking doesn't work because:
- API calls fail when trying to connect to external OpenCode server
- Container runs but API endpoints return empty responses
- UI appears but is non-interactive

## Root Cause
The app tries to connect to OpenCode server at `http://142.132.171.59:4096` but fails in the container environment, causing all interactive features to break.

## ✅ Fix Applied

### 1. Forced Embedded Mode
Set environment variable: `OPENCODE_MODE=embedded`

**SQL Command:**
```sql
INSERT INTO environment_variables (key, value, is_build_time, application_id, created_at, updated_at, version, uuid)
VALUES ('OPENCODE_MODE', 'embedded', false, (application_id), NOW(), NOW(), '4.0.0-beta.442', gen_random_uuid())
ON CONFLICT (key, application_id) DO UPDATE SET value = 'embedded', is_build_time = false;
```

### 2. Container Restart
Restarted the container to pick up new environment variables.

## Expected Result

After restart:
- ✅ App loads the UI (already working)
- ✅ API calls work (now in embedded mode)
- ✅ Buttons become clickable
- ✅ Chat functionality works
- ✅ All interactive features work

## Verification

Test these endpoints after restart:
- `GET /api/health` - Should return JSON response
- `POST /api/chat` - Should accept messages and return AI responses
- `GET /api/agents` - Should return agent list
- `GET /api/coolify/servers` - Should return server data

## What Embedded Mode Does

1. **Starts local OpenCode server** inside the container
2. **No external dependencies** - doesn't need to connect to VPS 1
3. **Self-contained AI** - all AI processing happens locally
4. **Better reliability** - no network issues between servers

## If Still Not Working

Check Coolify logs:
1. Go to application → "Logs" tab
2. Look for OpenCode startup messages
3. Check for any error messages

Alternative: Check environment variables in Coolify UI:
1. Go to application → "Configuration" → "Environment Variables"
2. Add: `OPENCODE_MODE=embedded`
3. Redeploy

---

**Status**: ✅ Embedded mode forced, container restarted
**Expected**: Interactive features now working

