# Agentic Studio Pro

**Agentic Studio Pro** is a browser-native IDE simulation where a swarm of AI agents (Planner, Architect, Designer, Coder, Compiler) collaborate to build, refactor, and fix React applications in real-time.

## Features

- **Multi-Agent Architecture**: 
  - **Planner**: Analyzes requirements and searches the web for best practices.
  - **Architect**: Scaffolds file structure.
  - **Designer**: Creates a consistent Design System (Tailwind based).
  - **Coder**: Implements the logic in React.
  - **Compiler**: Bundles code into a runnable HTML artifact.
  - **Patcher**: Auto-detects runtime errors in the preview and fixes the code.

- **Self-Healing**: If the generated app crashes, the Patcher agent intercepts the error, analyzes the stack trace, and applies a fix automatically.

- **Visual IDE**:
  - Global Navigation Sidebar.
  - 4-Step Creation Wizard with structured data input.
  - Monaco-style Code Editor with syntax highlighting.
  - Live Preview Sandbox.
  - Terminal with Agent Trace and Chat Assistant.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- A valid Google Gemini API Key.

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set your API key in the environment variables.

### Running the App
```bash
npm start
```
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Architecture

The application uses a predictable state container pattern to manage the simulation state. The `Orchestrator` service (`lib/orchestrator.ts`) manages the lifecycle of the agents.

1. **User Input**: Collected via the Wizard.
2. **Orchestration**: The Orchestrator calls the `aiClient` to perform tasks sequentially.
3. **State Updates**: Agents update the global state (logs, files, status).
4. **Rendering**: The UI reflects the current state (e.g., highlighting the active agent).

## Testing

Unit tests are located in `tests/`.
To run tests (if configured):
```bash
npm test
```

## Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License.
