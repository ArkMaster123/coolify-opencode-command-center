# 🔍 Comparison: pi-mono vs OpenCode for AI Command Center

## Use Case Context
Building a **simple AI command center** with:
- Natural language server management queries
- Real-time terminal command visualization (Cursor-style)
- Coolify v4.0.0-beta.442 integration
- Web-based chat interface
- Server status monitoring and command execution

---

## 📊 Feature Comparison Table

| Feature | **pi-mono** | **OpenCode** | **Winner for Our Use Case** |
|---------|-------------|--------------|----------------------------|
| **Architecture** | Monorepo with modular packages | Client/Server architecture | ⚖️ **Tie** - Both work |
| **Web UI Support** | ✅ Built-in web UI library (`@mariozechner/pi-web-ui`) | ❌ Terminal-first, no built-in web UI | 🏆 **pi-mono** - Better for web apps |
| **Terminal Visualization** | ✅ TUI library with differential rendering (`@mariozechner/pi-tui`) | ✅ Terminal-based, but no built-in web terminal display | 🏆 **pi-mono** - Better TUI/web UI support |
| **Coolify Integration** | ⚠️ Would need custom integration | ⚠️ Would need custom integration | ⚖️ **Tie** - Both need custom work |
| **Server Management** | ⚠️ Not built for server management | ⚠️ Not built for server management | ⚖️ **Tie** - Both need custom tools |
| **Command Execution** | ✅ Agent runtime with tool calling | ✅ Built-in command execution | ⚖️ **Tie** - Both support it |
| **LLM API Support** | ✅ Unified multi-provider API (OpenAI, Anthropic, Google, etc.) | ✅ Multiple model support | ⚖️ **Tie** - Both support multiple models |
| **Embedded Mode** | ✅ Can be embedded in apps | ✅ Supports embedded server mode | ⚖️ **Tie** - Both support embedding |
| **Session Management** | ✅ Built-in agent state management | ✅ Built-in session management | ⚖️ **Tie** - Both have it |
| **Terminal Command Display** | ✅ TUI with real-time rendering | ⚠️ Terminal output, but no web terminal box | 🏆 **pi-mono** - Better for web terminal display |
| **Next.js Integration** | ✅ TypeScript, can integrate with Next.js | ✅ TypeScript SDK, can integrate | ⚖️ **Tie** - Both work with Next.js |
| **Deployment** | ✅ Can deploy as npm packages | ✅ Can deploy embedded server | ⚖️ **Tie** - Both deployable |
| **MCP Support** | ❌ No MCP support (intentional) | ✅ Supports MCP | 🏆 **OpenCode** - Better for MCP tools |
| **Sub-agents** | ❌ No sub-agents (intentional) | ✅ Supports sub-agents | 🏆 **OpenCode** - More flexible |
| **Plan Mode** | ❌ No plan mode (YOLO by default) | ✅ Has plan/explore agents | 🏆 **OpenCode** - Better for complex tasks |
| **Background Bash** | ❌ No background bash | ✅ Supports background execution | 🏆 **OpenCode** - Better for long-running tasks |
| **Documentation** | ⚠️ Less mature, newer project | ✅ Well-documented, established | 🏆 **OpenCode** - Better docs |
| **Community** | ⚠️ Smaller (691 stars) | ✅ Larger (35K+ stars) | 🏆 **OpenCode** - Larger community |
| **Maturity** | ⚠️ Newer project (v0.27.2) | ✅ More established | 🏆 **OpenCode** - More mature |
| **Custom Tools** | ✅ Extensible tool system | ✅ Extensible tool system | ⚖️ **Tie** - Both extensible |
| **Terminal Output Streaming** | ✅ Real-time streaming in TUI | ✅ Real-time streaming | ⚖️ **Tie** - Both support streaming |
| **Web Components** | ✅ `@mariozechner/pi-web-ui` for React/web | ❌ No built-in web components | 🏆 **pi-mono** - Better for web UI |
| **API Design** | ✅ Clean, modular API | ✅ RESTful API | ⚖️ **Tie** - Both have good APIs |
| **TypeScript Support** | ✅ Full TypeScript | ✅ Full TypeScript | ⚖️ **Tie** - Both TypeScript |
| **Coolify Deployment** | ✅ Can deploy to Coolify | ✅ Can deploy to Coolify | ⚖️ **Tie** - Both deployable |

---

## 🎯 Detailed Analysis

### **pi-mono Advantages for Our Use Case**

1. **Built-in Web UI Library** 🏆
   - `@mariozechner/pi-web-ui` provides React/web components
   - Perfect for Next.js integration
   - Ready-made chat interface components
   - **Better fit for web-based command center**

