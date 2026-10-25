import React, { Component } from 'react';
import { AlertTriangle, RefreshCw, Trash2, Terminal } from 'lucide-react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('🚨 [PayPulse Unhandled UI Exception Captured by ErrorBoundary]:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetStorageAndReload = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      console.info('PayPulse browser storage cleared successfully.');
    } catch (e) {
      console.warn('Failed to clear storage:', e);
    }
    window.location.href = '/';
  };

  toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || 'An unexpected rendering error occurred in the application.';
      const componentStack = this.state.errorInfo?.componentStack || '';

      return (
        <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex items-center justify-center p-4 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
          {/* Ambient background glows */}
          <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-xl w-full bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative z-10 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Something went wrong
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  PayPulse encountered an unhandled interface exception. Your saved bills and data in MongoDB remain secure.
                </p>
              </div>
            </div>

            {/* Error Message Box */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 mb-6 text-left">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-1.5">
                <Terminal className="w-3.5 h-3.5" />
                <span>Exception Details</span>
              </div>
              <p className="text-xs font-mono text-slate-300 break-words line-clamp-3">
                {errorMessage}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
              <button
                onClick={this.handleReload}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition cursor-pointer shadow-lg shadow-indigo-600/20"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Application</span>
              </button>
              <button
                onClick={this.handleResetStorageAndReload}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700/60 transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-amber-400" />
                <span>Clear Local Cache & Restart</span>
              </button>
            </div>

            {/* Stack trace toggle */}
            <div className="text-center sm:text-left pt-2 border-t border-slate-800/60">
              <button
                onClick={this.toggleDetails}
                className="text-xs text-indigo-400 hover:text-indigo-300 underline underline-offset-4 transition cursor-pointer"
              >
                {this.state.showDetails ? 'Hide technical diagnostics' : 'Show technical diagnostics'}
              </button>

              {this.state.showDetails && (
                <div className="mt-3 p-3 bg-slate-950 border border-slate-800/80 rounded-lg max-h-48 overflow-y-auto text-[11px] font-mono text-slate-400 text-left whitespace-pre-wrap">
                  {componentStack || this.state.error?.stack || 'No additional stack trace available.'}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
