import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/Footer";

const ContentRights = () => {
  return (
    <>
      <Helmet>
        <title>Content Rights & Usage Policy - RulCode.com</title>
        <meta name="description" content="Learn about RulCode.com's content rights, embedded video usage, and original educational materials." />
        <meta name="keywords" content="content rights, usage policy, educational content, embedded videos, NeetCode" />
        <link rel="canonical" href="https://rulcode.com/content-rights" />
        <meta property="og:title" content="Content Rights & Usage Policy - RulCode.com" />
        <meta property="og:description" content="Learn about RulCode.com's content rights, embedded video usage, and original educational materials." />
        <meta property="og:url" content="https://rulcode.com/content-rights" />
        <meta property="og:type" content="website" />
      </Helmet>

      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Content Rights & Usage Policy</h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </header>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About RulCode.com</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                <p>
                  <strong>RulCode.com</strong> is an educational platform created to help developers learn data structures, 
                  algorithms, and system design through interactive examples, code explanations, and curated learning resources.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Embedded YouTube Content</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                <p>
                  RulCode.com occasionally embeds educational videos from third-party creators such as <strong>NeetCode</strong> and 
                  other learning channels. These videos are embedded using YouTube's official embed feature and are displayed with 
                  attribution and permission from the respective channel owners.
                </p>
                <p>
                  We have explicit approval from the NeetCode channel admin to embed their videos for educational purposes on 
                  RulCode.com. These videos remain the intellectual property of their original creators and are not hosted or 
                  redistributed by RulCode.com.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Original Additions by RulCode.com</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                <p>Each embedded video is accompanied by:</p>
                <ul>
                  <li>Original explanations and breakdowns of the logic shown in the video.</li>
                  <li>Additional code examples, flow diagrams, or optimization notes created by RulCode.com.</li>
                  <li>Contextual commentary and learning notes that make the content distinct from the original video alone.</li>
                </ul>
                <p>
                  This ensures that every page on RulCode.com adds unique educational value beyond the embedded video.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                <p>
                  If you are a content owner and believe your work is being used improperly, please contact us at:{" "}
                  <a href="mailto:support@rulcode.com" className="text-primary hover:underline">
                    support@rulcode.com
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
};

export default ContentRights;
