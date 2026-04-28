import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet-async";

export default function RefundPolicy() {
    return (
        <>
            <Helmet>
                <title>Refund Policy - RulCode.com | Our Commitment to You</title>
                <meta
                    name="description"
                    content="Learn about our refund policy, 14-day free trial, and cancellation process. We aim for complete customer satisfaction with our algorithm learning platform."
                />
                <link rel="canonical" href="https://rulcode.com/refund-policy" />
            </Helmet>

            <div className="min-h-screen bg-background">
                <main className="container mx-auto px-4 py-8 max-w-4xl">
                    <div className="space-y-8">
                        <div className="text-center space-y-4">
                            <h1 className="text-4xl font-bold text-foreground">Refund Policy</h1>
                            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>1. 14-Day Free Trial</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <p>
                                    We offer a 14-day free trial for all our subscription plans (3 Month, 6 Month, and Annual).
                                    This trial period allows you to explore all premium features of RulCode.com without any
                                    initial charge.
                                </p>
                                <p>
                                    You can cancel your subscription at any time during the 14-day trial period through your
                                    account settings or by contacting our support team. If you cancel before the trial
                                    concludes, you will not be charged.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>2. Refund Eligibility</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <p>
                                    Once the 14-day trial period has ended and your first payment is processed, we generally
                                    do not offer refunds for the current billing period, except in the following cases:
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Technical issues that prevent you from accessing premium content (and we are unable to resolve them).</li>
                                    <li>Duplicate charges or billing errors made by our payment processor.</li>
                                    <li>Legal requirements in your jurisdiction that mandate a refund window.</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>3. Cancellation</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <p>
                                    You may cancel your subscription at any time. Upon cancellation, you will continue to
                                    have access to premium features until the end of your current billing cycle. No further
                                    charges will be made after cancellation.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>4. How to Request a Refund</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <p>
                                    To request a refund under the eligible conditions, please email us at{" "}
                                    <a href="mailto:support@rulcode.com" className="text-primary hover:underline">
                                        support@rulcode.com
                                    </a>{" "}
                                    with your account details and the reason for your request.
                                </p>
                                <p>
                                    All payments and refunds are processed by our Merchant of Record, <strong>Lemon Squeezy</strong>.
                                    In some cases, you may need to contact their support directly for billing-related inquiries.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>5. Changes to This Policy</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <p>
                                    RulCode.com reserves the right to modify this refund policy at any time. Any changes
                                    will be posted on this page with an updated "Last updated" date.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
}
