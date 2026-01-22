import { GoogleGenAI, Type } from "@google/genai";
import { AppDefinition, AppSpecification, GeneratedFile, DesignSystem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to clean JSON output from LLM
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
 * AI CLIENT SERVICE
 * Abstracts the interaction with the LLM provider.
 */
export const aiClient = {
  
  /**
   * Generates a complete specification for the app including architecture and design system.
   */
  generateAppSpec: async (input: AppDefinition): Promise<AppSpecification> => {
    // 1. Generate Architecture Plan
    
    // Construct a rich prompt with structured data
    let structuredContext = "";
    if (input.entities && input.entities.length > 0) {
        structuredContext += `\nDATA ENTITIES (Database Models):\n${input.entities.map(e => `- ${e.name} (Fields: ${e.fields})`).join('\n')}`;
    }
    if (input.pages && input.pages.length > 0) {
        structuredContext += `\nSITE MAP (Pages):\n${input.pages.map(p => `- ${p.name} [Type: ${p.type}]`).join('\n')}`;
    }

    const planResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a Senior Software Architect. Analyze the following project definition and design a file structure for a modern React application.
      
      Project: ${input.name}
      Type: ${input.type}
      Features: ${input.features.join(', ')}
      Description: ${input.description}
      ${structuredContext}
      
      Step 1: Identify 3 key libraries needed.
      Step 2: List essential files. Always include 'App.tsx' as the entry point and a 'components' folder.
      Step 3: If entities are provided, create TypeScript interfaces for them in 'types.ts' or 'lib/types.ts'.
      
      Return JSON.
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
                }
              }
            },
            reasoning: { type: Type.STRING }
          }
        }
      }
    });
    
    const plan = JSON.parse(cleanJson(planResponse.text || "{}"));

    // 2. Generate Design System
    const designResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a Design System for a ${input.design.theme} style ${input.type}.
      Primary Color: ${input.design.primaryColor}.
      Return JSON matching the DesignSystem schema.`,
      config: { responseMimeType: "application/json" }
    });

    // Handle potential schema mismatch gracefully in real app, here we assume it matches
    const designSystem = JSON.parse(cleanJson(designResponse.text || "{}"));

    return {
      ...input,
      architecturePlan: plan,
      designSystem: designSystem,
      fileStructure: plan.files
    };
  },

  /**
   * Generates the actual source code files based on the specification.
   */
  generateFileSet: async (spec: AppSpecification): Promise<GeneratedFile[]> => {
    // For this simulation, we focus on generating the main App.tsx
    // In a full version, this would iterate over spec.fileStructure
    
    const model = 'gemini-3-pro-preview';
    const theme = spec.designSystem;

    const designContext = theme ? `
      DESIGN SYSTEM:
      - Colors: Bg ${theme.colors.background}, Fg ${theme.colors.foreground}, Primary ${theme.colors.primary}
      - Roundness: ${theme.layout.radius}
      - Font: ${theme.typography.fontSans}
      - Vibe: ${theme.metadata.styleVibe}
      Use Tailwind CSS class naming.
    ` : '';

    let structuredInfo = "";
    if (spec.entities?.length) structuredInfo += `\nENTITIES: ${JSON.stringify(spec.entities)}`;
    if (spec.pages?.length) structuredInfo += `\nPAGES: ${JSON.stringify(spec.pages)}`;

    const response = await ai.models.generateContent({
      model,
      contents: `
        Write the 'App.tsx' file for this project.
        
        NAME: ${spec.name}
        TYPE: ${spec.type}
        NAV STYLE: ${spec.design.navStyle}
        FEATURES: ${spec.features.join(', ')}
        DESCRIPTION: ${spec.description}
        ${structuredInfo}
        
        PLAN CONTEXT: ${spec.architecturePlan?.reasoning}
        
        ${designContext}
        
        Constraints:
        - Single file 'App.tsx' containing the full working app.
        - Use Lucide React icons.
        - Mock necessary data inside the component matching the Entities defined.
        - Implement navigation if multiple pages are defined.
        - Make it look polished and professional.
      `
    });

    const code = cleanJson(response.text || "").replace(/^```tsx|^```typescript|^```javascript|^```/g, '').replace(/```$/g, '');

    return [
      { name: 'App.tsx', type: 'file', content: code },
      { name: 'theme.json', type: 'file', content: JSON.stringify(spec.designSystem, null, 2) }
    ];
  },

  /**
   * Refines a specific file based on user instructions.
   */
  refineFile: async (file: GeneratedFile, instructions: string): Promise<GeneratedFile> => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `
        Update this code based on the request.
        
        CODE:
        ${file.content}
        
        REQUEST:
        ${instructions}
        
        Return the full updated file content only.
      `
    });
    
    const newContent = cleanJson(response.text || "").replace(/^```tsx|^```typescript|^```javascript|^```/g, '').replace(/```$/g, '');
    
    return { ...file, content: newContent };
  },

  /**
   * Compiles React code to a standalone HTML string.
   */
  compileToHtml: async (code: string): Promise<string> => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Convert this React/Tailwind code to a single HTML file using CDNs (React, ReactDOM, Babel, Tailwind).
      Add error handling script.
      Code: ${code}`
    });
    
    let html = cleanJson(response.text || "");
    html = html.replace(/^```html|^```/g, '').replace(/```$/g, '');
    
    // Inject error catcher if missing
    if (!html.includes('window.onerror')) {
       const script = `<script>window.onerror = function(e){ window.parent.postMessage({type:'PREVIEW_ERROR', message:e.toString()},'*'); };</script>`;
       html = html.replace('<head>', `<head>${script}`);
    }
    
    return html;
  },

  /**
   * Fixes runtime errors in the code.
   */
  fixCode: async (code: string, error: string): Promise<string> => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Fix this React code. Error: ${error}. \n\n Code: ${code} \n\n Return fixed code only.`
    });
    return cleanJson(response.text || "").replace(/^```tsx|^```typescript|^```javascript|^```/g, '').replace(/```$/g, '');
  },

  /**
   * Chat assistant.
   */
  chat: async (history: any[], message: string, context?: string) => {
    const model = 'gemini-3-pro-preview';
    const contents = [...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })), { role: 'user', parts: [{ text: message }] }];
    
    if (context) {
       // Prepend context to last message or system instruction
       contents[contents.length-1].parts.push({ text: `\nContext Code:\n${context}` });
    }

    const res = await ai.models.generateContent({
       model,
       contents: contents as any,
       config: { systemInstruction: "You are a coding assistant." }
    });
    return res.text || "Error";
  }
};