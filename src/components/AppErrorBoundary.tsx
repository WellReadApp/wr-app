import React from 'react';

interface State { hasError: boolean; error?: Error; info?: React.ErrorInfo }

export class AppErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('App crashed:', error, info);
    this.setState({ info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FCF8F5] p-6 text-center">
          <h1 className="text-2xl font-bold text-[#E87968] mb-4">Something went wrong</h1>
          <p className="text-gray-600 mb-4 text-sm max-w-md">The app encountered an unexpected error. Try refreshing the page. If it persists, copy the error details below and share them.</p>
          {this.state.error && (
            <pre className="bg-gray-900 text-gray-100 text-xs p-4 rounded-lg max-w-full overflow-auto text-left shadow-inner">
{this.state.error.message}\n{this.state.error.stack?.split('\n').slice(0,5).join('\n')}
            </pre>
          )}
          <button onClick={() => window.location.reload()} className="mt-6 bg-gradient-to-r from-[#F7B8A1] to-[#E87968] text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all">Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}
