import { BookOpen, ShieldCheck, CheckSquare, Building2, Terminal, Hexagon, Network, LineChart } from "lucide-react";

export const pricingData = {
    header: {
        badge: "Premium Access",
        title: "Elevate Your Coding Skills",
        subtitle: "Master algorithm patterns with high-quality interactive visualizations and expert problem-solving strategies."
    },
    // lifetimePlan: {
    //     id: "lifetime",
    //     title: "Lifetime plan",
    //     badge: "Offer ending soon",
    //     originalPrice: "₹17,000",
    //     discountText: "(53% off)",
    //     price: "$399",
    //     period: "paid once",
    //     periodSubLabel: "paid once",
    //     buttonText: "Buy now",
    //     productId: "lifetime",
    //     features: [
    //         "Unlock all premium interviews content",
    //         "Join our exclusive private Discord channel with real-time support and a helpful community"
    //     ],
    // },
    subscriptionPlans: [
        {
            id: "3month",
            title: "3 Month plan",
            originalPrice: "$7.50/month",
            discountText: "(10% off)",
            price: "$20",
            period: "/3 months",
            periodSubLabel: "Billed every 3 months",
            buttonText: "Buy now",
            productId: "3monthly",
            features: [
                "Unlock all premium interviews content",
                "Access to updates while subscription is active",
                "Join our exclusive private Discord channel with real-time support and a helpful community"
            ]
        },
        {
            id: "6month",
            title: "6 Month plan",
            originalPrice: "$6.50/month",
            discountText: "(10% off)",
            price: "$35",
            period: "/6 months",
            periodSubLabel: "Billed every 6 months",
            buttonText: "Buy now",
            productId: "6monthly",
            features: [
                "Unlock all premium interviews content",
                "Access to updates while subscription is active",
                "Join our exclusive private Discord channel with real-time support and a helpful community"
            ]
        },
        {
            id: "annual",
            title: "Annual plan",
            badge: "RECOMMENDED",
            originalPrice: "$5/month",
            discountText: "(10% off)",
            price: "$55",
            period: "/year",
            periodSubLabel: "Billed yearly ($55)",
            buttonText: "Buy now",
            productId: "yearly",
            features: [
                "Unlock all premium interviews content",
                "Access to updates while subscription is active",
                "Join our exclusive private Discord channel with real-time support and a helpful community"
            ],
        }
    ],
    featuresSection: {
        title: "Jam-packed with features",
        features: [
            {
                icon: BookOpen,
                title: "Large question bank",
                description: "200+ interview questions covering fundamental patterns and advanced algorithms."
            },
            {
                icon: ShieldCheck,
                title: "Curated solutions",
                description: "Master multi-approach solutions with clear, step-by-step explanations."
            },
            {
                icon: CheckSquare,
                title: "Structured Learning Path",
                description: "Master algorithm patterns systematically with our curated collection of interview questions."
            },
            {
                icon: Building2,
                title: "Pattern-tagged questions",
                description: "Learn the underlying patterns (Two Pointers, Sliding Window, etc.) to solve any new problem."
            },
            {
                icon: Terminal,
                title: "In-browser playground",
                description: "Integrated code runner with instant feedback — no local setup required."
            },
            {
                icon: Hexagon,
                title: "Multi-language support",
                description: "Practice in your language of choice: JavaScript, Python, Java, C++, and more."
            },
            {
                icon: Network,
                title: "Visual Execution Flow",
                description: "Don't just read code — watch it run. Our visualizer syncs perfectly with every line of code."
            },
            {
                icon: LineChart,
                title: "Continuous updates",
                description: "We constantly add new patterns and visualization improvements for our premium members."
            }
        ]
    },
    footerNotes: [
        "Tip: Many users have reimbursed Premium as part of their company's flexible benefits or learning and training budget.",
        "Prices will be increased as more content is being added to the website. Subscribe early to lock in this earlybird price.",
        "Lifetime plan is a limited time offering and will be removed in future."
    ]
};
