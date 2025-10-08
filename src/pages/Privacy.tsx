import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>1. Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                AlgoLib.io is committed to protecting your privacy. We collect minimal information to 
                provide our services:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong>Account Information:</strong> If you create an account, we store your email address and authentication credentials</li>
                <li><strong>Usage Data:</strong> We collect anonymous analytics data to improve the platform (page views, algorithm popularity, etc.)</li>
                <li><strong>Local Storage:</strong> We store your language preferences locally in your browser</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We use the collected information for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Providing and maintaining the AlgoLib.io platform</li>
                <li>Improving user experience and platform features</li>
                <li>Understanding how users interact with our content</li>
                <li>Communicating important updates (if you have an account)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Data Storage and Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Your data is stored securely using industry-standard encryption and security practices. 
                We use Lovable Cloud (powered by Supabase) for backend services, which complies with 
                modern security standards.
              </p>
              <p className="text-muted-foreground">
                However, no method of transmission over the Internet or electronic storage is 100% secure, 
                and we cannot guarantee absolute security.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                AlgoLib.io uses minimal cookies and local storage to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Remember your authentication session</li>
                <li>Store your language preference (Python, Java, C++, TypeScript)</li>
                <li>Remember your theme preference (dark/light mode)</li>
              </ul>
              <p className="text-muted-foreground">
                We do not use third-party advertising cookies or sell your data to advertisers.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                AlgoLib.io may link to external practice problem websites (LeetCode, Codeforces, etc.). 
                These third-party sites have their own privacy policies, and we are not responsible for 
                their practices.
              </p>
              <p className="text-muted-foreground">
                Our hosting and backend infrastructure is provided by Lovable Cloud. Please review their 
                privacy policy for more information.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Open Source Transparency</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                AlgoLib.io is an open-source project. Our entire codebase is publicly available on{" "}
                <a 
                  href="https://github.com/rkmahale17/algolib.io" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  GitHub
                </a>, allowing you to review exactly how we handle data and implement features.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                AlgoLib.io is suitable for all ages and does not knowingly collect personal information 
                from children under 13. If you are a parent and believe your child has provided us with 
                personal information, please contact us.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Access your personal data</li>
                <li>Request deletion of your account and associated data</li>
                <li>Opt-out of non-essential data collection</li>
                <li>Export your data</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We may update this privacy policy from time to time. We will notify users of any 
                significant changes by updating the "Last updated" date at the top of this page.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                If you have questions or concerns about this privacy policy, please open an issue on our{" "}
                <a 
                  href="https://github.com/rkmahale17/algolib.io/issues" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  GitHub repository
                </a>.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
