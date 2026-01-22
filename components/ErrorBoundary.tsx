import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    // Optional: Reset specific app state here if needed via props
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center h-full p-8 bg-ide-bg text-ide-text animate-in fade-in duration-300">
          <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-xl max-w-md w-full text-center shadow-2xl">
             <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="text-red-500" size={24} />
             </div>
             <h2 className="text-lg font-bold mb-2">Something went wrong</h2>
             <p className="text-sm text-ide-muted mb-6">
               The agentic process encountered a critical error.
             </p>
             
             {this.state.error && (
                <div className="text-left bg-black/20 p-3 rounded mb-6 overflow-auto max-h-32 border border-red-500/10">
                  <pre className="text-xs text-red-300 font-mono whitespace-pre-wrap break-all">
                    {this.state.error.toString()}
                  </pre>
                </div>
             )}

             <button 
               onClick={this.handleRetry}
               className="flex items-center justify-center gap-2 w-full py-2 bg-ide-accent hover:bg-ide-accentHover text-white rounded-lg transition-colors text-sm font-medium"
             >
               <RefreshCw size={14} /> Try Again
             </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}