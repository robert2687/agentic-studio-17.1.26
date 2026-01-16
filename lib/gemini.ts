import { GoogleGenAI, Type } from "@google/genai";
import { DesignSystem, ChatMessage } from "../types";

const ai = new GoogleGenAI( { apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY || "" } );

function cleanJson ( text: string )
{
  let cleaned = text.trim();
  if ( cleaned.startsWith( '```json' ) )
  {
    cleaned = cleaned.substring( 7 );
  } else if ( cleaned.startsWith( '```' ) )
  {
    cleaned = cleaned.substring( 3 );
  }
  if ( cleaned.endsWith( '```' ) )
  {
    cleaned = cleaned.substring( 0, cleaned.length - 3 );
  }
  return cleaned.trim();
}

/**
 * PLANNER AGENT
 * Uses Gemini 3 Flash with Search to plan the file structure.
 * Enforces use of Search Grounding for accurate info.
 */
export async function generateProjectPlan ( userPrompt: string )
{
  const model = 'gemini-1.5-flash';

  const response = await ai.models.generateContent( {
    model,
    contents: `You are a Senior Software Architect. Analyze the following user request and design a file structure for a modern React application using Tailwind CSS.

    User Request: "${ userPrompt }"

    Step 1: Use Google Search to identify the latest libraries, versions, or design patterns relevant to the request (e.g., "latest charting library for react", "crypto api free").
    Step 2: Return a list of essential files needed.

    - Always include 'App.tsx' as the entry point.
    - Include a 'components' folder.
    - Keep it simple but professional.
    `,
    config: {
      tools: [ { googleSearch: {} } ],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          files: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                type: { type: Type.STRING, enum: [ "file", "folder" ] },
                path: { type: Type.STRING, description: "e.g., src/components/Header.tsx" }
              },
              required: [ "name", "type", "path" ]
            }
          },
          reasoning: { type: Type.STRING }
        }
      }
    }
  } );

  const text = response.text || "{}";
  // Attempt to clean if model wraps in markdown
  return JSON.parse( cleanJson( text ) );
}

/**
 * VISUAL DESIGNER AGENT
 */
