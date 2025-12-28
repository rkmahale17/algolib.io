import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Code2, 
  Terminal, 
  Cpu, 
  BookOpen, 
  Info, 
  ShieldAlert, 
  Zap, 
  Clock, 
  Database,
  Search,
  ChevronRight,
  ShieldCheck,
  Globe,
  HardDrive,
  Activity,
  Menu,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "overview", label: "Overview", icon: Info },
  { id: "infrastructure", label: "Infrastructure", icon: Cpu },
  { id: "compilers", label: "Compiler Versions", icon: Terminal },
  { id: "limitations", label: "Resource Limits", icon: ShieldAlert },
  { id: "glossary", label: "Algorithm Glossary", icon: BookOpen },
];

const COMPILERS = [
  {
    name: "TypeScript",
    version: "5.6.2",
    id: 101,
    features: ["ESNext Support", "High-performance compilation", "Modern type safety"],
    color: "text-blue-400"
  },
  {
    name: "Python",
    version: "3.13.2",
    id: 109,
    features: ["Latest stable release", "Improved error messages", "Optimized interpreter"],
    color: "text-yellow-400"
  },
  {
    name: "Java",
    version: "17.0.6 (LTS)",
    id: 91,
    features: ["Modern OpenJDK", "Garbage collection optimizations", "Sealed classes support"],
    color: "text-red-400"
  },
  {
    name: "C++",
    version: "GCC 14.1.0",
    id: 105,
    features: ["Modern C++ (C++23 support)", "Advanced GCC optimizations", "Standard Library features"],
    color: "text-indigo-400"
  }
];

const LIMITATIONS = [
  {
    title: "Execution Time",
    limit: "5.0 Seconds",
    desc: "Maximum CPU time allowed per execution to prevent infinite loops.",
    icon: Clock,
    color: "text-orange-500"
  },
  {
    title: "Memory Limit",
    limit: "128 MB",
    desc: "Total RAM available for the program, including stack and heap memory.",
    icon: Database,
    color: "text-blue-500"
  },
  {
    title: "Stack Size",
    limit: "64 MB",
    desc: "Maximum stack size permitted for recursive algorithm execution.",
    icon: Zap,
    color: "text-yellow-500"
  },
  {
    title: "Network Access",
    limit: "Disabled",
    desc: "Internet access is restricted within the sandbox for security reasons.",
    icon: Globe,
    color: "text-red-500"
  },
  {
    title: "Local Storage",
    limit: "Ephemeral",
    desc: "Filesystem is read-only except for temporary scratch space cleared after run.",
    icon: HardDrive,
    color: "text-gray-500"
  },
  {
    title: "Submissions",
    limit: "Rate Limited",
    desc: "Excessive rapid submissions may be temporarily throttled per user.",
    icon: Activity,
    color: "text-green-500"
  }
];

const GLOSSARY = [
  {
    term: "Big O Notation",
    definition: "Mathematical notation describing algorithm efficiency as input size grows.",
    category: "Complexity"
  },
  {
    term: "Time Complexity",
    definition: "Total computational steps taken by an algorithm relative to input size.",
    category: "Complexity"
  },
  {
    term: "Space Complexity",
    definition: "Memory footprint used by an algorithm during its execution cycle.",
    category: "Complexity"
  },
  {
    term: "Dynamic Programming",
    definition: "An optimization strategy solving subproblems and caching results for reuse.",
    category: "Strategy"
  },
  {
    term: "Greedy Technique",
    definition: "Making locally optimal choices hoping they lead to a global optimum.",
    category: "Strategy"
  },
  {
    term: "Sliding Window",
    definition: "Efficiently tracking a subset of data as it moves across a sequence.",
    category: "Technique"
  },
  {
    term: "Two Pointers",
    definition: "Using multiple indices to traverse data structures from different points.",
    category: "Technique"
  }
];

