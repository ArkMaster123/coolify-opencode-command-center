#!/bin/bash
# Emergency Disk Cleanup for Coolify Server (78.47.113.109)
# Run this on the Coolify server to free up disk space

echo "🚨 EMERGENCY DISK CLEANUP - Coolify Server"
echo "Current disk usage:"
df -h | grep -E "^/dev/sda"

echo ""
echo "🧹 Step 1: Cleaning Docker system..."
docker system prune -a --volumes -f

echo ""
echo "🧹 Step 2: Cleaning Docker build cache..."
docker builder prune -a -f

echo ""
echo "🧹 Step 3: Removing unused images..."
docker image prune -a -f

echo ""
echo "🧹 Step 4: Cleaning old logs..."
journalctl --vacuum-time=7d 2>/dev/null || true
find /var/log -type f -name "*.log" -mtime +7 -delete 2>/dev/null || true

echo ""
echo "🧹 Step 5: Cleaning PostgreSQL old data..."
docker exec -it coolify-db psql -U coolify -d coolify << 'PSQL'
-- Clean old sessions (older than 7 days)
DELETE FROM sessions WHERE last_activity < NOW() - INTERVAL '7 days';

-- Clean old deployment logs (older than 3 days)
DELETE FROM deployment_logs WHERE created_at < NOW() - INTERVAL '3 days';

-- Vacuum to reclaim space
VACUUM FULL;
PSQL

echo ""
echo "🧹 Step 6: Restarting database..."
docker restart coolify-db

echo ""
echo "📊 Final disk usage:"
df -h | grep -E "^/dev/sda"

echo ""
echo "✅ Cleanup complete! Check if you have enough space now."
