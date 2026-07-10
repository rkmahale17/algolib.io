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
            title: "Free Plan",
            price: "$0",
            period: "",
            periodSubLabel: "Forever free",
            buttonText: "Start Learning",
            productId: "free",
            hasTrial: false,
            originalPrice: undefined,
            discountText: undefined,
            features: [
                "Access to free problems",
                "x Company-wise Questions",
                "x Interactive Visualizations for free",
                "x ThinkPad for free problems",
                "x Future Updates"
            ]
        },
        {
            id: "6month",
            title: "6 Month Subscription",
            price: "$19.99",
            period: "/6 months",
            periodSubLabel: "Billed every 6 months",
            buttonText: "Buy now",
            productId: "6monthly",
            hasTrial: true,
            originalPrice: undefined,
            discountText: undefined,
            features: [
                "All Premium Problems",
                "Company-wise Questions",
                "Interactive Visualizations",
                "ThinkPad",
                "Future Updates"
            ]
        },
        {
            id: "annual",
            title: "Annual Plan",
            badge: "⭐ Most Popular",
            trustedText: "★★★★★ Trusted by 500+ Developers",
            saveText: "Save 25%",
            price: "$29.99",
            period: "/year",
            periodSubLabel: "Only $2.50/month",
            buttonText: "Buy now",
            productId: "yearly",
            hasTrial: true,
            originalPrice: undefined,
            discountText: undefined,
            features: [
                "Annual No disruption",
                "Discord Doubt Solve",
                "Learning Guidance in one to one call",
                "All Premium Problems",
                "Company-wise Questions",
                "Interactive Visualizations",
                "ThinkPad",
                "Future Updates",
                "Get renew same price as we have right now"
            ],
        }
    ],
    featuresSection: {
        title: "Jam-packed with features",
        features: [
            {
                icon: Building2,
                title: "Company related tag option",
                description: "Filter and practice questions asked by top tech giants like Google, Meta, and Amazon."
            },
            {
                icon: ShieldCheck,
                title: "Pro problems solutions",
                description: "Unlock step-by-step multi-approach solutions with clear, detailed, and optimized explanations."
            },
            {
                icon: Network,
                title: "Visualization access",
                description: "Don't just read code — watch it run. Get full interactive access to visualize algorithm execution flow."
            },
            {
                icon: BookOpen,
                title: "Large question bank",
                description: "200+ interview questions covering fundamental patterns and advanced algorithms."
            },
            {
                icon: CheckSquare,
                title: "Structured Learning Path",
                description: "Master algorithm patterns systematically with our curated collection of interview questions."
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
