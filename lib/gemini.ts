import { GoogleGenAI, Type } from "@google/genai";
import { DesignSystem, ChatMessage, AppDefinition } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function cleanJson(text: string) {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return cleaned.trim();
}

/**
 * PLANNER AGENT
 * Uses Gemini 3 Flash with Search to plan the file structure based on strict requirements.
 */
export async function generateProjectPlan(definition: AppDefinition) {
  const model = 'gemini-3-flash-preview';
  
  const userPrompt = `
    App Type: ${definition.type}
    Platform: ${definition.platform}
    Tech Stack: ${definition.tech}
    Features: ${definition.features.join(', ')}
    Detailed Description: ${definition.description}
  `;

  const response = await ai.models.generateContent({
    model,
    contents: `You are a Senior Software Architect. Analyze the following project definition and design a file structure for a modern React application.
    
    Project Definition:
    ${userPrompt}
    
    Step 1: Use Google Search to identify the best libraries or patterns for this specific app type (e.g., charting libs for dashboards, animation libs for landing pages).
    Step 2: Return a list of essential files needed.
    
    - Always include 'App.tsx' as the entry point.
    - Include a 'components' folder.
    - If data is needed, create a 'lib/mockData.ts'.
    - Keep it simple but professional.
    `,
    config: {
      tools: [{ googleSearch: {} }], 
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
                type: { type: Type.STRING, enum: ["file", "folder"] },
                path: { type: Type.STRING, description: "e.g., src/components/Header.tsx" }
              },
              required: ["name", "type", "path"]
            }
          },
          reasoning: { type: Type.STRING, description: "Brief explanation of the architecture choice." }
        }
      }
    }
  });

  const text = response.text || "{}";
  return JSON.parse(cleanJson(text));
}

/**
 * VISUAL DESIGNER AGENT
 */
export async function generateDesignSystem(definition: AppDefinition): Promise<DesignSystem> {
  const model = 'gemini-3-flash-preview';

  const response = await ai.models.generateContent({
    model,
    contents: `### ROLE
    You are a Lead UI/UX Designer specialized in creating **Design Systems** for modern web applications.
    
    ### INPUT
    App Type: ${definition.type}
    Description: ${definition.description}
    Vibe: Auto-detect based on app type (e.g., Corporate for CRUD, Modern for Dashboard).

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
              styleVibe: { type: Type.STRING, enum: ["Modern", "Corporate", "Playful", "Brutalist", "Minimalist"] }
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
  });

  return JSON.parse(cleanJson(response.text || "{}"));
}

/**
 * CODER AGENT
 */
export async function generateCode(definition: AppDefinition, plan: any, theme?: DesignSystem) {
  const model = 'gemini-3-pro-preview';

  let designInstructions = "";
  if (theme) {
    designInstructions = `
    You are building a component. You strictly adhere to the following DESIGN SYSTEM.
    
    COLORS:
    Primary: "${theme.colors.primary}"
    Background: "${theme.colors.background}"
    Foreground: "${theme.colors.foreground}"
    
    Use Tailwind classes exactly as defined in the theme where applicable.
    `;
  }

  const prompt = `
    You are a 10x React Developer. Write the code for the main 'App.tsx' file based on this project definition.
    
    Type: ${definition.type}
    Features: ${definition.features.join(', ')}
    Description: ${definition.description}
    
    Constraints:
    - Use React Functional Components.
    - Use Tailwind CSS for ALL styling.
    - Use 'lucide-react' for icons.
    - Write the FULL implementation in a single App.tsx file.
    - Do NOT use import statements for local files that don't exist.
    - Mock data inside the file if needed.
    
    ${designInstructions}
    
    Plan Context: ${plan.reasoning}
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  return response.text;
}

/**
 * ITERATIVE CODER AGENT
 */
export async function updateCode(currentCode: string, userPrompt: string) {
  const model = 'gemini-3-pro-preview';
  
  const response = await ai.models.generateContent({
    model,
    contents: `You are a Senior React Developer. Update the existing code based on the user's request.
    
    Current Code:
    ${currentCode}
    
    User Request: "${userPrompt}"
    
    Instructions:
    - Return the FULLY UPDATED App.tsx file content.
    - Do not omit existing functionality unless asked.
    - Maintain the single-file structure.
    `,
  });

  return response.text;
}

/**
 * COMPILER AGENT
 */
export async function compileToHtml(code: string) {
  const model = 'gemini-3-flash-preview';

  const response = await ai.models.generateContent({
    model,
    contents: `You are a Build Engineer. Convert the following React/Tailwind code into a SINGLE, RUNNABLE HTML file.
    
    Code:
    ${code}
    
    Instructions:
    - Use CDNs for React, ReactDOM, Babel, Tailwind.
    - Configure Tailwind to use 'class' strategy.
    - Root div id="root".
    - Script type="text/babel".
    - Mock 'lucide-react' by creating a global object 'lucide' or 'LucideReact' with simple SVG components for commonly used icons.
    - Output ONLY the raw HTML string.
    `, 
  });

  let html = response.text || "";
  html = html.replace(/```html/g, '').replace(/```/g, '');

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
  
  if (html.includes('<head>')) {
    html = html.replace('<head>', `<head>${errorScript}`);
  } else {
    html = `${errorScript}${html}`;
  }

  return html;
}

/**
 * PATCHER AGENT
 */
export async function fixCode(code: string, error: string) {
  const model = 'gemini-3-flash-preview';
  const response = await ai.models.generateContent({
    model,
    contents: `Fix the following React code which produced an error.
    
    Error: ${error}
    
    Code:
    ${code}
    
    Return ONLY the fixed code.
    `
  });
  return response.text.replace(/```tsx/g, '').replace(/```/g, '');
}

/**
 * CHAT ASSISTANT
 */
export async function chatWithAI(history: ChatMessage[], newMessage: string, codeContext?: string) {
  const model = 'gemini-3-pro-preview';
  
  let systemInstruction = "You are a helpful AI assistant in the Agentic Studio IDE. You are an expert React developer.";
  
  if (codeContext) {
    systemInstruction += `\n\nThe user is currently working on the following code:\n\`\`\`tsx\n${codeContext}\n\`\`\``;
  }

  const contents = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }));
  
  contents.push({
    role: 'user',
    parts: [{ text: newMessage }]
  });

  const response = await ai.models.generateContent({
    model,
    contents: contents as any,
    config: {
        systemInstruction
    }
  });

  return response.text || "I couldn't generate a response.";
}