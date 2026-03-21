import * as React from "react";
import { cn } from "@/lib/utils";

interface TipsProps extends React.HTMLAttributes<HTMLDivElement> {
    heading: React.ReactNode;
    children: React.ReactNode;
}

const Tips = React.forwardRef<HTMLDivElement, TipsProps>(
    ({ className, heading, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "my-4 border-l-4 border-primary bg-muted/50 p-4 pl-6 rounded-r-lg shadow-sm",
                    className
                )}
                {...props}
            >
                <h4 className="mb-2 font-medium text-lg tracking-tight text-primary">
                    {heading}
                </h4>
                <div className="text-sm text-muted-foreground leading-relaxed">
                    {children}
                </div>
            </div>
        );
    }
);

Tips.displayName = "Tips";

export { Tips };
