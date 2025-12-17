import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Helmet } from "react-helmet-async";

const faqs = [
  {
    question: "What is Rulcode.com?",
    answer: "Rulcode.com is a free, open-source platform that helps you learn data structures and algorithms through interactive visualizations. We provide step-by-step animated explanations of 200+ popular algorithms with code implementations in Python, Java, C++, and TypeScript."
  },
  {
    question: "Is Rulcode.com really free?",
    answer: "Yes! Rulcode.com is 100% free and will remain free forever. We believe education should be accessible to everyone. Our entire codebase is open source and available on GitHub."
  },
  {
    question: "What programming languages are supported?",
    answer: "We provide algorithm implementations in four popular programming languages: Python, Java, C++, and TypeScript. You can easily switch between languages to see the same algorithm in different syntaxes."
  },
  {
    question: "How do the visualizations work?",
    answer: "Each algorithm comes with an interactive step-by-step visualization that shows how the algorithm processes data in real-time. You can control the speed, pause at any step, and see the code execution highlighted line by line."
  },
  {
    question: "Is Rulcode good for interview preparation?",
    answer: "Absolutely! Rulcode.com covers essential algorithms frequently asked in coding interviews at top tech companies. Our visual approach helps you understand the 'why' behind each algorithm, not just the 'how', which is crucial for technical interviews."
  },
  {
    question: "Can I contribute to Rulcode.com?",
    answer: "Yes! We welcome contributions from the community. You can add new algorithms, improve existing visualizations, fix bugs, or enhance documentation. Visit our GitHub repository to get started."
  },
  {
    question: "Do I need to create an account?",
    answer: "No account is required to access and learn from all our algorithms. However, creating a free account allows you to track your progress and save your favorite algorithms."
  },
  {
    question: "What's the difference between Rulcode and LeetCode?",
    answer: "While LeetCode focuses on practice problems, Rulcode.com focuses on understanding algorithms through visual learning. We're complementary - use Rulcode to learn and understand algorithms, then practice on LeetCode to master them."
  }
];

export const FAQ = () => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>
      
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about Rulcode.com
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </>
  );
};
