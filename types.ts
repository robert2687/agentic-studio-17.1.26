export type AgentRole = 'planner' | 'architect' | 'designer' | 'coder' | 'compiler' | 'patcher' | 'idle';

export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
  isOpen?: boolean;
}

export interface GeneratedFile {
  name: string;
  content: string;
  type: 'file';
  path?: string;
}

export interface LogEntry {
  id: string;
  timestamp: number;
  source: AgentRole | 'system' | 'user';
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface DesignSystem {
  metadata: {
    appName: string;
    styleVibe: "Modern" | "Corporate" | "Playful" | "Brutalist" | "Minimalist";
  };
  colors: {
    background: string;
    foreground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    accent: string;
    muted: string;
    border: string;
  };
  layout: {
    radius: string;
    spacing: string;
    container: string;
  };
  typography: {
    fontSans: string;
    h1: string;
    h2: string;
    body: string;
  };
  components: {
    button: string;
    card: string;
    input: string;
  };
}

export type AppType = 'Dashboard' | 'Landing Page' | 'CRUD App' | 'Chat UI' | 'Form' | 'Other';
export type TechStack = 'React + Tailwind' | 'HTML + Tailwind' | 'Next.js (React)';
export type Platform = 'Web SPA' | 'Static Site';
export type ThemeVibe = 'Modern' | 'Corporate' | 'Playful' | 'Brutalist' | 'Minimalist';
export type NavStyle = 'Sidebar' | 'TopBar' | 'Minimal';

export interface Entity {
  id: string;
  name: string;
  fields: string; // Comma separated for simplicity in UI
}

export interface Page {
  id: string;
  name: string;
  type: 'list' | 'detail' | 'dashboard' | 'form' | 'landing';
}

export interface AppDefinition {
  name: string;
  type: AppType;
  platform: Platform;
  tech: TechStack;
  description: string;
  features: string[];
  entities: Entity[];
  pages: Page[];
  design: {
    theme: ThemeVibe;
    primaryColor: string;
    navStyle: NavStyle;
  };
}

export interface AppSpecification extends AppDefinition {
  architecturePlan?: any;
  designSystem?: DesignSystem;
  fileStructure?: any[];
}

export interface Project {
  id: string;
  name: string;
  definition: AppDefinition;
  createdAt: number;
  files: FileNode[];
  previewUrl: string;
  status: 'completed' | 'error' | 'draft';
}

export type ViewState = 'home' | 'wizard' | 'generating' | 'workspace' | 'projects' | 'settings';

export interface SimulationState {
  view: ViewState;
  status: 'idle' | 'running' | 'completed' | 'error';
  activeAgent: AgentRole;
  currentFile: string | null;
  files: FileNode[];
  logs: LogEntry[];
  messages: ChatMessage[];
  previewUrl: string;
  codeContent: string;
  previewContent: string | null;
  iteration: number;
  definition?: AppDefinition;
  projects: Project[];
}