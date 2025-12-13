import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
          <div className="bg-destructive/10 p-4 rounded-full mb-4">
            <AlertCircle className="w-12 h-12 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
          <p className="text-muted-foreground mb-4 max-w-md">
            We encountered an unexpected error.
          </p>
          {this.state.error && (
             <div className="bg-muted p-4 rounded-md overflow-auto max-w-2xl w-full text-left font-mono text-xs border border-border mb-6">
                <p className="font-semibold text-destructive mb-2">Error Details:</p>
                {this.state.error.toString()}
             </div>
          )}
          <div className="flex gap-4">
            <Button
                variant="outline"
                onClick={() => window.location.href = '/'}
            >
                Go Home
            </Button>
            <Button
                onClick={() => window.location.reload()}
            >
                Refresh Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
