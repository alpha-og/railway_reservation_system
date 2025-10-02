import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });
    
    // Log error to console in development
    if (import.meta.env?.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
          <div className="card bg-base-100 shadow-xl max-w-lg w-full">
            <div className="card-body text-center">
              <div className="text-error mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <h2 className="card-title justify-center text-xl mb-4">
                Something went wrong
              </h2>
              
              <p className="text-base-content/70 mb-6">
                We're sorry, but something unexpected happened. Please try refreshing the page or go back to the previous page.
              </p>
              
              {import.meta.env?.DEV && this.state.error && (
                <div className="collapse collapse-arrow bg-base-200 mb-4">
                  <input type="checkbox" />
                  <div className="collapse-title text-sm font-medium">
                    Technical Details (Development)
                  </div>
                  <div className="collapse-content">
                    <div className="text-xs text-left bg-base-300 p-2 rounded font-mono overflow-auto max-h-32">
                      {this.state.error.toString()}
                      {this.state.errorInfo.componentStack}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="card-actions justify-center gap-2">
                <button 
                  className="btn btn-outline btn-sm"
                  onClick={() => window.history.back()}
                >
                  Go Back
                </button>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => window.location.reload()}
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;