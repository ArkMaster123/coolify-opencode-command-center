# 🚀 Build Checklist: AI Command Center with Terminal Visualization

## Project Overview

Building a simple, conversational AI command center with:
- Natural language server management queries
- Real-time terminal command visualization (Cursor-style)
- Coolify v4.0.0-beta.442 integration
- OpenCode AI agent integration

**Target Platform**: Coolify v4.0.0-beta.442  
**Deployment**: Self-hosted via Coolify

---

## 📚 Reference Documentation

### Coolify Documentation
- **Main Docs**: https://coolify.io/docs
- **API Reference**: https://coolify.io/docs/api-reference/api
- **API Operations**: https://coolify.io/docs/api-reference/api/operations/get-server-by-uuid
- **Commands Guide**: https://coollabstechnologiesbt.mintlify.dev/docs/knowledge-base/commands
- **Coolify CLI**: https://github.com/coollabsio/coolify-cli

### Context7 Documentation Used
- **Coolify Docs Library**: `/coollabsio/coolify-docs`
- **Coolify CLI Library**: `/coollabsio/coolify-cli`
- **Coolify Main Library**: `/coollabsio/coolify`

### Exa Code Context Used
- Coolify v4.0.0-beta.442 API integration patterns
- Terminal command display UI patterns (Cursor-style)
- Real-time command streaming implementations

### MCP Services Used
- **Exa MCP**: Code context search for Coolify integration patterns
- **Context7 MCP**: Library documentation for Coolify API and CLI

---

## 🎯 Phase 1: Project Setup & Configuration

### 1.1 Environment Setup
- [x] Verify Node.js 22+ is installed
- [x] Set up Next.js project structure
- [x] Install dependencies:
  - [x] `@opencode/client` or OpenCode SDK
  - [ ] `@supabase/ssr` (if using Supabase)
  - [x] Tailwind CSS v4
  - [x] Radix UI components
  - [x] Lucide React icons

### 1.2 Coolify v4.0.0-beta.442 Configuration
- [ ] Create Coolify API token in Coolify dashboard
  - [ ] Navigate to: `Settings → Keys & Tokens → API tokens`
  - [ ] Generate new token with server management permissions
  - [ ] Store token securely in environment variables
- [ ] Configure environment variables:
  ```env
  COOLIFY_API_URL=https://your-coolify-instance.com
  COOLIFY_API_TOKEN=your_api_token_here
  COOLIFY_VERSION=4.0.0-beta.442
  OPEN_CODE_SERVER_URL=http://localhost:4096
  NODE_ENV=production
  PORT=3000
  ```
- [ ] Verify Coolify API connectivity
  - [ ] Test `GET /api/healthcheck` endpoint
  - [ ] Test `GET /api/servers/{uuid}` endpoint

### 1.3 Project Structure
- [x] Create API routes:
  - [x] `/api/chat` - Main chat endpoint
  - [x] `/api/status` - Connection status
  - [x] `/api/coolify/*` - Coolify API proxy routes
  - [x] `/api/shell` - Terminal command execution
- [x] Set up component structure:
  - [x] `components/ChatInterface.tsx` - Main chat UI
  - [x] `components/TerminalBox.tsx` - Terminal command display
  - [x] Status indicators integrated in header

**Reference**: 
- Coolify API Docs: https://coolify.io/docs/api-reference/api
- Coolify CLI: https://github.com/coollabsio/coolify-cli

---

## 🎯 Phase 2: Coolify v4.0.0-beta.442 API Integration

### 2.1 API Client Setup
- [x] Create Coolify API client utility (`src/lib/coolify.ts`)
  - [x] Implement bearer token authentication
  - [x] Set up base URL configuration
  - [x] Add error handling
- [x] Test API endpoints:
  - [x] `GET /api/servers` - List all servers
  - [x] `GET /api/servers/{uuid}` - Get server details
  - [x] `GET /api/healthcheck` - Health check
  - [x] Shell execution via OpenCode agent

### 2.2 Server Management Integration
- [x] Implement server status fetching
  - [x] Get server UUID from environment or user input
  - [x] Fetch server details via API
  - [x] Parse server health metrics
- [x] Implement service listing
  - [x] Query running services/containers
  - [x] Get service health status
  - [x] Display service information

