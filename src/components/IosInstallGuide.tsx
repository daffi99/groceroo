import React, { useState, useEffect } from 'react';
import { Share, PlusSquare, X } from 'lucide-react';

export const IosInstallGuide: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if running on iOS Safari and not already in standalone mode
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as unknown as { standalone?: boolean }).standalone;
    const dismissed = localStorage.getItem('groceroo_ios_prompt_dismissed');

    if (isIos && !isStandalone && !dismissed) {
      setShowPrompt(true);
    }
  }, []);

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('groceroo_ios_prompt_dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-3 left-4 right-4 z-40 max-w-md mx-auto bg-slate-900/95 text-white p-3.5 rounded-2xl shadow-xl border border-slate-700/60 backdrop-blur-md animate-in slide-in-from-bottom">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src="/logo_groceroo.png"
            alt="Groceroo"
            className="w-9 h-9 rounded-xl object-cover shrink-0 shadow-xs"
          />
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Pasang Groceroo di iPhone</span>
            </h4>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
              Ketuk tombol <Share className="w-3.5 h-3.5 inline mx-0.5 text-blue-400" /> <strong>Bagikan</strong> lalu pilih <PlusSquare className="w-3.5 h-3.5 inline mx-0.5 text-slate-200" /> <strong>Tambah ke Layar Utama</strong>.
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-slate-400 hover:text-white p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
