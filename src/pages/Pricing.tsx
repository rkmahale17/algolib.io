import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Zap } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const plans = [
    {
        name: "3 Month Subscription",
        price: "$9.99",
        period: "/3 months",
        description: "Billed every 3 months",
        features: [
            "Unlock all premium interview content",
            "Access to updates while subscription is active",
            "Join our exclusive private Discord channel",
        ],
        buttonText: "Buy now",
        highlight: false,
        trial: "Includes 14-day free trial"
    },
    {
        name: "6 Month Subscription",
        price: "$19.99",
        period: "/6 months",
        description: "Billed every 6 months",
        features: [
            "Unlock all premium interview content",
            "Access to updates while subscription is active",
            "Join our exclusive private Discord channel",
        ],
        buttonText: "Buy now",
        highlight: false,
        trial: "Includes 14-day free trial"
    },
    {
        name: "Annual Subscription",
        price: "$29.99",
        period: "/year",
        description: "Billed yearly ($29.99)",
        features: [
            "Unlock all premium interview content",
            "Access to updates while subscription is active",
            "Join our exclusive private Discord channel",
        ],
        buttonText: "Buy now",
        highlight: false,
        trial: "Includes 14-day free trial"
    }
];

export default function Pricing() {
    return (
        <>
            <Helmet>
                <title>Pricing - RulCode.com | Premium Algorithm Learning</title>
                <meta
                    name="description"
                    content="Choose a plan that fits your learning journey. Get unlimited access to premium algorithm content, visualizations, and our private community."
                />
            </Helmet>

            <div className="min-h-screen bg-background">
                <main className="container mx-auto px-4 py-16">
                    <div className="text-center space-y-4 mb-12">
                        <h1 className="text-4xl font-bold text-foreground sm:text-5xl">Manage your subscription</h1>
                        <p className="text-xl text-muted-foreground">
                            Choose the best plan for your career growth
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {plans.map((plan) => (
                            <Card
                                key={plan.name}
                                className="relative flex flex-col transition-all duration-300 hover:shadow-xl border-border/50"
                            >

                                <CardHeader>
                                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                                    <div className="mt-4 flex items-baseline">
                                        <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                                        <span className="ml-1 text-sm font-semibold text-muted-foreground">{plan.period}</span>
                                    </div>
                                    <CardDescription className="mt-2">
                                        {plan.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="flex-1 space-y-4">
                                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                                        <p className="text-sm font-medium text-primary flex items-center gap-2">
                                            <Zap className="w-4 h-4 fill-primary" />
                                            {plan.trial}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground mt-1">
                                            Cancel anytime before 14 days and you will not be charged.
                                        </p>
                                    </div>

                                    <ul className="space-y-3">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-start gap-3 text-sm text-foreground/80">
                                                <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>

                                <CardFooter>
                                    <Button
                                        className="w-full h-12 text-lg font-semibold"
                                        variant={plan.highlight ? "default" : "outline"}
                                    >
                                        {plan.buttonText}
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    <div className="mt-16 text-center space-y-6">
                        <p className="text-muted-foreground">
                            All payments are processed securely via <strong>Lemon Squeezy</strong>, our Merchant of Record.
                        </p>
                        <div className="flex justify-center gap-8 text-sm opacity-50 grayscale contrast-125">
                            <span className="font-bold tracking-tighter text-xl">VISA</span>
                            <span className="font-bold tracking-tighter text-xl">Mastercard</span>
                            <span className="font-bold tracking-tighter text-xl">PayPal</span>
                            <span className="font-bold tracking-tighter text-xl">Apple Pay</span>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
}
