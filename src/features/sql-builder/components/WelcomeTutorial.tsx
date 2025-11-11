"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WelcomeTutorialProps {
  onComplete: () => void;
}

export default function WelcomeTutorial({ onComplete }: WelcomeTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const steps = [
    {
      title: "Welcome to SQL Query Builder",
      description: "Learn SQL visually with real-time feedback. Let me show you around!",
      action: "Start Tour",
    },
    {
      title: "Templates → Quick Start",
      description: "Click any template to load a complete example. Perfect for learning!",
      action: "Next",
    },
    {
      title: "Build Step-by-Step",
      description: "Select table → Choose columns → Add filters. The builder guides you through each step.",
      action: "Next",
    },
    {
      title: "Real-Time Preview",
      description: "See your SQL and results update instantly as you build. No database needed!",
      action: "Next",
    },
    {
      title: "Keyboard Shortcuts",
      description: "Ctrl+S (Cmd+S): Share query • Ctrl+Shift+R: Reset • Esc: Clear focus",
      action: "Got it!",
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handleSkip = () => {
    handleClose();
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleSkip}
          />

          {/* Tutorial Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-md bg-white dark:bg-[#1a1a1a] border-2 border-foreground/20 rounded-xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 px-6 py-4 border-b border-foreground/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground font-mono">
                        {steps[currentStep].title}
                      </h3>
                      <p className="text-[10px] text-foreground/50 font-mono">
                        Step {currentStep + 1} of {steps.length}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleSkip}
                    className="p-1 hover:bg-foreground/10 active:bg-foreground/15 active:scale-90 rounded transition-all"
                    aria-label="Skip tutorial"
                  >
                    <svg className="w-4 h-4 text-foreground/40 hover:text-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-sm text-foreground/80 leading-relaxed font-mono">
                      {steps[currentStep].description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-foreground/5 border-t border-foreground/10 flex items-center justify-between">
                {/* Progress Dots */}
                <div className="flex gap-1.5">
                  {steps.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentStep(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === currentStep
                          ? 'w-6 bg-primary'
                          : idx < currentStep
                          ? 'w-1.5 bg-primary/50'
                          : 'w-1.5 bg-foreground/20'
                      }`}
                      aria-label={`Go to step ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {currentStep > 0 && (
                    <button
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="px-3 py-1.5 text-xs font-mono text-foreground/60 hover:text-foreground hover:bg-foreground/5 active:bg-foreground/10 active:scale-95 rounded transition-all"
                    >
                      Back
                    </button>
                  )}
                  <button
                    onClick={handleNext}
                    className="px-4 py-1.5 text-xs font-mono font-semibold bg-primary hover:bg-primary/90 active:bg-primary/80 active:scale-95 text-white rounded transition-all shadow-sm"
                  >
                    {steps[currentStep].action}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

