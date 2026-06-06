/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
}: BottomSheetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Prevent background scroll when bottom sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle clicking outside close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="bottom-sheet-overlay" className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop Blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleBackdropClick}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Bottom Sheet Drawer Panel */}
          <motion.div
            ref={containerRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative z-10 w-full max-w-lg bg-brand-surface border-t border-brand-border rounded-t-3xl shadow-2xl overflow-hidden max-h-[88vh] flex flex-col"
          >
            {/* Native Drag Indicator and Header */}
            <div className="flex flex-col items-center pt-3 pb-4 px-6 border-b border-brand-border shrink-0">
              {/* Swipe/Drag Bar Indicator */}
              <div 
                className="w-12 h-1 bg-brand-text-secondary/40 rounded-full mb-3 cursor-pointer hover:bg-brand-text-secondary/60 transition"
                onClick={onClose}
              />
              
              <div className="flex items-center justify-between w-full">
                <h3 className="text-lg font-semibold text-brand-text-primary tracking-tight">{title}</h3>
                <button
                  onClick={onClose}
                  className="p-1 px-2 rounded-full text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-bg/60 transition duration-150 flex items-center cursor-pointer"
                  aria-label="Fechar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Bottom Sheet Content (Scrollable) */}
            <div className="overflow-y-auto px-6 py-5 max-h-full pb-10 flex-1">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
