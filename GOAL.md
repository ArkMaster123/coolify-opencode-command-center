# 🎯 GOAL: Embedded OpenCode AI Command Center

## Mission
Build an AI Command Center that runs **OpenCode INSIDE Coolify deployment** on VPS, providing a complete AI coding environment with real-time agent management, chat, and project monitoring.

## Architecture Overview

### Current Setup
- **VPS 1 (142.132.171.59)**: External OpenCode server (port 4096)
- **Coolify (coolify.th3ark.com)**: Deployment platform
- **VPS 2 (78.47.113.109)**: Command Center deployment target

### Target Architecture
```
┌─────────────────────────────────────────────────────────────┐
│ VPS 2 (78.47.113.109) - Coolify Deployment                  │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ AI Command Center Container                            │ │
│ │ ├─────────────────────────────────────────────────────┤ │ │
│ │ │ Next.js App (Port 3000)                             │ │ │
│ │ ├─────────────────────────────────────────────────────┤ │ │
│ │ │ EMBEDDED OpenCode Server (Port 4097)               │ │ │
│ │ │ - Real AI agents and models                         │ │ │
│ │ │ - Session management                                │ │ │
│ │ │ - Code generation and analysis                      │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Key Requirements

### ✅ Must-Haves
- [ ] **Embedded OpenCode**: Run OpenCode server INSIDE Coolify container
- [ ] **Real AI Integration**: Use `createOpencode()` to start server + client
- [ ] **Live Agents**: Display actual running OpenCode agents with real status
- [ ] **Real Chat**: Connect to embedded OpenCode for AI conversations
- [ ] **Real Projects**: Show actual OpenCode project data
- [ ] **Real Models**: Use actual configured AI models (not placeholders)

### 🎨 Features
- **Agent Dashboard**: Monitor running AI agents in real-time
- **AI Chat Interface**: Interactive conversations with OpenCode
- **Project Overview**: Track coding projects and sessions
- **System Monitoring**: Resource usage and performance metrics
- **Session Management**: Handle multiple AI conversations

## Implementation Plan

### Phase 1: Core OpenCode Integration
1. Replace `createOpencodeClient()` with `createOpencode()` in all API routes
2. Configure embedded server to run on port 4097 (avoid conflict with external server)
3. Update API routes to use local OpenCode instance
4. Add proper server lifecycle management

### Phase 2: Real Data Integration
1. Connect agents API to actual `opencode.app.agents()` results
2. Connect chat API to real session management
3. Connect projects API to actual project data
4. Remove all placeholder/simulated data

### Phase 3: UI Enhancements
1. Update agent cards to show real agent status
2. Enhance chat interface with session persistence
3. Add real project management features
4. Implement proper error handling and fallbacks

## Success Criteria

### Technical
- ✅ OpenCode server starts automatically in Coolify container
- ✅ All API endpoints use real OpenCode data (no placeholders)
- ✅ Agents list shows actual running agents
- ✅ Chat works with real AI responses
- ✅ Projects show real OpenCode project data

### User Experience
- ✅ No "404 page not found" errors
- ✅ Real-time agent status updates
- ✅ Persistent chat sessions
- ✅ Meaningful project insights
- ✅ Responsive and reliable performance

## Configuration

### Environment Variables
```env
# OpenCode Configuration
OPEN_CODE_MODE=embedded
OPEN_CODE_PORT=4097
OPEN_CODE_HOSTNAME=0.0.0.0

# AI Models (configured in opencode.json)
DEFAULT_MODEL=anthropic/claude-3-5-sonnet-20241022
FALLBACK_MODEL=openai/gpt-4
```

### Docker Considerations
- OpenCode needs sufficient resources for AI processing
- Persistent storage for sessions and project data
- Proper port mapping (4097 for OpenCode, 3000 for Next.js)

## Testing Strategy

### Unit Tests
- OpenCode server startup and configuration
- API route integrations with real data
- Error handling and fallbacks

### Integration Tests
- Full deployment in Coolify environment
- End-to-end chat functionality
- Agent lifecycle management
- Project data synchronization

## Success Metrics

- **Uptime**: >99% for both Next.js and OpenCode services
- **Response Time**: <2s for AI chat responses
- **Data Accuracy**: 100% real data (no placeholders in production)
- **User Satisfaction**: Seamless AI coding experience

---

**Status**: 🚧 **IN PROGRESS** - Currently connecting to external OpenCode server, need to embed locally.

**Next Action**: Replace `createOpencodeClient()` with `createOpencode()` in all API routes.
