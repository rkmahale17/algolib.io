import { Mail, MessageCircle, Linkedin, Twitter, Github, ArrowRight } from "lucide-react";
import React from "react";

const COMMUNITY_LINKS = [
    { name: "Email us", icon: Mail, link: "mailto:support@rulcode.com" },
    { name: "Join Discord", icon: MessageCircle, link: "https://discord.gg/DKvKSc7T" },
    { name: "Follow our LinkedIn", icon: Linkedin, link: "https://www.linkedin.com/company/rulcode" },
    { name: "Follow us on X", icon: Twitter, link: "https://x.com/YutiloInc" },
    { name: "GitHub Repository", icon: Github, link: "https://github.com/rkmahale17/learn-algo-animate" },
];

export function CommunitySection() {
    return (
        <section className="py-24 bg-white dark:bg-black">
            <div className="w-full max-w-[1600px] mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-8 text-gray-900 dark:text-white leading-[1.1]">
                            Join our growing community
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-xl font-medium leading-relaxed">
                            Have questions or feedback? We&apos;re building RulCode for you. Join our social platforms and help us shape the future of tech prep.
                        </p>
                    </div>

                    <div className="divide-y divide-gray-100 dark:divide-zinc-900 border-t border-gray-100 dark:border-zinc-900">
                        {COMMUNITY_LINKS.map((item, i) => (
                            <a key={i} href={item.link} className="group flex items-center justify-between py-8 transition-all hover:pl-2">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-zinc-900 flex items-center justify-center border border-gray-100 dark:border-zinc-800 group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
                                        <item.icon className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
                                    </div>
                                    <span className="text-xl font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors tracking-tight">{item.name}</span>
                                </div>
                                <ArrowRight className="w-6 h-6 text-gray-300 group-hover:text-primary transition-all group-hover:translate-x-2" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