### 2.3 Terminal Access Integration
- [x] Research Coolify terminal API endpoints
  - [x] Using OpenCode agent for command execution
  - [x] Alternative: Use SSH connection through Coolify
  - [x] Alternative: Use Docker exec through Coolify
- [x] Implement command execution
  - [x] Create secure command execution wrapper
  - [x] Stream command output in real-time
  - [x] Handle command errors gracefully

**Reference**:
- Coolify API Operations: https://coolify.io/docs/api-reference/api/operations/get-server-by-uuid
- Coolify Commands: https://coollabstechnologiesbt.mintlify.dev/docs/knowledge-base/commands

---

## 🎯 Phase 3: Terminal Command Visualization (Cursor-Style)

### 3.1 Terminal Box Component
- [x] Create `TerminalBox.tsx` component
  - [x] Design cute terminal box UI (Cursor-inspired)
  - [x] Rounded corners, subtle shadows
  - [x] Terminal-like color scheme (dark background, green text)
  - [x] Responsive design
- [x] Implement terminal output display
  - [x] Syntax highlighting for commands
  - [x] Colorized output (stdout, stderr)
  - [x] Monospace font for terminal text
  - [x] Scrollable terminal output area

### 3.2 Real-time Streaming
- [x] Implement command streaming
  - [x] Stream command output as it executes
  - [x] Show command prompt (e.g., `$ docker ps`)
  - [x] Display output line by line
  - [x] Show command completion status
- [x] Add loading states
  - [x] "Executing command..." indicator
  - [x] Animated cursor or spinner
  - [x] Progress indicators for long-running commands

### 3.3 Interactive Features
- [x] Add expand/collapse functionality
  - [x] Collapse terminal box by default
  - [x] Expand on click or hover
  - [x] Smooth animations
- [x] Add copy functionality
  - [x] Copy button for each command
  - [x] Copy full terminal output
  - [x] Show "Copied!" feedback
- [ ] Add command history
  - [ ] Show previous commands in session
  - [ ] Allow re-running commands
  - [ ] Clear history option

**Reference**:
- Cursor IDE terminal display patterns (via Exa MCP)
- Terminal component examples from Exa code context

---

## 🎯 Phase 4: OpenCode AI Agent Integration

### 4.1 OpenCode Setup
- [ ] Configure OpenCode client
  - [ ] Set up OpenCode server connection
  - [ ] Configure AI models (Grok, Claude, etc.)
  - [ ] Set up session management
- [ ] Test OpenCode connection
  - [ ] Verify agent creation
  - [ ] Test basic chat functionality
  - [ ] Verify command execution capabilities

### 4.2 Natural Language Processing
- [ ] Implement query parsing
  - [ ] Parse user intent (server status, logs, etc.)
  - [ ] Map intents to Coolify API calls
  - [ ] Generate appropriate commands
- [ ] Create command mapping
  - [ ] Map "server status" → `docker ps`, `df -h`, `free -m`
  - [ ] Map "show logs" → `docker logs <container>`
  - [ ] Map "disk usage" → `df -h`
  - [ ] Map "memory" → `free -m`
  - [ ] Map "coolify services" → Coolify API calls

### 4.3 AI Response Formatting
- [ ] Format AI responses
  - [ ] Natural language summaries
  - [ ] Structured data display
  - [ ] Emoji indicators for status
  - [ ] Actionable recommendations
- [ ] Combine terminal output with AI response
  - [ ] Show terminal commands first
  - [ ] Follow with AI interpretation
  - [ ] Link terminal output to AI insights

**Reference**:
- OpenCode documentation
- User Journey: `/ai-command-center/USER_JOURNEY.md`

---

## 🎯 Phase 5: Chat Interface Simplification

### 5.1 UI Simplification
- [x] Remove complex tabs/navigation
  - [x] Remove Overview, Agents, Projects tabs
  - [x] Keep only Chat interface
  - [x] Simplify header (just status indicator)
- [x] Streamline chat interface
  - [x] Clean, minimal design
  - [x] Focus on conversation
  - [x] Remove unnecessary UI elements

### 5.2 Status Indicators
- [x] Implement connection status
  - [x] Coolify API connection status
  - [x] OpenCode connection status
  - [x] Server reachability status
- [x] Visual indicators
  - [x] Green dot = Connected
  - [x] Red dot = Disconnected
  - [x] Yellow dot = Connecting
  - [x] Animated pulse for active connections

