import React from 'react';
import { Code2, Copy, Check } from 'lucide-react';

export const CodeEditor = ({
  code,
  onChange,
  readOnly = false,
  language = 'python',
  title = 'solution.py',
  badgeText = 'Editable',
  minHeight = '280px',
  actions = null,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = code.split('\n').length;

  return (
    <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col shadow-xl">
      {/* Editor Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs font-mono text-slate-300">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-brand-400" />
          <span className="font-semibold text-slate-200">{title}</span>
          <span className="text-[10px] text-slate-400 uppercase bg-slate-800 px-1.5 py-0.5 rounded">
            {language}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {actions}
          {badgeText && (
            <span className="text-[10px] font-bold text-brand-300 px-2 py-0.5 rounded bg-brand-500/20 border border-brand-500/30">
              {badgeText}
            </span>
          )}
          <button
            onClick={handleCopy}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="flex relative font-mono text-xs overflow-hidden" style={{ minHeight }}>
        {/* Line Numbers */}
        <div className="py-4 pl-3 pr-2 bg-slate-950/80 select-none text-slate-400 text-right font-mono border-r border-slate-800/60 leading-relaxed text-[11px]">
          {Array.from({ length: Math.max(lineCount, 12) }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Textarea or Pre */}
        <textarea
          value={code}
          onChange={(e) => onChange && onChange(e.target.value)}
          readOnly={readOnly}
          spellCheck={false}
          className="w-full h-full p-4 bg-transparent text-slate-200 focus:outline-none resize-none leading-relaxed font-mono selection:bg-brand-600/40"
          style={{ minHeight }}
        />
      </div>
    </div>
  );
};
