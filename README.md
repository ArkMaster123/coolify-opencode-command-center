# 🤖 AI Agent Command Center

A real-time dashboard for managing AI coding assistants with OpenCode integration.

## 🌟 Features

- **Real-time AI Chat** - Natural language conversations with OpenCode + Grok models
- **System Monitoring** - Live CPU, memory, and network statistics
- **Agent Management** - Control multiple AI assistants with status monitoring
- **Project Overview** - Track coding projects and Git statistics
- **Dark Theme UI** - Modern, responsive design with Tailwind CSS

## 🚀 Quick Start

### Local Development

```bash
npm install
npm run dev
# Visit http://localhost:3000
```

### Production Build

```bash
npm run build
npm start
```

## 🐳 Coolify Deployment (Nixpacks)

### 1. Add Environment Variables

In your Coolify service settings, add these **required** environment variables:

```
OPEN_CODE_SERVER_URL=http://142.132.171.59:4096
NODE_ENV=production
PORT=3000
NIXPACKS_NODE_VERSION=22
```

### 2. Repository Settings

- **Repository**: `https://github.com/ArkMaster123/coolify-opencode-command-center`
- **Branch**: `main`
- **Build Pack**: `Nixpacks` (auto-detected)

### 3. Build Settings

Coolify will automatically detect:
- **Node.js 22** (via nixpacks.toml)
- **npm ci** for dependencies
- **npm run build** for build
- **npm start** for production

### 4. Domains & Ports

- **Internal Port**: `3000`
- **Assign a domain** in Coolify (e.g., `ai-command-center.yourdomain.com`)

### 5. Deploy

1. Save the service configuration
2. Coolify will build using Nixpacks v1.41.0
3. Monitor the build logs for success
4. Access your dashboard at the assigned domain

### Troubleshooting

If deployment fails:
1. Check the build logs in Coolify
2. Ensure all environment variables are set
3. Verify OpenCode server is accessible: `http://142.132.171.59:4096`
4. Check that PORT=3000 is set

## 🔧 Configuration

### Environment Variables

- `OPEN_CODE_SERVER_URL` - Your OpenCode server URL (default: `http://142.132.171.59:4096`)
- `NODE_ENV` - Environment mode
- `PORT` - Port to run on (default: 3000)

## 🏗️ Architecture

- **Frontend**: Next.js 16 + TypeScript + Tailwind CSS
- **Backend**: Next.js API routes
- **AI Integration**: OpenCode SDK with Grok models
- **UI Components**: Radix UI + Lucide Icons
- **Styling**: Tailwind CSS v4

## 📁 Project Structure

```
src/
├── app/
│   ├── api/           # Server-side API routes
│   │   ├── chat/      # AI chat endpoint
│   │   ├── agents/    # Agent management
│   │   ├── projects/  # Project data
│   │   └── status/    # Connection status
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Main dashboard
├── components/        # React components
│   ├── ui/           # Reusable UI components
│   ├── ChatInterface.tsx
│   ├── SystemMonitor.tsx
│   ├── AgentManager.tsx
│   └── ProjectOverview.tsx
└── lib/
    └── utils.ts      # Utility functions
```

## 🔒 Security

- No hardcoded secrets or API keys
- Server-side API routes handle OpenCode communication
- Environment variables for configuration
- Clean separation of client/server code

## 🚀 Deployment Status

✅ **Build**: Successful (Next.js 16 + Turbopack)  
✅ **GitHub**: Repository created and pushed  
✅ **Docker**: Dockerfile included  
✅ **Coolify**: Ready for deployment  

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for your own AI command centers!

---

**Built with ❤️ for the AI coding community**