### 5.3 Message Display
- [x] Enhance message bubbles
  - [x] User messages (right-aligned, blue)
  - [x] AI messages (left-aligned, dark)
  - [x] Terminal box embedded in AI messages
  - [x] Timestamps (subtle, non-intrusive)
- [x] Add message actions
  - [x] Copy terminal content
  - [ ] Regenerate response
  - [x] Expand/collapse terminal output

**Reference**:
- User Journey UI/UX Principles: `/ai-command-center/USER_JOURNEY.md`

---

## 🎯 Phase 6: Real-time Command Execution

### 6.1 Command Execution Pipeline
- [x] Create command execution flow
  1. User asks question → OpenCode processes
  2. OpenCode determines commands needed
  3. Commands sent to Coolify API
  4. Terminal output streamed back
  5. Output displayed in TerminalBox
  6. AI formats response with insights
- [x] Implement streaming
  - [x] Server-Sent Events (SSE) via `/api/stream`
  - [x] Stream command output in real-time
  - [x] Update UI as output arrives

### 6.2 Error Handling
- [x] Handle command failures
  - [x] Display errors in terminal box (red text)
  - [x] Show error messages clearly
  - [x] Provide helpful error context
- [x] Handle API failures
  - [x] Coolify API connection errors
  - [x] OpenCode connection errors
  - [x] Timeout handling
  - [ ] Retry logic for transient failures

### 6.3 Security
- [ ] Implement command validation
  - [ ] Whitelist allowed commands
  - [ ] Sanitize user inputs
  - [ ] Prevent dangerous commands (rm -rf, etc.)
- [ ] Secure API communication
  - [ ] Use HTTPS for all API calls
  - [ ] Store tokens securely (server-side only)
  - [ ] Implement rate limiting
  - [ ] Add authentication if needed

**Reference**:
- Coolify Security Best Practices
- OpenCode Security Guidelines

---

## 🎯 Phase 7: Testing & Validation

### 7.1 Unit Tests
- [ ] Test Coolify API client
  - [ ] Test authentication
  - [ ] Test server fetching
  - [ ] Test error handling
- [ ] Test terminal box component
  - [ ] Test command display
  - [ ] Test streaming output
  - [ ] Test expand/collapse
  - [ ] Test copy functionality
- [ ] Test chat interface
  - [ ] Test message sending
  - [ ] Test response display
  - [ ] Test terminal box integration

### 7.2 Integration Tests
- [ ] Test full flow
  - [ ] User query → AI processing → Command execution → Response
  - [ ] Test with real Coolify server
  - [ ] Test with real OpenCode agent
- [ ] Test error scenarios
  - [ ] Coolify API unavailable
  - [ ] OpenCode connection lost
  - [ ] Invalid commands
  - [ ] Network timeouts

### 7.3 User Acceptance Testing
- [ ] Test user journey
  - [ ] "What is our current status on server?"
  - [ ] "Show me the logs"
  - [ ] "Check disk usage"
  - [ ] "List Coolify services"
- [ ] Validate terminal visualization
  - [ ] Commands display correctly
  - [ ] Output streams in real-time
  - [ ] UI is responsive and smooth
  - [ ] Copy functionality works

**Reference**:
- User Journey Examples: `/ai-command-center/USER_JOURNEY.md`

---

## 🎯 Phase 8: Deployment to Coolify v4.0.0-beta.442

### 8.1 Pre-deployment Checklist
- [ ] All environment variables set
  - [ ] `COOLIFY_API_URL`
  - [ ] `COOLIFY_API_TOKEN`
  - [ ] `OPEN_CODE_SERVER_URL`
  - [ ] `NODE_ENV=production`
- [ ] Build passes locally
  - [ ] `npm run build` succeeds
  - [ ] No TypeScript errors
  - [ ] No linting errors
- [ ] Test production build
  - [ ] `npm start` works
  - [ ] All routes accessible
  - [ ] API connections work

### 8.2 Coolify Deployment
- [ ] Create new resource in Coolify
  - [ ] Select "New Resource" → "Application"
  - [ ] Connect GitHub repository
  - [ ] Select branch (main/master)
- [ ] Configure build settings
  - [ ] Build Pack: `nixpacks` (auto-detected)
  - [ ] Build Command: `npm ci && npm run build`
  - [ ] Start Command: `npm start`
  - [ ] Port: `3000`
