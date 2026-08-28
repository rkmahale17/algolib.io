import { Metadata } from "next";
import Link from "next/link";
import {
  Clock,
  HardDrive,
  Layers,
  Target,
  Database,
  BookOpen,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Algorithm Guides & Fundamentals | RulCode",
  description:
    "Comprehensive guidebook covering time complexity, space complexity, core data structures, algorithm patterns, and database fundamentals. Learn DSA from the ground up.",
  alternates: {
    canonical: "https://rulcode.com/guides",
  },
  openGraph: {
    title: "Algorithm Guides & Fundamentals | RulCode",
    description:
      "Comprehensive guidebook covering time complexity, space complexity, core data structures, algorithm patterns, and database fundamentals.",
    url: "https://rulcode.com/guides",
  },
};

const GUIDE_SECTIONS = [
  {
    title: "Time Complexity",
    description:
      "Understand Big O notation, runtime analysis, and operation budgets for common algorithms.",
    href: "/guides/time-complexity",
    icon: Clock,
  },
  {
    title: "Space Complexity",
    description:
      "Learn about memory usage, recursion stack depth, and how to estimate space requirements.",
    href: "/guides/space-complexity",
    icon: HardDrive,
  },
  {
    title: "Fundamentals",
    description:
      "Master core data structures: arrays, linked lists, trees, tries, and graphs with visual explanations.",
    href: "/guides/fundamentals/core-data-structures",
    icon: Layers,
  },
  {
    title: "Algorithm Patterns",
    description:
      "Deep-dive into 16 essential coding patterns: two pointers, sliding window, binary search, backtracking, dynamic programming, and more.",
    href: "/guides/patterns/arrays-hashing",
    icon: Target,
  },
  {
    title: "Database Guides",
    description:
      "From SQL basics and JOINs to indexes, transactions, ACID properties, sharding, and advanced database internals.",
    href: "/guides/database/what-is-database",
    icon: Database,
  },
];

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <BookOpen className="h-4 w-4" />
            Guidebook
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Algorithm Guides & Fundamentals
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to build a strong foundation in data structures,
            algorithms, and database concepts — explained visually.
          </p>
        </div>

        {/* Guide sections grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {GUIDE_SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <Link
                key={section.href}
                href={section.href}
                className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-semibold">{section.title}</h2>
                </div>
                <p className="flex-1 text-sm text-muted-foreground">
                  {section.description}
                </p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Start learning
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
