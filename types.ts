export type AgentRole = 'planner' | 'architect' | 'designer' | 'coder' | 'compiler' | 'patcher' | 'idle';

export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
  isOpen?: boolean;
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

export interface SimulationState {
  status: 'idle' | 'running' | 'completed' | 'error';
  activeAgent: AgentRole;
  currentFile: string | null;
  files: FileNode[];
  logs: LogEntry[];
  messages: ChatMessage[];
  previewUrl: string;
  codeContent: string;
  previewContent: string | null; // The actual HTML content for the iframe
  iteration: number;
}