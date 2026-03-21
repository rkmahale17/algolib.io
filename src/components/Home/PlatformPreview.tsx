import React from "react";
import { AlgorithmPreview } from "../admin/AlgorithmPreview";
import { platformPreviewData } from "../../data/platformPreviewData";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const INITIAL_CODE = `function twoSum(nums: number[], target: number): number[] {
    // Hash map to store number and its index
    const seen = new Map<number, number>();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        // Check if complement exists in hash map
        if (seen.has(complement)) {
            return [seen.get(complement)!, i];
        }
        
        // Store current number and its index
        seen.set(nums[i], i);
    }
    
    return [-1,-1]; // No solution found
}`;

export default function PlatformPreview() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
            <div className="relative group">
                {/* Glow effect background */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#EAFF96]/20 to-[#EAFF96]/10 rounded-2xl blur-xl opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

                <div className="relative bg-white dark:bg-zinc-950 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 shadow-2xl shadow-[#EAFF96]/5 overflow-hidden">
                    <div className="h-[700px] md:h-[850px] overflow-hidden">
                        <AlgorithmPreview algorithm={platformPreviewData} initialCode={INITIAL_CODE} isPlatformPreview={true} />
                    </div>
                </div>

            </div>

            {/* CTA button — links to the Two Sum problem */}
            <div className="mt-8 flex justify-center">
                <Link
                    to="/problem/two-sum"
                    className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-3 rounded-full shadow-xl border border-zinc-800 dark:border-zinc-200 flex items-center gap-3 whitespace-nowrap hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-colors duration-200 group/btn"
                >
                    <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-primary animate-pulse"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-primary animate-pulse [animation-delay:200ms]"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-primary animate-pulse [animation-delay:400ms]"></span>
                    </div>
                    <p className="text-sm font-medium tracking-tight">Interactive Playground — Try editing the code</p>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                </Link>
            </div>
        </motion.div>
    );
}
