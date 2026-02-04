"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AccordionItemProps {
  title: string;
  content: string;
  defaultOpen?: boolean;
  variant?: "light" | "dark";
}

export default function AccordionItem({ title, content, defaultOpen = false, variant = "light" }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const isDark = variant === "dark";

  return (
    <div className={`border-b-2 ${isDark ? "border-[#3A3A38]" : "border-[#C2BCB2]"}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex justify-between items-center text-left"
      >
        <h3 className={`text-lg font-bold uppercase tracking-widest ${isDark ? "text-[#F5F2EC]" : "text-[#1F1F1E]"}`}>
          {title}
        </h3>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-[#8B6A4F] text-2xl font-light"
        >
          +
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className={`pb-6 leading-relaxed ${isDark ? "text-[#D6D2C8]" : "text-[#3A3A38]"}`}>
              {content}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