export async function generateDesignSystem ( userPrompt: string ): Promise<DesignSystem>
{
  const model = 'gemini-1.5-flash';

  const response = await ai.models.generateContent( {
    model,
    contents: `### ROLE
    You are a Lead UI/UX Designer specialized in creating **Design Systems** for modern web applications.

    ### INPUT
    User Prompt: "${ userPrompt }"

    ### OUTPUT FORMAT
    Return ONLY a valid JSON object matching the DesignSystem schema.
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          metadata: {
            type: Type.OBJECT,
            properties: {
              appName: { type: Type.STRING },
              styleVibe: { type: Type.STRING, enum: [ "Modern", "Corporate", "Playful", "Brutalist", "Minimalist" ] }
            }
          },
          colors: {
            type: Type.OBJECT,
            properties: {
              background: { type: Type.STRING },
              foreground: { type: Type.STRING },
              primary: { type: Type.STRING },
              primaryForeground: { type: Type.STRING },
              secondary: { type: Type.STRING },
              accent: { type: Type.STRING },
              muted: { type: Type.STRING },
              border: { type: Type.STRING }
            }
          },
          layout: {
            type: Type.OBJECT,
            properties: {
              radius: { type: Type.STRING },
              spacing: { type: Type.STRING },
              container: { type: Type.STRING }
            }
          },
          typography: {
            type: Type.OBJECT,
            properties: {
              fontSans: { type: Type.STRING },
              h1: { type: Type.STRING },
              h2: { type: Type.STRING },
              body: { type: Type.STRING }
            }
          },
          components: {
            type: Type.OBJECT,
            properties: {
              button: { type: Type.STRING },
              card: { type: Type.STRING },
              input: { type: Type.STRING }
            }
          }
        }
      }
    }
  } );

  return JSON.parse( cleanJson( response.text || "{}" ) );
}

/**
 * CODER AGENT
 */
export async function generateCode ( userPrompt: string, plan: any, theme?: DesignSystem )
{
  const model = 'gemini-1.5-pro';

  let designInstructions = "";
  if ( theme )
  {
    designInstructions = `
    You are building a component. You strictly adhere to the following DESIGN SYSTEM.

    COLORS:
    Primary: "${ theme.colors.primary }"
    Background: "${ theme.colors.background }"
    Foreground: "${ theme.colors.foreground }"

    Use Tailwind classes exactly as defined in the theme where applicable.
    `;
  }

  const response = await ai.models.generateContent( {
    model,
    contents: `You are a 10x React Developer. Write the code for the main 'App.tsx' file based on this request: "${ userPrompt }".

    Constraints:
    - Use React Functional Components.
    - Use Tailwind CSS for ALL styling.
    - Use 'lucide-react' for icons.
    - Write the FULL implementation in a single App.tsx file.
    - Do NOT use import statements for local files that don't exist.

    ${ designInstructions }

    Plan Context: ${ plan.reasoning }
    `,
  } );

  return response.text;
}

/**
 * ITERATIVE CODER AGENT
 * Refines existing code based on new instructions.
 */
export async function updateCode ( currentCode: string, userPrompt: string )
{
  const model = 'gemini-1.5-pro';

  const response = await ai.models.generateContent( {
    model,
    contents: `You are a Senior React Developer. Update the existing code based on the user's request.

    Current Code:
    ${ currentCode }

    User Request: "${ userPrompt }"

    Instructions:
    - Return the FULLY UPDATED App.tsx file content.
    - Do not omit existing functionality unless asked.
    - Maintain the single-file structure.
    `,
  } );

  return response.text;
}

/**
 * COMPILER AGENT (PREVIEW GENERATOR)
 * Injects error capturing for self-healing.
 */
export async function compileToHtml ( code: string )
{
  const model = 'gemini-1.5-flash';

  const response = await ai.models.generateContent( {
    model,
    contents: `You are a Build Engineer. Convert the following React/Tailwind code into a SINGLE, RUNNABLE HTML file.

    Code:
    ${ code }

    Instructions:
    - Use CDNs for React, ReactDOM, Babel, Tailwind.
    - Configure Tailwind to use 'class' strategy.
    - Root div id="root".
    - Script type="text/babel".
    - Mock 'lucide-react' by creating a global object 'lucide' or 'LucideReact' with simple SVG components for commonly used icons (User, Menu, Home, Settings, etc) BEFORE the main code runs.
    - Output ONLY the raw HTML string.
    `,
  } );

  let html = response.text || "";
  html = html.replace( /```html/g, '' ).replace( /```/g, '' );

  // Inject Error Capturing Script
  const errorScript = `
  <script>
    window.onerror = function(msg, url, lineNo, columnNo, error) {
      window.parent.postMessage({ type: 'PREVIEW_ERROR', message: msg.toString() }, '*');
    };
    window.addEventListener('unhandledrejection', function(event) {
      window.parent.postMessage({ type: 'PREVIEW_ERROR', message: event.reason.toString() }, '*');
    });
  </script>
  `;

  if ( html.includes( '<head>' ) )
  {
    html = html.replace( '<head>', `<head>${ errorScript }` );
  } else
  {
    html = `${ errorScript }${ html }`;
  }

  return html;
}

/**
 * PATCHER AGENT
 */
export async function fixCode ( code: string, error: string )
{
  const model = 'gemini-1.5-flash';
  const response = await ai.models.generateContent( {
    model,
    contents: `Fix the following React code which produced an error.

    Error: ${ error }

    Code:
    ${ code }

    Return ONLY the fixed code.
    `
  } );
  return response.text.replace( /```tsx/g, '' ).replace( /```/g, '' );
}

/**
 * CHAT ASSISTANT
 * Uses Gemini 3 Pro with context awareness.
 */
export async function chatWithAI ( history: ChatMessage[], newMessage: string, codeContext?: string )
{
  const model = 'gemini-1.5-pro';

  let systemInstruction = "You are a helpful AI assistant in the Agentic Studio IDE. You are an expert React developer.";

  if ( codeContext )
  {
    systemInstruction += `\n\nThe user is currently working on the following code:\n\`\`\`tsx\n${ codeContext }\n\`\`\``;
  }

  // Convert ChatMessage[] to Content[]
  const contents = history.map( msg => ( {
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [ { text: msg.text } ]
  } ) );

  // Add new message
  contents.push( {
    role: 'user',
    parts: [ { text: newMessage } ]
  } );

  const response = await ai.models.generateContent( {
    model,
    contents: contents as any,
    config: {
      systemInstruction
    }
  } );

  return response.text || "I couldn't generate a response.";
}

/**
 * TEST GENERATOR AGENT
 * Generates Jest test suites for code
 */
export async function generateTests ( code: string, testType: 'unit' | 'integration' | 'tdd', options?: {
  functionName?: string;
  targetCoverage?: number;
} )
{
  const model = 'gemini-3-pro-preview';

  let prompt = '';

  if ( testType === 'unit' )
  {
    prompt = `You are a Senior Test Engineer. Generate comprehensive Jest unit tests for this code:

\`\`\`typescript
${ code }
\`\`\`

${ options?.functionName ? `Focus on testing the function: ${ options.functionName }` : 'Generate tests for ALL exported functions' }

Requirements:
- Use Jest testing framework
- Test happy paths and edge cases
- Test error handling
- Mock external dependencies
- Target coverage: ${ options?.targetCoverage || 90 }%
- Include describe/it blocks
- Add meaningful test descriptions

Return ONLY the complete test file code.`;
  } else if ( testType === 'integration' )
  {
    prompt = `You are a Senior Test Engineer. Generate Jest integration tests for this API/component:

\`\`\`typescript
${ code }
\`\`\`

Requirements:
- Test API endpoints or component integration
- Verify request/response flows
- Test error scenarios
- Mock external services
- Use supertest for API testing
- Include setup/teardown

Return ONLY the complete test file code.`;
  } else
  {
    prompt = `You are a TDD expert. Generate Jest tests BEFORE implementation for this specification:

User Story/Requirements:
${ code }

Generate:
- Complete test suite structure
- Test cases for all requirements
- Expected behavior specifications
- Mock data and fixtures
- Tests that will initially fail (Red phase of TDD)

Return ONLY the complete test file code.`;
  }

  const response = await ai.models.generateContent( {
    model,
    contents: prompt
  } );

  let testCode = response.text || '';

  // Clean up code markers
  testCode = testCode.replace( /^```typescript/gm, '' ).replace( /^```javascript/gm, '' ).replace( /^```/gm, '' ).replace( /```$/gm, '' ).trim();

  return testCode;
}
