"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VscTerminal } from "react-icons/vsc";
import { RiKey2Line, RiLockPasswordLine } from "react-icons/ri";
import { BiCodeBlock } from "react-icons/bi";
import { TbApi } from "react-icons/tb";

// Import tool components
import Terminal from "./tools/Terminal";
import ApiTester from "./tools/ApiTester";
import JwtDecoder from "./tools/JwtDecoder";
import HashGenerator from "./tools/HashGenerator";
import JsonFormatter from "./tools/JsonFormatter";

export default function DevToolbar() {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [terminalHeight, setTerminalHeight] = useState(300);

  // ESC key to close tool
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeTool) {
        setActiveTool(null);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [activeTool]);

  // Prevent background scroll when tool is open
  useEffect(() => {
    if (activeTool) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [activeTool]);

  const tools = [
    { id: "terminal", icon: VscTerminal, name: "Terminal", title: "Dev Terminal" },
    { id: "api", icon: TbApi, name: "API", title: "API Tester" },
    { id: "jwt", icon: RiKey2Line, name: "JWT", title: "JWT Decoder" },
    { id: "hash", icon: RiLockPasswordLine, name: "Hash", title: "SHA-256 Hash" },
    { id: "json", icon: BiCodeBlock, name: "JSON", title: "JSON Formatter" },
  ];

  return (
    <>
      {/* Full Width Bottom Toolbar */}
      <div className="fixed bottom-0 left-0 right-0 z-[55] backdrop-blur-xl bg-white dark:bg-warm-dark border-t-2 border-primary/40 dark:border-secondary/50 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] h-16">
        <div className="container mx-auto px-6 h-full flex items-center">
          <div className="flex items-center justify-between w-full">
            {/* Left: Branding */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground">
                <span className="text-primary">Dev</span> Tools
              </span>
              <span className="text-xs text-foreground/50 hidden md:block">
                Developer utilities by Prayash
              </span>
            </div>

            {/* Right: Tool Buttons */}
            <div className="flex items-center gap-2">
              {tools.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTool(activeTool === tool.id ? null : tool.id)}
                    className={`px-3 py-2 rounded-lg transition-all flex items-center gap-2 text-sm font-medium ${
                      activeTool === tool.id
                        ? "bg-gradient-to-r from-primary to-accent text-white shadow-md"
                        : "hover:bg-primary/10 text-foreground/70"
                    }`}
                    title={tool.title}
                  >
                    <IconComponent className="text-lg" />
                    <span className="hidden sm:inline">{tool.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop Overlay */}
      <AnimatePresence>
        {activeTool && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={() => setActiveTool(null)}
          />
        )}
      </AnimatePresence>

      {/* Tool Panels */}
      <AnimatePresence>
        {activeTool && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed left-0 right-0 z-[60] pointer-events-none"
            style={activeTool === "terminal" ? { bottom: "4rem", height: `${terminalHeight}px` } : { bottom: "4rem" }}
          >
            {/* Terminal - Full Width */}
            {activeTool === "terminal" && (
              <Terminal 
                terminalHeight={terminalHeight}
                setTerminalHeight={setTerminalHeight}
                onClose={() => setActiveTool(null)}
              />
            )}

            {/* API Tester - Full Width */}
            {activeTool === "api" && (
              <div className="w-full pointer-events-auto">
                <ApiTester onClose={() => setActiveTool(null)} />
              </div>
            )}

            {/* Other Tools - Full Width */}
            {activeTool !== "terminal" && activeTool !== "api" && (
              <div className="w-full pointer-events-auto">
                {activeTool === "jwt" && <JwtDecoder onClose={() => setActiveTool(null)} />}
                {activeTool === "hash" && <HashGenerator onClose={() => setActiveTool(null)} />}
                {activeTool === "json" && <JsonFormatter onClose={() => setActiveTool(null)} />}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
