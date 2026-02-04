"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AgeVerification() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem("ageVerified");
    if (!verified) {
      setIsVisible(true);
    }
  }, []);

  const handleYes = () => {
    localStorage.setItem("ageVerified", "true");
    setIsVisible(false);
  };

  const handleNo = () => {
    window.location.href = "https://www.google.com";
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-neutral-900 border border-white/10 rounded-lg p-8 max-w-md w-full text-center"
          >
            <img
              src="/palmetto_taps_logo.PNG"
              alt="Palmetto Taps"
              className="h-20 mx-auto mb-6"
            />

            <h2 className="text-2xl font-bold mb-2">Welcome, friend.</h2>
            <p className="text-white/60 mb-8">
              Before we pour, we gotta ask — are you 21 or older?
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleYes}
                className="bg-teal-500 hover:bg-teal-400 text-black font-semibold px-8 py-3 rounded transition-all duration-300 hover:scale-105"
              >
                Yes, let's go
              </button>
              <button
                onClick={handleNo}
                className="border border-white/30 hover:border-white text-white px-8 py-3 rounded transition-all duration-300"
              >
                Nope, not yet
              </button>
            </div>

            <p className="text-white/30 text-xs mt-6">
              By entering, you agree you're of legal drinking age.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
