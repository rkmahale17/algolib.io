"use client";

import {
  ArrowRight,
  BookOpen,
  Brain,
  Check,
  Code2,
  Eye,
  Lightbulb,
  Pause,
  PenTool,
  Play,
} from "lucide-react";

import React from "react";
import { motion } from "framer-motion";

export function HeroFlowDiagram() {
  return (
    <div className="relative w-full max-w-[800px] aspect-square mx-auto hidden lg:block">
      {/* Background glow for the center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#EAFF96]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* SVG Dashed Connecting Circle */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 800">
        <motion.circle
          cx="400"
          cy="400"
          r="280"
          fill="none"
          stroke="#a3e639"
          strokeWidth="2"
          strokeDasharray="8 8"
          strokeOpacity="0.4"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        />
        {/* Animated glowing dots on the path */}
        <motion.circle
          cx="400"
          cy="120"
          r="6"
          fill="#EAFF96"
          className="shadow-[0_0_15px_#EAFF96]"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          style={{ transformOrigin: "400px 400px" }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <motion.circle
          cx="400"
          cy="120"
          r="6"
          fill="#EAFF96"
          className="shadow-[0_0_15px_#EAFF96]"
          initial={{ rotate: 120 }}
          animate={{ rotate: 480 }}
          style={{ transformOrigin: "400px 400px" }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <motion.circle
          cx="400"
          cy="120"
          r="6"
          fill="#EAFF96"
          className="shadow-[0_0_15px_#EAFF96]"
          initial={{ rotate: 240 }}
          animate={{ rotate: 600 }}
          style={{ transformOrigin: "400px 400px" }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
      </svg>

      {/* Central Node */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center z-20">
        <div className="w-20 h-20 rounded-full bg-black/60 border border-primary/30 flex items-center justify-center shadow-[0_0_30px_rgba(163,230,57,0.2)] mb-4 backdrop-blur-md">
          <Brain className="w-10 h-10 text-primary animate-pulse" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-1">
          Understand
          <br />
          Deeply
        </h3>
        <p className="text-sm text-gray-400">
          Build intuition. Not
          <br />
          just solutions.
        </p>
      </div>

      {/* 1. Read Card (Top Left) */}
      <motion.div
        className="absolute top-[8%] left-[8%] z-30 cursor-pointer hover:scale-105 transition-transform duration-300"
        onClick={() =>
          document
            .getElementById("playground")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-2 -translate-y-6">
          <div className="w-8 h-8 rounded-full border border-primary/50 flex items-center justify-center text-primary font-bold text-sm bg-black/80">
            1
          </div>
          <span className="text-white font-medium">Read</span>
        </div>
        <div className="w-[280px] bg-[#111111]/90 border border-zinc-800 rounded-xl p-5 shadow-2xl backdrop-blur-md relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-white font-medium text-sm">Two Sum II</span>
            <span className="text-[10px] text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded">
              Medium
            </span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed mb-4">
            Given a <strong className="text-gray-300">1-indexed</strong> array
            of integers <code className="text-gray-300">numbers</code> that is
            already <strong className="text-gray-300">sorted</strong>, find two
            numbers that add up to target.
          </p>
          <div className="space-y-1.5 opacity-40">
            <div className="h-1.5 w-full bg-zinc-800 rounded-full"></div>
            <div className="h-1.5 w-3/4 bg-zinc-800 rounded-full"></div>
          </div>
        </div>
      </motion.div>

      {/* 2. Visualize Card (Top Right) */}
      <motion.div
        className="absolute top-[10%] right-[4%] z-30 cursor-pointer hover:scale-105 transition-transform duration-300"
        onClick={() =>
          document
            .getElementById("visualize")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-2 -translate-y-6">
          <div className="w-8 h-8 rounded-full border border-primary/50 flex items-center justify-center text-primary font-bold text-sm bg-black/80">
            2
          </div>
          <span className="text-white font-medium">Visualize</span>
        </div>
        <div className="w-[260px] bg-[#111111]/90 border border-primary/30 rounded-xl p-5 shadow-[0_0_20px_rgba(163,230,57,0.1)] backdrop-blur-md">
          <div className="flex justify-center gap-1 mb-6">
            <div className="w-10 h-10 border border-primary bg-primary/20 flex flex-col items-center justify-center text-white text-sm relative">
              2
              <div className="absolute -bottom-6 flex flex-col items-center">
                <div className="w-0.5 h-2 bg-primary"></div>
                <span className="text-xs text-gray-400">L</span>
              </div>
            </div>
            <div className="w-10 h-10 border border-zinc-700 flex items-center justify-center text-white text-sm">
              7
            </div>
            <div className="w-10 h-10 border border-zinc-700 flex items-center justify-center text-white text-sm">
              11
            </div>
            <div className="w-10 h-10 border border-primary bg-primary/20 flex flex-col items-center justify-center text-white text-sm relative">
              15
              <div className="absolute -bottom-6 flex flex-col items-center">
                <div className="w-0.5 h-2 bg-primary"></div>
                <span className="text-xs text-gray-400">R</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end text-xs text-primary mb-6">
            target = 9
          </div>

          {/* Mock Player */}
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
              <Play className="w-3 h-3 text-primary ml-0.5" />
            </div>
            <div className="w-4 h-4 flex items-center justify-center">
              <Pause className="w-3 h-3 text-gray-500" />
            </div>
            <div className="flex-1 h-1 bg-zinc-800 rounded-full relative">
              <div className="absolute left-0 top-0 h-full w-1/2 bg-primary rounded-full"></div>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full shadow-[0_0_5px_#a3e639]"></div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3. Think Card (Middle Right) */}
      <motion.div
        className="absolute top-[44%] right-[-10%] z-30 cursor-pointer hover:scale-105 transition-transform duration-300"
        onClick={() =>
          document
            .getElementById("thinkpad")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2 -translate-y-6">
          <div className="w-8 h-8 rounded-full border border-[#F97316]/50 flex items-center justify-center text-[#F97316] font-bold text-sm bg-black/80">
            3
          </div>
          <span className="text-white font-medium">Think</span>
        </div>
        <div className="w-[250px] bg-[#111111]/90 border border-[#F97316]/30 rounded-xl p-5 shadow-[0_0_20px_rgba(249,115,22,0.1)] backdrop-blur-md relative">
          <span className="text-[#F97316] font-medium text-sm block mb-3">
            Idea:
          </span>
          <p className="text-xs text-gray-300 leading-relaxed font-[var(--font-caveat)] text-base tracking-wide mb-4">
            Array is sorted! Use two pointers at opposite ends.
          </p>
          <p className="text-xs text-gray-300 leading-relaxed font-[var(--font-caveat)] text-base tracking-wide">
            If sum &gt; target, move R left.
            <br />
            If sum &lt; target, move L right.
          </p>
          <Lightbulb className="w-8 h-8 text-[#F97316] absolute bottom-4 right-4 opacity-50" />
        </div>
      </motion.div>

      {/* 4. Thinkpad Card (Bottom Right) */}
      <motion.div
        className="absolute bottom-[-15%] right-[15%] z-30 cursor-pointer hover:scale-105 transition-transform duration-300"
        onClick={() =>
          document
            .getElementById("thinkpad")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="flex items-center gap-3 mb-2 -translate-y-6">
          <div className="w-8 h-8 rounded-full border border-[#A855F7]/50 flex items-center justify-center text-[#A855F7] font-bold text-sm bg-black/80">
            4
          </div>
          <span className="text-white font-medium">Thinkpad</span>
        </div>
        <div className="w-[240px] bg-[#111111]/90 border-2 border-dashed border-[#A855F7]/30 rounded-xl p-4 shadow-2xl backdrop-blur-md -rotate-2">
          <span className="text-[#A855F7] font-[var(--font-caveat)] text-2xl block mb-4 -rotate-1">
            Two Pointers
          </span>
          <div className="flex items-start gap-8 font-[var(--font-caveat)] text-gray-300 text-xl">
            <div className="flex flex-col gap-4 w-full">
              <div className="flex items-center justify-between w-full rotate-1">
                <span className="text-gray-400">L=2, R=15</span>
                <svg
                  width="24"
                  height="12"
                  viewBox="0 0 24 12"
                  fill="none"
                  className="text-gray-500"
                >
                  <path
                    d="M1 6C6.5 5.5 12 6.5 18 6M18 6C16.5 4.5 15 2 15 2M18 6C16.5 7.5 15 10 15 10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-gray-400">17 &gt; 9 (R--)</span>
              </div>
              <div className="flex items-center justify-between w-full -rotate-2">
                <span className="text-gray-400">L=2, R=11</span>
                <svg
                  width="24"
                  height="12"
                  viewBox="0 0 24 12"
                  fill="none"
                  className="text-gray-500"
                >
                  <path
                    d="M1 6C6.5 5.5 12 6.5 18 6M18 6C16.5 4.5 15 2 15 2M18 6C16.5 7.5 15 10 15 10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-gray-400">13 &gt; 9 (R--)</span>
              </div>
              <div className="flex items-center justify-between w-full rotate-2">
                <span className="text-[#a3e639]">L=2, R=7</span>
                <svg
                  width="24"
                  height="12"
                  viewBox="0 0 24 12"
                  fill="none"
                  className="text-gray-500"
                >
                  <path
                    d="M1 6C6.5 5.5 12 6.5 18 6M18 6C16.5 4.5 15 2 15 2M18 6C16.5 7.5 15 10 15 10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-[#A855F7] relative">
                  9 == 9
                  <svg
                    className="absolute -right-6 -top-1 text-green-400 w-5 h-5 -rotate-12"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M5 13l4 4L19 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>
          {/* Mini Toolbar */}
          <div className="flex items-center gap-3 mt-4 pt-3 border-t border-zinc-800 text-gray-500">
            <PenTool className="w-4 h-4 text-primary" />
            <div className="w-3 h-3 rounded-full bg-primary ml-auto"></div>
            <div className="w-3 h-3 rounded-full bg-[#F97316]"></div>
            <div className="w-3 h-3 rounded-full bg-[#A855F7]"></div>
          </div>
        </div>
      </motion.div>

      {/* 5. Code Card (Bottom Left) */}
      <motion.div
        className="absolute bottom-[-12%] left-[8%] z-30 cursor-pointer hover:scale-105 transition-transform duration-300"
        onClick={() =>
          document
            .getElementById("playground")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <div className="flex items-center gap-3 mb-2 -translate-y-6">
          <div className="w-8 h-8 rounded-full border border-[#3B82F6]/50 flex items-center justify-center text-[#3B82F6] font-bold text-sm bg-black/80">
            5
          </div>
          <span className="text-white font-medium">Code</span>
        </div>
        <div className="w-[280px] bg-[#111111]/90 border border-zinc-800 rounded-xl shadow-2xl backdrop-blur-md overflow-hidden flex flex-col">
          <div className="px-4 py-2 border-b border-zinc-800 flex items-center justify-between bg-black/50">
            <span className="text-xs text-gray-400">Python</span>
          </div>
          <div className="p-4 text-xs font-mono leading-relaxed">
            <span className="text-[#A855F7]">def</span>{" "}
            <span className="text-[#3B82F6]">twoSum</span>
            <span className="text-white">(nums, target):</span>
            <br />
            &nbsp;&nbsp;l, r = 0, <span className="text-[#3B82F6]">len</span>
            (nums) - 1
            <br />
            &nbsp;&nbsp;<span className="text-[#A855F7]">while</span>&nbsp;l
            &lt; r:
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;s = nums[l] + nums[r]
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#A855F7]">if</span>
            &nbsp;s == target:
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span className="text-[#A855F7]">return</span>&nbsp;[l+1, r+1]
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#A855F7]">elif</span>
            &nbsp;s &lt; target: l += 1
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#A855F7]">else</span>
            :&nbsp;r -= 1
          </div>
          <div className="px-4 py-3 border-t border-zinc-800 flex items-center justify-between bg-black/30">
            <div className="flex items-center gap-1.5 bg-primary/20 text-primary px-3 py-1 rounded text-xs font-medium">
              <Play className="w-3 h-3 fill-current" />
              Run
            </div>
            <div className="flex items-center gap-1 text-xs text-primary font-medium">
              <Check className="w-3 h-3" />
              Accepted
            </div>
          </div>
        </div>
      </motion.div>

      {/* 6. Review Card (Middle Left) */}
      <motion.div
        className="absolute top-[35%] left-[-6%] z-30 cursor-pointer hover:scale-105 transition-transform duration-300"
        onClick={() =>
          document
            .getElementById("playground")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
      >
        <div className="flex items-center gap-3 mb-2 -translate-y-6">
          <div className="w-8 h-8 rounded-full border border-[#3B82F6]/50 flex items-center justify-center text-[#3B82F6] font-bold text-sm bg-black/80">
            6
          </div>
          <span className="text-white font-medium">Review</span>
        </div>
        <div className="w-[240px] bg-[#111111]/90 border border-zinc-800 rounded-xl p-5 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-200">
              Optimal Solution
            </span>
          </div>
          <div className="space-y-2 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-primary" />
              <span>Time Complexity: O(n)</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-primary" />
              <span>Space Complexity: O(1)</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-primary" />
              <span>Pointers save auxiliary space</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-primary" />
              <span>Single pass solution</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-zinc-800 text-[#3B82F6] text-xs font-medium flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity">
            Learn More <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
