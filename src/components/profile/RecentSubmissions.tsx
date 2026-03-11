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
  if (submissions.length === 0) {
    return (
        <div className="text-center text-muted-foreground py-8 text-xs">
            No submissions yet. Start solving!
        </div>
    );
  }

  return (
    <div className="space-y-1">
        {submissions.map((sub) => (
        <div key={sub.id} className="flex items-center justify-between p-3 border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-3">
                {sub.status === 'passed' ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : sub.status === 'failed' ? (
                    <XCircle className="w-4 h-4 text-red-500" />
                ) : (
                    <Clock className="w-4 h-4 text-yellow-500" />
                )}
                <div>
                    <Link to={`/problem/${sub.algorithmId}`} className="font-medium text-sm hover:underline block text-foreground">
                        {sub.algorithmName}
                    </Link>
                    <div className="text-[10px] text-muted-foreground flex gap-2 items-center mt-0.5">
                        <span className="capitalize">{sub.language}</span>
                        <span className="w-0.5 h-0.5 rounded-full bg-muted-foreground" />
                        <span>{formatDistanceToNow(new Date(sub.timestamp), { addSuffix: true })}</span>
                    </div>
                </div>
            </div>
            <div className={`text-xs font-medium w-16 text-center py-1 rounded-full ${
                 sub.status === 'passed' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'
            }`}>
                {sub.status === 'passed' ? 'Passed' : 'Failed'}
            </div>
        </div>
        ))}
    </div>
  );
};
