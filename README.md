<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Agentic Studio Pro

A self-healing, browser-native IDE simulation where AI agents architect, build, and fix applications in real-time. Now with powerful CLI tools for test generation and project management.

## Features

- 🤖 **Multi-Agent AI Workflow**: Planner, Designer, Architect, Coder, Compiler, and Patcher agents
- 🔧 **Self-Healing**: Automatic error detection and recovery
- 💬 **AI Assistant**: Chat with AI about your code
- 🧪 **Test Generation**: AI-powered unit, integration, and TDD test generation
- 📦 **Project Management**: CLI tools for project scaffolding and management
- 🎨 **Modern UI**: Dark mode IDE with resizable panels

## Run Locally (Web IDE)

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## CLI Usage

Agentic Studio includes a powerful command-line interface for test generation and project management.

### Test Generation

Generate unit tests for your code:
```bash
npm run agentic generate-tests --func functionName --path src/utils.ts
```

Expand existing test coverage:
```bash
npm run agentic expand-tests --path tests/ --coverage 95
```

Generate integration tests:
```bash
# Capture mode - records HTTP requests
npm run agentic integration-tests --mode capture --port 3000

# Test mode - generates tests from captured requests
npm run agentic integration-tests --mode test
```

### Project Management

Initialize a new project:
```bash
npm run agentic init --name my-app --template react
```

List all projects:
```bash
npm run agentic projects
```

Start the IDE:
```bash
npm run agentic dev
```

### Available Commands

- `generate-tests` (alias: `test`) - Generate unit tests for functions
- `expand-tests` - Expand existing test suite with additional cases
- `integration-tests` - Generate integration tests by capturing requests
- `init` - Initialize a new Agentic project
- `projects` - List all Agentic projects
- `dev` - Start the Agentic Studio IDE interface

Run `npm run agentic --help` for full documentation.

## Test Generation in the UI

1. Generate or write code in the editor
2. Click the "Tests" button in the header
3. Choose test type (Unit, Integration, or TDD)
4. Set target coverage
5. Click "Generate Tests"
6. Tests will be added to your project

## Architecture

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **AI**: Google Gemini (Flash & Pro models)
- **Icons**: Lucide React
- **CLI**: Commander.js + Chalk + Ora
- **Testing**: Jest (generated)

View your app in AI Studio: https://ai.studio/apps/drive/1oOlVgu2LbAF0YF-qz1Ps5JOQjDj73u9p
