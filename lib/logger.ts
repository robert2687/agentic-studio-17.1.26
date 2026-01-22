import { AgentRole, LogEntry } from "../types";

type LogLevel = 'info' | 'success' | 'error' | 'warning';

/**
 * Centralized Logger Service
 * Handles log distribution to UI subscribers and Console for debugging.
 */
class Logger {
  private listeners: ((entry: LogEntry) => void)[] = [];

  /**
   * Dispatches a log entry to all listeners.
   */
  public log(source: AgentRole | 'system' | 'user', message: string, type: LogLevel = 'info'): LogEntry {
    const entry: LogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      source,
      message,
      type
    };
    
    // Developer Console Logging
    if (process.env.NODE_ENV === 'development' || true) { // Always log to console in this demo environment
      const styles = {
        error: 'color: #ef4444; font-weight: bold;',
        success: 'color: #22c55e; font-weight: bold;',
        warning: 'color: #eab308; font-weight: bold;',
        info: 'color: #3b82f6;'
      };
      console.log(`%c[${source.toUpperCase()}] ${message}`, styles[type]);
    }

    this.notify(entry);
    return entry;
  }

  public error(source: AgentRole | 'system', message: string) {
    return this.log(source, message, 'error');
  }

  public success(source: AgentRole | 'system', message: string) {
    return this.log(source, message, 'success');
  }

  public subscribe(listener: (entry: LogEntry) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(entry: LogEntry) {
    this.listeners.forEach(l => l(entry));
  }
}

export const logger = new Logger();