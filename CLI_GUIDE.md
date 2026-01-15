# Agentic Studio - CLI Usage Guide

This guide demonstrates how to use the Agentic CLI for test generation and project management, achieving feature parity with Pythagora while maintaining the Agentic brand.

## Installation

```bash
npm install
```

## CLI Commands

### 1. Generate Unit Tests

Generate comprehensive unit tests for your code using AI:

```bash
# Generate tests for a specific function
npm run agentic generate-tests --func calculateTotal --path examples/utils.js

# Generate tests for all functions in a file
npm run agentic generate-tests --path examples/utils.js

# Specify custom output path
npm run agentic generate-tests --func validateEmail --path src/utils.js --output tests/utils.test.js
```

**What it does:**
- Analyzes your code using AST parsing
- Identifies function parameters, dependencies, and complexity
- Generates Jest test suites with:
  - Happy path tests
  - Edge case coverage
  - Error handling tests
  - Mocked dependencies
  - Comprehensive assertions

### 2. Expand Test Coverage

Improve existing test coverage by adding more test cases:

```bash
# Expand tests in a specific file
npm run agentic expand-tests --path tests/utils.test.js

# Target specific coverage percentage
npm run agentic expand-tests --path tests/ --coverage 95
```

**What it does:**
- Analyzes existing test suite
- Identifies gaps in coverage
- Generates additional test cases for:
  - Missing edge cases
  - Uncovered error scenarios
  - Complex conditional branches
  - Boundary conditions

### 3. Integration Test Generation

Create integration tests by capturing and replaying HTTP requests:

```bash
# Capture mode - record requests during app runtime
npm run agentic integration-tests --mode capture --port 3000

# Test mode - generate tests from captured data
npm run agentic integration-tests --mode test
```

**What it does:**
- **Capture mode**: Monitors HTTP/API requests made by your application
- **Test mode**: Generates Jest integration tests that:
  - Replay captured requests
  - Validate response structure
  - Check status codes and data
  - Mock external services

### 4. Project Management

Initialize new projects with scaffolding:

```bash
# Create a React project
npm run agentic init --name my-react-app --template react

# Create a Node.js backend
npm run agentic init --name my-api --template node

# Create a full-stack app
npm run agentic init --name my-fullstack --template fullstack
```

**Project templates include:**
- React: Vite + React + TypeScript + Jest
- Node: Express + ES modules + Jest
- Fullstack: React frontend + Express backend

List all projects:

```bash
npm run agentic projects
```

### 5. Start IDE Interface

Launch the Agentic Studio web IDE:

```bash
npm run agentic dev
```

This starts the browser-based IDE with:
- Multi-agent AI workflow
- Code generation
- Self-healing
- Test generation UI
- Live preview

## UI-Based Test Generation

1. **Start the IDE**: `npm run dev`
2. **Generate or write code** in the editor
3. **Click the "Tests" button** in the header
4. **Configure test generation**:
   - Choose test type: Unit, Integration, or TDD
   - Set target coverage percentage
   - Optionally specify function name
5. **Click "Generate Tests"**
6. **Review generated tests** in the file explorer

## Test-Driven Development (TDD) Workflow

The CLI supports TDD by generating tests before implementation:

```bash
# Describe what you want to build
echo "User authentication with email and password validation" > user-story.txt

# Generate TDD tests (will fail initially)
npm run agentic generate-tests --path user-story.txt --output tests/auth.test.js

# Implement the code to make tests pass
# Run tests: npm test
```

## Key Features (Pythagora Feature Parity)

### ✅ Command-Line Interface
- Complete CLI with multiple commands
- Test generation and expansion
- Project scaffolding
- Environment awareness

### ✅ Test Generation Workflow
- AI-powered unit test generation
- Integration test capture/replay
- Test expansion for coverage improvement
- TDD support (red-green-refactor)

### ✅ UI Integration
- Dedicated test generator panel
- Visual test type selection
- Coverage targeting
- Real-time test generation

### ✅ Multi-Agent Architecture
- Planner, Designer, Architect, Coder, Compiler, Patcher agents
- Self-healing error recovery
- AI chat assistant
- Design system generation

## Example Workflow

```bash
# 1. Initialize a new project
npm run agentic init --name todo-app --template react

# 2. Navigate to project
cd ~/.agentic/projects/todo-app

# 3. Install dependencies
npm install

# 4. Write some code (or use the IDE to generate it)
# src/utils/todoHelpers.js

# 5. Generate tests
npm run agentic generate-tests --path src/utils/todoHelpers.js

# 6. Expand coverage if needed
npm run agentic expand-tests --path tests/ --coverage 90

# 7. Run tests
npm test

# 8. Start IDE for visual development
npm run agentic dev
```

## Configuration

Set your Gemini API key in `.env.local`:

```
GEMINI_API_KEY=your_api_key_here
```

Or set as environment variable:

```bash
export GEMINI_API_KEY=your_api_key_here
```

## Tips

1. **Start with unit tests**: They're fastest to generate and run
2. **Use integration tests for APIs**: Perfect for endpoint testing
3. **Leverage TDD**: Write tests first, then implement
4. **Target realistic coverage**: 80-90% is usually sufficient
5. **Review generated tests**: AI is smart but verify the logic
6. **Iterate**: Use expand-tests to improve coverage over time

## Troubleshooting

**CLI not found:**
```bash
npm install  # Ensure dependencies are installed
```

**Test generation fails:**
- Check that GEMINI_API_KEY is set
- Verify the file path is correct
- Ensure the code has exportable functions

**Integration tests empty:**
- Run capture mode first before test mode
- Make sure your app is running during capture

## Learn More

- Full documentation: See README.md
- Example code: Check the examples/ directory
- Report issues: GitHub Issues
