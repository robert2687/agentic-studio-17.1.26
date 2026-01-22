import { aiClient } from './aiClient';
import { AppDefinition, SimulationState, FileNode } from '../types';
import { INITIAL_FILES } from './mockData';
import { logger } from './logger';

type StateUpdater = (update: Partial<SimulationState>) => void;

/**
 * Agent Orchestrator
 * Manages the sequential execution of AI agents to build the application.
 */
export const orchestrator = {
  
  /**
   * Starts the full generation sequence: Plan -> Design -> Code -> Build.
   */
  startGeneration: async (
    definition: AppDefinition, 
    updateState: StateUpdater
  ) => {
    try {
      updateState({ 
        view: 'workspace', 
        status: 'running', 
        logs: [], 
        files: INITIAL_FILES, 
        codeContent: '', 
        previewContent: null, 
        definition: definition 
      });

      // 1. Planner Agent
      updateState({ activeAgent: 'planner' });
      logger.log('system', 'Initializing Agent Swarm...');
      await wait(500);
      logger.log('planner', `Analyzing requirements for ${definition.name}...`);
      
      const spec = await aiClient.generateAppSpec(definition);
      logger.success('planner', 'Architecture and design system defined.');
      
      // 2. Designer Agent
      updateState({ activeAgent: 'designer' });
      await wait(800);
      logger.log('designer', `Applied theme: ${spec.designSystem?.metadata.styleVibe}`);

      // 3. Architect Agent (File Structure)
      updateState({ activeAgent: 'architect' });
      await wait(800);
      const fileStructure: FileNode[] = [
        ...INITIAL_FILES,
        {
          name: 'src',
          type: 'folder',
          isOpen: true,
          children: spec.fileStructure?.map((f: any) => ({ 
             name: f.name, 
             type: f.type === 'folder' ? 'folder' : 'file' 
          })) || []
        }
      ];
      updateState({ files: fileStructure });
      logger.success('architect', 'Project structure scaffolded.');

      // 4. Coder Agent
      updateState({ activeAgent: 'coder' });
      await wait(800);
      logger.log('coder', 'Generating component implementation...');
      
      const files = await aiClient.generateFileSet(spec);
      const mainApp = files.find(f => f.name === 'App.tsx');
      
      if (!mainApp) throw new Error("Coder failed to generate App.tsx");

      updateState({ 
        currentFile: 'App.tsx', 
        codeContent: mainApp.content 
      });
      logger.success('coder', 'Code generation complete.');

      // 5. Compiler Agent
      updateState({ activeAgent: 'compiler' });
      await wait(500);
      logger.log('compiler', 'Building application bundle...');
      
      const html = await aiClient.compileToHtml(mainApp.content);
      
      updateState({ 
        previewContent: html, 
        activeAgent: 'idle', 
        status: 'completed' 
      });
      logger.success('compiler', 'Build successful. App is live.');

      return { spec, files, html };

    } catch (error: any) {
      logger.error('system', `Generation failed: ${error.message}`);
      updateState({ status: 'error', activeAgent: 'idle' });
      throw error;
    }
  },

  /**
   * Refines existing code based on user prompt.
   */
  refineCode: async (
    currentCode: string, 
    userInstruction: string,
    updateState: StateUpdater
  ) => {
    try {
      updateState({ status: 'running', activeAgent: 'coder' });
      logger.log('user', `Update request: "${userInstruction}"`);
      
      logger.log('coder', 'Refining code...');
      const refinedFile = await aiClient.refineFile({ name: 'App.tsx', content: currentCode, type: 'file' }, userInstruction);
      
      updateState({ codeContent: refinedFile.content });
      logger.success('coder', 'Code updated.');
      
      updateState({ activeAgent: 'compiler' });
      const html = await aiClient.compileToHtml(refinedFile.content);
      
      updateState({ previewContent: html, status: 'completed', activeAgent: 'idle' });
      logger.success('compiler', 'Re-build successful.');
      
      return { content: refinedFile.content, html };

    } catch (error: any) {
      logger.error('system', `Refinement failed: ${error.message}`);
      updateState({ status: 'error', activeAgent: 'idle' });
      throw error;
    }
  },

  /**
   * Attempts to fix runtime errors.
   */
  healApp: async (
    currentCode: string,
    errorMsg: string,
    updateState: StateUpdater
  ) => {
    try {
      updateState({ status: 'running', activeAgent: 'patcher' });
      logger.log('patcher', 'Runtime error detected. Auto-fixing...', 'warning');
      
      const fixedCode = await aiClient.fixCode(currentCode, errorMsg);
      
      updateState({ codeContent: fixedCode });
      logger.log('patcher', 'Fix applied. Re-compiling...');
      
      updateState({ activeAgent: 'compiler' });
      const html = await aiClient.compileToHtml(fixedCode);
      
      updateState({ previewContent: html, status: 'completed', activeAgent: 'idle' });
      logger.success('system', 'Recovery successful.');
      
      return { content: fixedCode, html };

    } catch (error: any) {
      logger.error('patcher', `Healing failed: ${error.message}`);
      updateState({ status: 'error', activeAgent: 'idle' });
      throw error;
    }
  }
};

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));