2. **TUI with Differential Rendering** 🏆
   - `@mariozechner/pi-tui` designed for terminal visualization
   - Can be adapted for web terminal display
   - Real-time rendering capabilities
   - **Better for terminal command box visualization**

3. **Modular Architecture** 🏆
   - Pick and choose packages you need
   - `@mariozechner/pi-ai` for LLM API
   - `@mariozechner/pi-agent` for agent runtime
   - `@mariozechner/pi-web-ui` for web UI
   - **More flexible for custom integrations**

4. **Unified LLM API** 🏆
   - Single API for multiple providers
   - Easier to switch models
   - Consistent interface
   - **Simpler integration**

### **OpenCode Advantages for Our Use Case**

1. **Mature & Established** 🏆
   - 35K+ GitHub stars
   - Well-documented
   - Larger community
   - **More reliable for production**

2. **MCP Support** 🏆
   - Can integrate with MCP tools
   - Better for extending capabilities
   - **More extensible**

3. **Agent Types** 🏆
   - Build, Plan, Explore agents
   - Different modes for different tasks
   - **More flexible for complex workflows**

4. **Background Execution** 🏆
   - Supports long-running tasks
   - Better for server management tasks
   - **Better for async operations**

---

## 💡 Recommendation for Our Use Case

### **Winner: pi-mono** 🏆

**Why pi-mono is better for this project:**

1. **Web UI First** ✅
   - Built-in web UI components (`@mariozechner/pi-web-ui`)
   - Perfect for Next.js integration
   - Ready-made chat interface
   - **No need to build web UI from scratch**

2. **Terminal Visualization** ✅
   - TUI library can be adapted for web terminal display
   - Better suited for showing terminal commands in web UI
   - Real-time rendering capabilities
   - **Better for Cursor-style terminal box**

3. **Modular & Flexible** ✅
   - Use only what you need
   - `pi-ai` for LLM API
   - `pi-agent` for agent runtime
   - `pi-web-ui` for web interface
   - **Easier to customize for server management**

4. **Simpler Integration** ✅
   - Unified API design
   - Less complexity
   - **Faster to implement**

### **When to Use OpenCode Instead:**

- If you need MCP tool integration
- If you need sub-agents for complex workflows
- If you need plan mode for multi-step tasks
- If you need background bash execution
- If you prioritize maturity and community size

---

## 🚀 Migration Path (if switching to pi-mono)

### Phase 1: Replace OpenCode SDK
- [ ] Install `@mariozechner/pi-ai` for LLM API
- [ ] Install `@mariozechner/pi-agent` for agent runtime
- [ ] Install `@mariozechner/pi-web-ui` for web UI components

### Phase 2: Update API Routes
- [ ] Replace OpenCode client with pi-ai API
- [ ] Update chat endpoint to use pi-agent
- [ ] Integrate pi-web-ui components

### Phase 3: Terminal Visualization
- [ ] Use pi-tui concepts for terminal box
- [ ] Adapt TUI rendering for web display
- [ ] Implement real-time command streaming

### Phase 4: Coolify Integration
- [ ] Add Coolify API client
- [ ] Create custom tools for server management
- [ ] Integrate with pi-agent tool system

---

## 📚 Reference Links

### pi-mono
- **GitHub**: https://github.com/badlogic/pi-mono
- **Coding Agent**: https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent
- **Web UI**: https://github.com/badlogic/pi-mono/tree/main/packages/web-ui
- **AI Package**: https://github.com/badlogic/pi-mono/tree/main/packages/ai
- **Author's Blog**: https://mariozechner.at/posts/2025-11-30-pi-coding-agent/

### OpenCode
- **GitHub**: https://github.com/sst/opencode
- **Website**: https://opencode.ai
- **Documentation**: https://opencode.ai/docs

### Research Sources
- **Exa MCP**: Code context search for implementation patterns
- **Context7 MCP**: Library documentation
- **Web Search**: Comparison articles and documentation

---

## ✅ Final Verdict

**For this specific use case (web-based AI command center with terminal visualization):**

| Aspect | Recommendation |
|--------|----------------|
| **Best Fit** | 🏆 **pi-mono** - Better web UI support |
| **Easier Integration** | 🏆 **pi-mono** - Built-in web components |
| **Terminal Display** | 🏆 **pi-mono** - TUI library adaptable to web |
| **Production Ready** | 🏆 **OpenCode** - More mature |
| **Community Support** | 🏆 **OpenCode** - Larger community |

**Recommendation**: **Use pi-mono** if you prioritize web UI and terminal visualization. **Use OpenCode** if you prioritize maturity, MCP support, and complex agent workflows.

---

**Last Updated**: Based on research from Exa MCP and Context7 MCP  
**Research Date**: Current  
**Status**: Ready for decision! 🚀

