import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50 bg-[#14171E]/90 border border-white/10 backdrop-blur-md text-[#8A92A0] text-[11px] font-semibold py-1 px-3.5 rounded-full shadow-lg flex items-center gap-1.5 animate-fadeIn">
      <WifiOff className="w-3 h-3 text-[#FF6D1F]" />
      <span>Offline Mode</span>
    </div>
  );
};
