import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("SkillProof Application Error:", error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
      window.location.hash = '#/';
      window.location.reload();
    } catch (e) {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0b0f19] text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-white">Application Notice</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              SkillProof encountered a state synchronization notice:
            </p>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-left overflow-x-auto text-[11px] font-mono text-amber-300 max-h-32">
              {this.state.error?.message || "Render Error"}
            </div>
            <button
              onClick={this.handleReset}
              className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset State & Reload App</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
