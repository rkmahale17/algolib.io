"use client";

import {
  ArrowRight,
  Check,
  Lightbulb,
  PenTool,
  Play,
} from "lucide-react";

import React from "react";
import { motion } from "framer-motion";
import logo from "@/assets/Rulo/rulo-hi.svg";

export function HeroFlowDiagram() {
  return (
    <div className="relative w-full max-w-[600px] h-[600px] mx-auto hidden lg:block">
      {/* Background glow for the center */}
      <div className="absolute top-[280px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-zinc-200/50 dark:bg-[#EAFF96]/5 rounded-full blur-[80px] pointer-events-none" />

      {/* SVG Dashed Connecting Path */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 600">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" className="fill-green-800/40 dark:fill-[#a3e639]/40" />
          </marker>
        </defs>
        <motion.path
          id="flow-path"
          d="M 140 100 L 415 100 Q 455 100 455 140 L 455 240 Q 455 280 415 280 L 170 280 Q 130 280 130 320 L 130 440 Q 130 480 170 480 L 450 480"
          fill="none"
          className="stroke-green-800/40 dark:stroke-[#a3e639] opacity-100 dark:opacity-40"
          strokeWidth="2"
          strokeDasharray="8 8"
          markerEnd="url(#arrowhead)"
        />

        {/* Animated glowing dots on the path */}
        {[0, -3, -6, -9, -12].map((delay, i) => (
          <circle
            key={i}
            r="6"
            className="fill-green-800 dark:fill-[#EAFF96] drop-shadow-[0_0_8px_rgba(22,101,52,0.5)] dark:drop-shadow-[0_0_15px_rgba(234,255,150,0.5)]"
          >
            <animateMotion dur="15s" repeatCount="indefinite" begin={`${delay}s`}>
              <mpath href="#flow-path" />
            </animateMotion>
          </circle>
        ))}
      </svg>

      {/* Central Node */}
      <div className="absolute top-[280px] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center z-20">
        <img src={typeof logo === "string" ? logo : (logo as any).src} alt="Rulo" className="w-24 h-24 animate-pulse drop-shadow-[0_0_15px_rgba(163,230,57,0.4)] mb-3" />
        <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-0.5">
          Understand
          <br />
          Deep
        </h3>
        <p className="text-xs text-zinc-500 dark:text-gray-400">
          Build intuition.
        </p>
      </div>

      {/* ── Shared badge style ──
          Number badge is now INLINE in the same flex row as the title,
          so it's always vertically centred with the heading text.      */}

      {/* 1. Read Card (Top Left) */}
      <motion.div
        className="absolute top-[40px] left-[40px] z-30 cursor-pointer hover:scale-105 transition-transform duration-300"
        onClick={() =>
          document.getElementById("playground")?.scrollIntoView({ behavior: "smooth" })
        }
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="w-[210px] bg-white dark:bg-[#111111]/90 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-2xl backdrop-blur-md">
          {/* Header row — badge + title inline */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-primary font-bold text-xs bg-primary/10 border border-primary/20 shrink-0 leading-none">
              1
            </div>
            <span className="text-zinc-900 dark:text-white font-semibold text-sm leading-none">
              Read
            </span>
            <span className="text-[10px] text-yellow-600 dark:text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded ml-auto">
              Medium
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Sorted array — find two numbers that sum to target.
          </p>
          <div className="mt-3 space-y-1 opacity-30">
            <div className="h-1 w-full bg-zinc-300 dark:bg-zinc-700 rounded-full" />
            <div className="h-1 w-2/3 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
          </div>
        </div>
      </motion.div>

      {/* 2. Visualize Card (Top Right) */}
      <motion.div
        className="absolute top-[30px] right-[40px] z-30 cursor-pointer hover:scale-105 transition-transform duration-300"
        onClick={() =>
          document.getElementById("visualize")?.scrollIntoView({ behavior: "smooth" })
        }
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="w-[210px] bg-white dark:bg-[#111111]/90 border border-primary/20 dark:border-primary/30 rounded-xl p-4 shadow-[0_0_20px_rgba(163,230,57,0.1)] backdrop-blur-md">
          {/* Header row */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-primary font-bold text-xs bg-primary/10 border border-primary/20 shrink-0 leading-none">
              2
            </div>
            <span className="text-zinc-900 dark:text-white font-semibold text-sm leading-none">
              Visualize
            </span>
          </div>
          <div className="flex justify-center gap-1 mb-3">
            <div className="w-8 h-8 border border-primary bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-zinc-900 dark:text-white text-xs relative">
              2
              <span className="absolute -bottom-4 text-[9px] text-zinc-500">L</span>
            </div>
            <div className="w-8 h-8 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-900 dark:text-white text-xs">7</div>
            <div className="w-8 h-8 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-900 dark:text-white text-xs">11</div>
            <div className="w-8 h-8 border border-primary bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-zinc-900 dark:text-white text-xs relative">
              15
              <span className="absolute -bottom-4 text-[9px] text-zinc-500">R</span>
            </div>
          </div>
          <div className="flex justify-end text-xs text-primary font-medium mt-5 mb-2">
            target = 9
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
              <Play className="w-2.5 h-2.5 text-primary ml-0.5" />
            </div>
            <div className="flex-1 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full relative">
              <div className="absolute left-0 top-0 h-full w-1/2 bg-primary rounded-full" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full shadow-[0_0_5px_#a3e639]" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3. Think Card (Middle Right) */}
      <motion.div
        className="absolute top-[230px] right-[40px] z-30 cursor-pointer hover:scale-105 transition-transform duration-300"
        onClick={() =>
          document.getElementById("thinkpad")?.scrollIntoView({ behavior: "smooth" })
        }
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="w-[210px] bg-white dark:bg-[#111111]/90 border border-zinc-200 dark:border-[#F97316]/30 rounded-xl p-4 shadow-[0_0_20px_rgba(249,115,22,0.1)] backdrop-blur-md relative">
          {/* Header row */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-primary font-bold text-xs bg-primary/10 border border-primary/20 shrink-0 leading-none">
              3
            </div>
            <span className="text-zinc-900 dark:text-white font-semibold text-sm leading-none">
              Think
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mt-1">
            Use two pointers. Move R left if sum &gt; target, L right if sum &lt; target.
          </p>
          <Lightbulb className="w-5 h-5 text-[#F97316] absolute bottom-3 right-3 opacity-40" />
        </div>
      </motion.div>

      {/* 4. Whiteboard Card (Bottom Right -> now Middle Left) */}
      <motion.div
        className="absolute top-[230px] left-[40px] z-30 cursor-pointer hover:scale-105 transition-transform duration-300"
        onClick={() =>
          document.getElementById("thinkpad")?.scrollIntoView({ behavior: "smooth" })
        }
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="w-[210px] bg-white dark:bg-[#111111]/90 border-2 border-dashed border-zinc-300 dark:border-[#A855F7]/30 rounded-xl p-3 shadow-2xl backdrop-blur-md">
          {/* Header row */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-primary font-bold text-xs bg-primary/10 border border-primary/20 shrink-0 leading-none">
              4
            </div>
            <span className="text-zinc-900 dark:text-white font-semibold text-sm leading-none">
              Whiteboard
            </span>
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mt-1">
            Sketch & draw ideas freely using <span className="text-zinc-900 dark:text-white font-semibold">Excalidraw</span>.
          </div>
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <PenTool className="w-3 h-3 text-primary" />
            <div className="w-2.5 h-2.5 rounded-full bg-primary ml-auto" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#F97316]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#A855F7]" />
          </div>
        </div>
      </motion.div>

      {/* 5. Code Card (Bottom Left) */}
      <motion.div
        className="absolute top-[420px] left-[40px] z-30 cursor-pointer hover:scale-105 transition-transform duration-300"
        onClick={() =>
          document.getElementById("playground")?.scrollIntoView({ behavior: "smooth" })
        }
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <div className="w-[210px] bg-white dark:bg-[#111111]/90 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl backdrop-blur-md overflow-hidden">
          {/* Header bar — badge + title inline */}
          <div className="px-3 py-2 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2 bg-zinc-50 dark:bg-black/50">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-primary font-bold text-xs bg-primary/10 border border-primary/20 shrink-0 leading-none">
              5
            </div>
            <span className="text-zinc-900 dark:text-white font-semibold text-sm leading-none">
              Code
            </span>
          </div>
          <div className="p-3 text-[11px] font-mono leading-relaxed text-zinc-700 dark:text-zinc-300">
            <span className="text-zinc-400 dark:text-zinc-500"># Two pointers</span>
            <br />
            <span className="text-[#A855F7]">while</span> l &lt; r:
            <br />
            &nbsp;&nbsp;<span className="text-[#A855F7]">if</span> s == target:
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#A855F7]">return</span> [l, r]
          </div>
          <div className="px-3 py-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-black/30">
            <div className="flex items-center gap-1 bg-primary/20 text-primary px-2 py-0.5 rounded text-[10px] font-medium">
              <Play className="w-2.5 h-2.5 fill-current" />
              Run
            </div>
            <div className="flex items-center gap-1 text-[10px] text-primary font-medium">
              <Check className="w-3 h-3" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* 6. Review Card (Middle Left -> now Bottom Right) */}
      <motion.div
        className="absolute top-[440px] right-[40px] z-30 cursor-pointer hover:scale-105 transition-transform duration-300"
        onClick={() =>
          document.getElementById("playground")?.scrollIntoView({ behavior: "smooth" })
        }
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
      >
        <div className="w-[210px] bg-white dark:bg-[#111111]/90 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-2xl backdrop-blur-md">
          {/* Header row */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-primary font-bold text-xs bg-primary/10 border border-primary/20 shrink-0 leading-none">
              6
            </div>
            <Lightbulb className="w-3.5 h-3.5 text-zinc-400 dark:text-gray-400 shrink-0" />
            <span className="text-sm font-semibold text-zinc-900 dark:text-white leading-none">
              Review
            </span>
          </div>
          <div className="flex flex-col gap-2 text-xs font-mono text-zinc-600 dark:text-gray-400">
            <div className="flex items-center justify-between bg-zinc-100 dark:bg-zinc-800/50 px-2 py-1 rounded border border-zinc-200 dark:border-zinc-800">
              <span>Time</span>
              <span className="text-primary font-semibold">O(n)</span>
            </div>
            <div className="flex items-center justify-between bg-zinc-100 dark:bg-zinc-800/50 px-2 py-1 rounded border border-zinc-200 dark:border-zinc-800">
              <span>Space</span>
              <span className="text-primary font-semibold">O(1)</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom Label */}
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center text-center z-20 pointer-events-none w-full">
        <div className="px-5 py-2 rounded-full bg-zinc-100/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 backdrop-blur-md shadow-sm whitespace-nowrap">
          <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Learning Flow
          </span>
        </div>
      </div>
    </div>
  );
}
