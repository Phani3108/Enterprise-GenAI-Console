'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Maximize2, Link2, Download } from 'lucide-react';
import { initBridge, destroyBridge, requestExport } from '@/utils/postMessageBridge';
import { copyModuleLink } from '@/utils/clipboard';

interface ModuleFrameProps {
  url: string;
  title: string;
  color?: string;
  moduleOrigin: string;
  scenarioId?: string;
  onReady?: () => void;
}

export default function ModuleFrame({
  url,
  title,
  color = '#4F46E5',
  moduleOrigin,
  scenarioId,
  onReady,
}: ModuleFrameProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>(undefined);

  useEffect(() => {
    initBridge((toolId) => {
      setReady(true);
      setLoading(false);
      onReady?.();
    });

    timeoutRef.current = setTimeout(() => {
      if (loading) setLoading(false);
    }, 8000);

    return () => {
      destroyBridge();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleLoad = useCallback(() => {
    if (!ready) {
      setTimeout(() => setLoading(false), 500);
    }
  }, [ready]);

  const handleError = useCallback(() => {
    setLoading(false);
    setError(true);
  }, []);

  const handleCopyLink = async () => {
    const success = await copyModuleLink(url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRequestExport = () => {
    if (scenarioId) {
      requestExport(iframeRef.current, moduleOrigin, scenarioId);
    }
  };

  return (
    <div className="module-container h-full rounded-2xl border border-white/[0.06] bg-[#0F172A]/50 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-[#0B1020]/50">
        <div className="flex items-center gap-2.5">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: ready ? '#22C55E' : color, boxShadow: `0 0 8px ${ready ? '#22C55E60' : `${color}60`}` }}
          />
          <span className="text-xs font-medium text-[#F8FAFC]">{title}</span>
          {loading && <span className="text-[10px] text-[#64748B] ml-1">Connecting...</span>}
          {ready && <span className="text-[10px] text-emerald-500 ml-1">Ready</span>}
        </div>
        <div className="flex items-center gap-1">
          {scenarioId && (
            <button
              onClick={handleRequestExport}
              className="p-1.5 rounded-md hover:bg-white/[0.05] text-[#64748B] hover:text-[#94A3B8] transition-colors"
              title="Export from module"
            >
              <Download className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={handleCopyLink}
            className="p-1.5 rounded-md hover:bg-white/[0.05] text-[#64748B] hover:text-[#94A3B8] transition-colors relative"
            title="Copy module link"
          >
            <Link2 className="w-3 h-3" />
            {copied && (
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] text-emerald-400 bg-[#0F172A] px-1.5 py-0.5 rounded border border-white/[0.06] whitespace-nowrap">
                Copied
              </span>
            )}
          </button>
          <a
            href={url.replace('embed=1&', '').replace('&embed=1', '').replace('embed=1', '')}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-md hover:bg-white/[0.05] text-[#64748B] hover:text-[#94A3B8] transition-colors"
            title="Open standalone"
          >
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={() => {
              const el = document.querySelector('.module-container');
              if (el) el.requestFullscreen?.();
            }}
            className="p-1.5 rounded-md hover:bg-white/[0.05] text-[#64748B] hover:text-[#94A3B8] transition-colors"
            title="Fullscreen"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="flex-1 relative">
        <AnimatePresence>
          {loading && !error && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="loading-overlay"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div
                    className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: `${color}40`, borderTopColor: 'transparent' }}
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm text-[#94A3B8] font-medium">Loading AI Agent</p>
                  <p className="text-xs text-[#64748B] mt-0.5">{title}</p>
                </div>
                <div className="w-80 space-y-3 mt-2">
                  <div className="h-4 bg-white/[0.04] rounded animate-pulse" />
                  <div className="h-4 bg-white/[0.03] rounded animate-pulse w-3/4" />
                  <div className="h-20 bg-white/[0.02] rounded-lg animate-pulse" />
                  <div className="h-4 bg-white/[0.03] rounded animate-pulse w-1/2" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <span className="text-2xl">📡</span>
            </div>
            <div className="text-center">
              <p className="text-sm text-[#F8FAFC] font-medium">Agent Offline</p>
              <p className="text-xs text-[#64748B] mt-1 max-w-xs">
                Start the tool server or open standalone.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setError(false); setLoading(true); }}
                className="px-4 py-2 rounded-lg bg-white/[0.05] border border-white/[0.1] text-xs text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
              >
                Retry
              </button>
              <a
                href={url.replace('embed=1&', '').replace('&embed=1', '').replace('embed=1', '')}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-white/[0.05] border border-white/[0.1] text-xs text-[#94A3B8] hover:text-[#F8FAFC] transition-colors inline-flex items-center gap-1.5"
              >
                <ExternalLink className="w-3 h-3" />
                Open Standalone
              </a>
            </div>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            src={url}
            onLoad={handleLoad}
            onError={handleError}
            className="module-frame"
            title={title}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        )}
      </div>
    </div>
  );
}
