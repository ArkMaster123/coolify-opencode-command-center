# 🚨 Coolify Disk Space Emergency Cleanup

## Problem
PostgreSQL database error: `No space left on device`
- **Server**: 78.47.113.109 (Coolify host)
- **Database**: PostgreSQL (Coolify's internal database)
- **Error**: Cannot extend database files due to full disk

## Immediate Actions Required

### Option 1: Clean Docker on Coolify Server (78.47.113.109)

SSH to the Coolify server and run:

```bash
# Check disk space
df -h

# Clean Docker system (removes unused images, containers, volumes)
docker system prune -a --volumes -f

# Clean Docker build cache
docker builder prune -a -f

# Remove unused images
docker image prune -a -f

# Check PostgreSQL database size
docker exec -it coolify-db psql -U coolify -d coolify -c "SELECT pg_size_pretty(pg_database_size('coolify'));"

# Clean old deployment logs (if accessible)
# This might require accessing Coolify's database directly
```

### Option 2: Via Coolify Dashboard

1. Go to: https://www.coolify.th3ark.com
2. Navigate to: **Settings** → **Servers** → **localhost** (or the Coolify server)
3. Look for: **Docker Cleanup** or **Maintenance** options
4. Run: **Force Docker Cleanup** if available

### Option 3: Database Cleanup (Advanced)

If you have database access:

```bash
# Connect to Coolify database
docker exec -it coolify-db psql -U coolify -d coolify

# Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 20;

# Clean old sessions (if safe)
DELETE FROM sessions WHERE last_activity < NOW() - INTERVAL '30 days';

# Clean old deployment logs
DELETE FROM deployment_logs WHERE created_at < NOW() - INTERVAL '7 days';

# Vacuum database
VACUUM FULL;
```

### Option 4: Expand Storage (If Possible)

If using Hetzner:
1. Check if storage volume can be expanded
2. Add additional storage volume
3. Move PostgreSQL data directory to larger volume

## Prevention

### Set Up Automatic Cleanup

Add to Coolify server cron or scheduled tasks:

```bash
# Daily Docker cleanup
0 2 * * * docker system prune -a --volumes -f

# Weekly database vacuum
0 3 * * 0 docker exec coolify-db psql -U coolify -d coolify -c "VACUUM;"
```

### Monitor Disk Space

```bash
# Add to monitoring
df -h | grep -E '^/dev/'
docker system df
```

## Quick Fix Script

Save this as `cleanup-coolify.sh` on the Coolify server:

```bash
#!/bin/bash
echo "🧹 Starting Coolify cleanup..."

# Stop non-essential services temporarily
echo "📦 Cleaning Docker..."
docker system prune -a --volumes -f

# Clean build cache
docker builder prune -a -f

# Check disk space
echo "💾 Disk space after cleanup:"
df -h | grep -E '^/dev/'

# Restart Coolify if needed
echo "🔄 Restarting Coolify..."
docker restart coolify-db 2>/dev/null || echo "Database restart skipped"

echo "✅ Cleanup complete!"
```

## Critical: Fix Your Deployment

Once disk space is freed, your AI Command Center deployment should work. The build fix (standalone mode) is already pushed to GitHub.

**After cleanup, redeploy your application in Coolify!**

---

**Last Updated**: 2025-12-21  
**Priority**: 🔴 CRITICAL - Blocks all deployments
