import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish?.();
    }, 1200);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.35, ease: 'easeInOut' } }}
      className="fixed inset-0 z-50 bg-[#090A0F] flex flex-col items-center justify-center p-6 select-none"
    >
      <div className="flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative mb-6"
        >
          <div className="w-24 h-24 rounded-3xl bg-[#14171E] border border-white/10 flex items-center justify-center relative shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-[#55F130]/15 blur-xl rounded-full" />
            <div className="w-14 h-14 rounded-2xl bg-[#55F130] text-[#090A0F] flex items-center justify-center font-black text-2xl tracking-tighter shadow-lg shadow-[#55F130]/30 relative z-10">
              DW
            </div>
          </div>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -inset-1 rounded-3xl bg-[#55F130]/20 blur-md -z-10"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="text-2xl font-black tracking-tight text-white flex items-center gap-1.5"
        >
          <span>DayWise</span>
          <span className="w-2 h-2 rounded-full bg-[#55F130]" />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="text-xs text-[#8A92A0] font-medium mt-1.5 max-w-[220px]"
        >
          Plan your day. Track your progress.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="mt-8 flex items-center gap-1.5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#55F130] animate-pulse" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#55F130]/60 animate-pulse [animation-delay:200ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#55F130]/30 animate-pulse [animation-delay:400ms]" />
        </motion.div>
      </div>
    </motion.div>
  );
};
