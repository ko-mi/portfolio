'use client';

import { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component to catch and handle React errors gracefully.
 * 
 * Prevents the entire app from crashing when a component error occurs.
 * Displays a fallback UI and logs errors for debugging.
 * 
 * @example
 * ```tsx
 * <ErrorBoundary fallback={<div>Something went wrong</div>}>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 * 
 * @example
 * ```tsx
 * <ErrorBoundary onError={(error) => logToService(error)}>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error details for debugging
    console.error('Error caught by ErrorBoundary:', error);
    console.error('Error info:', errorInfo);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you could send this to an error tracking service
    // e.g., Sentry, LogRocket, etc.
  }

  render() {
    if (this.state.hasError) {
      // Render custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div
          style={{
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: 'var(--card)',
            borderRadius: '8px',
            margin: '2rem auto',
            maxWidth: '600px',
          }}
        >
          <h2 style={{ color: 'var(--text)', marginBottom: '1rem' }}>
            Something went wrong
          </h2>
          <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
            We encountered an unexpected error. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'var(--text)',
              color: 'var(--bg)',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Refresh Page
          </button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{ marginTop: '2rem', textAlign: 'left' }}>
              <summary style={{ cursor: 'pointer', color: 'var(--muted)' }}>
                Error Details (Dev Only)
              </summary>
              <pre
                style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  borderRadius: '4px',
                  overflow: 'auto',
                  fontSize: '0.875rem',
                  color: 'var(--text)',
                }}
              >
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