export default function CompilerDocs() {
  const [activeTab, setActiveTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const filteredGlossary = GLOSSARY.filter(item => 
    item.term.toLowerCase().includes(search.toLowerCase()) ||
    item.definition.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      for (const section of SECTIONS) {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= scrollPosition && element.offsetTop + element.offsetHeight > scrollPosition) {
          setActiveTab(section.id);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth"
      });
    setActiveTab(id);
    if (isSidebarOpen) setSidebarOpen(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Compiler Infrastructure & Documentation - RulCode</title>
        <meta name="description" content="Detailed documentation of RulCode's execution environment, resource limits, and algorithm glossary." />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col md:flex-row container mx-auto px-4 gap-8 py-10">
          
          {/* Persistent Sidebar */}
          <aside className={cn(
            "fixed inset-0 z-50 md:sticky md:top-24 h-[calc(100vh-6rem)] w-64 shrink-0 transition-transform md:translate-x-0 bg-background md:bg-transparent",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}>
             <div className="flex flex-col h-full border-r md:border-none p-4 md:p-0">
                <div className="flex items-center justify-between mb-8 md:hidden">
                   <span className="font-bold">Documentation</span>
                   <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                      <X className="w-5 h-5" />
                   </Button>
                </div>

                <div className="space-y-1">
                   {SECTIONS.map((section) => (
                     <button
                       key={section.id}
                       onClick={() => scrollToSection(section.id)}
                       className={cn(
                         "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors group",
                         activeTab === section.id 
                           ? "bg-primary/10 text-primary" 
                           : "text-muted-foreground hover:bg-muted"
                       )}
                     >
                       <section.icon className={cn(
                         "w-4 h-4 transition-colors",
                         activeTab === section.id ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                       )} />
                       {section.label}
                     </button>
                   ))}
                </div>

                <div className="mt-auto md:mb-4 p-4 rounded-xl bg-muted/50 border text-xs text-muted-foreground">
                   <p className="font-semibold text-foreground mb-1">Status</p>
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      All Compilers Online
                   </div>
                </div>
             </div>
          </aside>

          {/* Docs Content */}
          <main className="flex-1 min-w-0 space-y-24 max-w-4xl">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between py-4 border-b -mt-4 mb-4">
              <Button variant="ghost" className="gap-2" onClick={() => setSidebarOpen(true)}>
                <Menu className="w-5 h-5" />
                Contents
              </Button>
              <Badge variant="outline">Docs v1.2</Badge>
            </div>

            {/* Overview Section */}
            <section id="overview" className="scroll-mt-24 space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Code Runner Documentation</h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Welcome to the RulCode technical overview. Our execution environment is designed for speed, security, and correctness, providing a high-fidelity experience for practicing algorithms.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 pt-4">
                <div className="p-6 rounded-2xl bg-card border hover:shadow-md transition-shadow">
                   <ShieldCheck className="w-8 h-8 text-emerald-500 mb-4" />
                   <h3 className="text-lg font-bold mb-2">Isolated Sandbox</h3>
                   <p className="text-sm text-muted-foreground">Every submission runs in its own ephemeral container, ensuring zero side-effects between runs.</p>
                </div>
                <div className="p-6 rounded-2xl bg-card border hover:shadow-md transition-shadow">
                   <Zap className="w-8 h-8 text-yellow-500 mb-4" />
                   <h3 className="text-lg font-bold mb-2">Real-time Feedback</h3>
                   <p className="text-sm text-muted-foreground">Optimized compiler pipelines deliver results in under a second for most standard test suites.</p>
                </div>
              </div>
            </section>

            {/* Infrastructure Section */}
            <section id="infrastructure" className="scroll-mt-24 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Cpu className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold">Execution Engine</h2>
              </div>
              <p className="text-muted-foreground">
                The RulCode platform leverages <strong>Judge0 CE</strong>, the industry-standard open-source code execution system. Our infrastructure ensures that your code is evaluated in a rigorous, competitive-programming-grade environment.
              </p>
              <div className="bg-muted/30 border rounded-2xl p-6 space-y-4">
                 <h4 className="font-semibold flex items-center gap-2">
                    <Info className="w-4 h-4 text-primary" />
                    How it works
                 </h4>
                 <ol className="space-y-4 text-sm text-muted-foreground">
                    <li className="flex gap-4">
                       <span className="flex-none w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">1</span>
                       <span>Your code is wrapped in a specialized <strong>test harness</strong> that injects test cases and captures output.</span>
                    </li>
                    <li className="flex gap-4">
                       <span className="flex-none w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">2</span>
                       <span>The payload is transmitted via encrypted proxy to our execution nodes.</span>
                    </li>
                    <li className="flex gap-4">
                       <span className="flex-none w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">3</span>
                       <span>Code is compiled and executed in an <strong>unprivileged sandbox</strong> container.</span>
                    </li>
                    <li className="flex gap-4">
                       <span className="flex-none w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">4</span>
                       <span>Results are parsed, formatted, and delivered back to the UI in real-time.</span>
                    </li>
                 </ol>
              </div>
            </section>

            {/* Compilers Section */}
            <section id="compilers" className="scroll-mt-24 space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Terminal className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold">Compiler Matrix</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                 {COMPILERS.map(comp => (
                   <div key={comp.name} className="p-6 rounded-2xl bg-card border hover:border-primary/50 transition-colors group">
                      <div className="flex items-center justify-between mb-4">
                         <h3 className="text-xl font-bold">{comp.name}</h3>
                         <Badge variant="secondary" className="font-mono">{comp.version}</Badge>
                      </div>
                      <ul className="space-y-2">
                         {comp.features.map(f => (
                           <li key={f} className="text-sm text-muted-foreground flex items-center gap-2">
                              <ChevronRight className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                              {f}
                           </li>
                         ))}
                      </ul>
                   </div>
                 ))}
              </div>
            </section>

            {/* Limitations Section */}
            <section id="limitations" className="scroll-mt-24 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                     <ShieldAlert className="w-6 h-6" />
                   </div>
                   <h2 className="text-3xl font-bold">Resource Limitations</h2>
                </div>
                <Badge variant="outline" className="text-orange-500 border-orange-500/30">Hard Limits</Badge>
              </div>
              <p className="text-muted-foreground max-w-2xl">
                 To maintain global stability and security, we enforce strict resource boundaries. Applications exceeding these limits will be terminated.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                 {LIMITATIONS.map(lim => (
                   <div key={lim.title} className="p-5 rounded-xl border bg-card hover:bg-muted/50 transition-colors space-y-3">
                      <div className="flex items-center justify-between">
                         <lim.icon className={cn("w-5 h-5", lim.color)} />
                         <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-muted border tracking-tighter">
                            {lim.limit}
                         </span>
                      </div>
                      <h4 className="font-bold text-sm">{lim.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{lim.desc}</p>
                   </div>
                 ))}
              </div>
              <div className="p-4 rounded-xl border-l-4 border-l-primary bg-primary/5 text-sm text-muted-foreground">
                 <p><strong>Pro Tip:</strong> Most algorithm problems can be solved well within 100ms and 32MB. If you hit Time/Memory limits, consider checking for infinite loops or high-order time complexities (e.g., O(2<sup>n</sup>)).</p>
              </div>
            </section>

            {/* Glossary Section */}
            <section id="glossary" className="scroll-mt-24 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                     <BookOpen className="w-6 h-6" />
                   </div>
                   <h2 className="text-3xl font-bold">Concept Glossary</h2>
                </div>
                <div className="relative w-full sm:w-64">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                   <Input 
                     placeholder="Search concepts..." 
                     className="pl-9 bg-card" 
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                   />
                </div>
              </div>

              <div className="grid gap-3">
                 <AnimatePresence mode="popLayout">
                    {filteredGlossary.map((item) => (
                      <motion.div
                        key={item.term}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="group p-5 rounded-2xl bg-card border hover:border-primary/30 transition-all flex flex-col sm:flex-row gap-4 sm:items-center"
                      >
                         <div className="sm:w-48 shrink-0">
                            <Badge variant="secondary" className="mb-2 text-[10px] font-bold uppercase opacity-50">{item.category}</Badge>
                            <h4 className="font-extrabold text-foreground group-hover:text-primary transition-colors">{item.term}</h4>
                         </div>
                         <p className="text-sm text-muted-foreground leading-relaxed">
                            {item.definition}
                         </p>
                      </motion.div>
                    ))}
                 </AnimatePresence>
                 {filteredGlossary.length === 0 && (
                   <div className="text-center py-12 rounded-2xl border-2 border-dashed text-muted-foreground">
                      No matching algorithmic concepts found.
                   </div>
                 )}
              </div>
            </section>
          </main>
        </div>

        <Footer />
      </div>
    </>
  );
}
