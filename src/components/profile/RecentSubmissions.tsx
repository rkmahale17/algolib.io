import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { Link } from 'react-router-dom';

interface RecentSubmission {
  id: string;
  algorithmId: string;
  algorithmName: string;
  status: 'passed' | 'failed' | 'error';
  timestamp: string;
  language: string;
}

interface RecentSubmissionsProps {
  submissions: RecentSubmission[];
}

export const RecentSubmissions = ({ submissions }: RecentSubmissionsProps) => {
  return (
    <Card className="border-border/50 bg-card/40 backdrop-blur-sm h-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {submissions.length === 0 ? (
            <div className="text-center text-muted-foreground py-8 text-sm">
                No submissions yet. Start solving!
            </div>
        ) : (
            submissions.map((sub) => (
            <div key={sub.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                <div className="flex items-center gap-3">
                    {sub.status === 'passed' ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : sub.status === 'failed' ? (
                        <XCircle className="w-4 h-4 text-red-500" />
                    ) : (
                        <Clock className="w-4 h-4 text-yellow-500" />
                    )}
                    <div>
                        <Link to={`/problem/${sub.algorithmId}`} className="font-medium text-sm hover:underline">
                            {sub.algorithmName}
                        </Link>
                        <div className="text-xs text-muted-foreground flex gap-2">
                            <span>{formatDistanceToNow(new Date(sub.timestamp), { addSuffix: true })}</span>
                            <span>•</span>
                            <span className="capitalize">{sub.language}</span>
                        </div>
                    </div>
                </div>
                <Badge variant={sub.status === 'passed' ? 'outline' : 'secondary'} className={
                    sub.status === 'passed' ? 'border-green-500/30 text-green-500' : ''
                }>
                    {sub.status === 'passed' ? 'Accepted' : 'Wrong Answer'}
                </Badge>
            </div>
            ))
        )}
      </CardContent>
    </Card>
  );
};
