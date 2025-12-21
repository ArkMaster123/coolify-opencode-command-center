#!/bin/bash

# Local Development Script for AI Command Center
# This starts OpenCode server and Next.js dev server

echo "🚀 Starting AI Command Center Local Development..."
echo ""

# Check if OpenCode is installed
if ! command -v opencode &> /dev/null; then
    echo "❌ OpenCode CLI not found!"
    echo "   Install it from: https://opencode.ai"
    exit 1
fi

echo "✅ OpenCode CLI found"

# Check if port 4096 is already in use
if lsof -i :4096 &> /dev/null; then
    echo "⚠️  Port 4096 already in use - OpenCode server may already be running"
else
    echo "🔧 Starting OpenCode server on port 4096..."
    opencode serve --hostname 127.0.0.1 --port 4096 &
    OPENCODE_PID=$!
    echo "   OpenCode server PID: $OPENCODE_PID"
    sleep 2
fi

# Verify OpenCode server is running
if curl -s http://127.0.0.1:4096/config > /dev/null 2>&1; then
    echo "✅ OpenCode server is running at http://127.0.0.1:4096"
else
    echo "❌ OpenCode server not responding. Check if it started correctly."
    exit 1
fi

echo ""
echo "🌐 Starting Next.js dev server..."
echo "   App will be available at: http://localhost:3000"
echo ""
echo "📌 Press Ctrl+C to stop both servers"
echo ""

# Start Next.js dev server
OPENCODE_MODE=client OPENCODE_SERVER_URL=http://127.0.0.1:4096 npm run dev

# Cleanup on exit
trap "echo 'Stopping servers...'; kill $OPENCODE_PID 2>/dev/null" EXIT

