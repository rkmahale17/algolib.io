import { AlertTriangle } from "lucide-react";

export const TabWarning = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4 border-2 border-dashed border-orange-200/50 rounded-lg bg-orange-50/50 dark:bg-orange-950/10 m-4">
    <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
      <AlertTriangle className="w-8 h-8 text-orange-500" />
    </div>
    <div className="space-y-1">
      {/* <h3 className="text-lg font-medium text-orange-700 dark:text-orange-400">Feature Warning</h3> */}
      <p className="text-sm text-muted-foreground max-w-sm mx-auto">
        {message}
      </p>
    </div>
  </div>
);