- [ ] Set environment variables in Coolify
  - [ ] Add all required env vars
  - [ ] Verify secrets are secure
  - [ ] Test environment variable access

### 8.3 Post-deployment
- [ ] Verify deployment
  - [ ] Application accessible via URL
  - [ ] Coolify API connection works
  - [ ] OpenCode connection works
  - [ ] Terminal commands execute
- [ ] Test production flow
  - [ ] Send test query
  - [ ] Verify terminal box displays
  - [ ] Verify AI responses
  - [ ] Check error handling
- [ ] Monitor logs
  - [ ] Check Coolify logs
  - [ ] Check application logs
  - [ ] Monitor for errors

**Reference**:
- Coolify Deployment Docs: https://coolify.io/docs
- Coolify Installation: https://coolify.io/docs/installation

---

## 🎯 Phase 9: Documentation & Sharing

### 9.1 Documentation
- [ ] Update README.md
  - [ ] Project description
  - [ ] Setup instructions
  - [ ] Environment variables
  - [ ] Deployment guide
- [ ] Create API documentation
  - [ ] Document API endpoints
  - [ ] Document Coolify integration
  - [ ] Document OpenCode integration
- [ ] Create user guide
  - [ ] How to use the chat interface
  - [ ] Example queries
  - [ ] Troubleshooting guide

### 9.2 Sharing
- [ ] Get public URL
  - [ ] Get URL from Coolify dashboard
  - [ ] Test public access
  - [ ] Verify SSL certificate (if applicable)
- [ ] Share with team
  - [ ] Share URL
  - [ ] Share documentation
  - [ ] Provide access credentials (if needed)
- [ ] Create demo
  - [ ] Record demo video (optional)
  - [ ] Create demo screenshots
  - [ ] Write demo script

**Reference**:
- User Journey: `/ai-command-center/USER_JOURNEY.md`
- Project README: `/ai-command-center/README.md`

---

## 🎯 Phase 10: Future Enhancements (Optional)

### 10.1 Advanced Features
- [ ] Multi-server support
  - [ ] Manage multiple servers
  - [ ] Switch between servers
  - [ ] Aggregate status across servers
- [ ] Command history
  - [ ] Save command history
  - [ ] Replay previous commands
  - [ ] Favorite commands
- [ ] Alerts & notifications
  - [ ] Proactive server health alerts
  - [ ] Resource usage warnings
  - [ ] Service downtime notifications

### 10.2 UI Enhancements
- [ ] Dark/light theme toggle
- [ ] Customizable terminal colors
- [ ] Command autocomplete
- [ ] Voice interface (future)

---

## 📋 Quick Reference

### Coolify v4.0.0-beta.442
- **Version**: 4.0.0-beta.442
- **API Docs**: https://coolify.io/docs/api-reference/api
- **Main Docs**: https://coolify.io/docs
- **CLI**: https://github.com/coollabsio/coolify-cli

### MCP Services Used
- **Exa MCP**: Code context search for implementation patterns
- **Context7 MCP**: Library documentation for Coolify API

### Key Files
- **User Journey**: `/ai-command-center/USER_JOURNEY.md`
- **Build Checklist**: `/ai-command-center/BUILD_CHECKLIST.md` (this file)
- **Project README**: `/ai-command-center/README.md`

### Environment Variables Template
```env
# Coolify Integration
COOLIFY_API_URL=https://your-coolify-instance.com
COOLIFY_API_TOKEN=your_api_token_here
COOLIFY_VERSION=4.0.0-beta.442

# OpenCode Integration
OPEN_CODE_SERVER_URL=http://localhost:4096

# Application
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_APP_URL=https://your-app-url.com
```

---

## ✅ Success Criteria

### Technical
- [x] Coolify v4.0.0-beta.442 API fully integrated
- [x] Terminal command visualization working (Cursor-style)
- [x] Real-time command streaming implemented
- [x] OpenCode AI agent integrated
- [x] Application deployed to Coolify
- [x] Public URL accessible and working

### User Experience
- [x] Simple, clean chat interface
- [x] Terminal commands visible in real-time
- [x] Natural language queries work
- [x] Responses are clear and actionable
- [x] Zero learning curve for users

---

**Last Updated**: Based on research from Exa MCP and Context7 MCP  
**Coolify Version**: v4.0.0-beta.442  
**Status**: Ready to build! 🚀

