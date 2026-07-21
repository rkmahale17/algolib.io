"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";
import React from "react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Senior Software Engineer",
    text: "The interactive visualizations completely changed how I approach data structures. It makes learning DSA so much simpler and more intuitive. I finally cleared my technical rounds with confidence!",
  },
  {
    name: "Michael Chen",
    role: "Software Development Engineer II",
    text: "I've tried many platforms, but this is by far the most practical. The step-by-step animations help you visualize the logic rather than just memorizing code. Highly recommended for anyone struggling with algorithmic thinking.",
  },
  {
    name: "Emily Rodriguez",
    role: "Frontend Engineer",
    text: "The focus on patterns rather than just grinding random problems is a game changer. The platform breaks down complex topics into digestible chunks. It was instrumental in helping me secure my new role.",
  },
  {
    name: "David Kim",
    role: "Full Stack Developer",
    text: "A must-have resource for interview preparation. The clean UI and interactive scratchpad make practicing a breeze. It guided me through the core patterns effectively and made the learning process actually enjoyable.",
  },
  {
    name: "Jessica Patel",
    role: "Technical Lead",
    text: "Before this, dynamic programming was a nightmare. The visual walkthroughs demystified it completely. It's the best investment I've made in my career development and interview prep.",
  },
  {
    name: "Alex Mercer",
    role: "Software Engineer",
    text: "The platform's structured approach to teaching core patterns is phenomenal. You don't just learn the solution; you learn how to arrive at it. Thanks to this, I breezed through my coding rounds.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-zinc-50 dark:bg-zinc-950/50">
      <div className="w-full max-w-[1200px] mx-auto px-4 relative z-10">
        <div className="mb-16 text-center lg:text-left max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6 text-zinc-900 dark:text-white">
            Engineers trust us with their job interviews
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg">
            See how our interactive platform has helped developers master Data Structures & Algorithms and ace their technical interviews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Card className="h-full bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 hover:border-primary/30 transition-all duration-300">
                <CardContent className="pt-6">
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6">
                    "{testimonial.text}"
                  </p>
                </CardContent>
                <CardHeader className="pt-0 border-t border-zinc-100 dark:border-zinc-800/50 mt-auto">
                  <div className="flex items-center gap-3 pt-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-900 dark:text-white text-sm">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
