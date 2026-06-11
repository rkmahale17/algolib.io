import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isBefore, startOfWeek, endOfWeek, parseISO, endOfDay, differenceInSeconds } from 'date-fns';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface StreakCalendarProps {
    submissions: { date: string; count: number; activities?: any[] }[];
    actionSlot?: React.ReactNode;
}

export const StreakCalendar = ({ submissions, actionSlot }: StreakCalendarProps) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const submissionMap = useMemo(() => {
        const map = new Map<string, number>();
        submissions.forEach(s => {
            const d = parseISO(s.date);
            const dateKey = format(d, 'yyyy-MM-dd');
            map.set(dateKey, (map.get(dateKey) || 0) + s.count);
        });
        return map;
    }, [submissions]);

    const handlePreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    const today = new Date();

    const [timeLeft, setTimeLeft] = useState("");

    // Update time left every second
    useState(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const end = endOfDay(now);
            const diff = differenceInSeconds(end, now);
            const hours = Math.floor(diff / 3600);
            const minutes = Math.floor((diff % 3600) / 60);
            const seconds = diff % 60;
            setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }, 1000);
        return () => clearInterval(interval);
    });

    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    return (
        <Card className="border-border/40 bg-card shadow-sm flex flex-col w-full max-w-[320px] mx-auto overflow-hidden rounded-xl">
            <CardHeader className="p-3 pb-2 shrink-0">
                <div className="flex items-center justify-between">
                    <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-muted/50 text-muted-foreground" onClick={handlePreviousMonth}>
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <CardTitle className="text-[14px] font-bold text-foreground tracking-tight">
                        {format(currentDate, 'MMMM yyyy')}
                    </CardTitle>
                    <div className="flex items-center gap-1">
                        {actionSlot}
                        <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-muted/50 text-muted-foreground" onClick={handleNextMonth}>
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-2 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <div className="text-[13px] font-bold text-orange-400">Day {format(today, 'd')}</div>
                    <div className="text-[11px] font-mono text-muted-foreground tracking-widest">{timeLeft} left</div>
                </div>

                <div className="w-full">
                    <div className="grid grid-cols-7 gap-1 mb-2 border-b border-border/20 pb-2">
                        {weekDays.map((day, idx) => (
                            <div key={idx} className="flex items-center justify-center text-[10px] font-semibold text-muted-foreground/60">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-y-2 gap-x-1">
                        {days.map((day, idx) => {
                            const dateKey = format(day, 'yyyy-MM-dd');
                            const count = submissionMap.get(dateKey) || 0;
                            const isCurrentMonth = isSameMonth(day, monthStart);
                            const isDayToday = isToday(day);
                            const isPast = isBefore(day, today) && !isDayToday;
                            const hasSubmission = count > 0;

                            return (
                                <div key={idx} className="flex items-center justify-center relative">
                                    <button 
                                        onClick={() => isCurrentMonth ? setSelectedDate(day) : undefined}
                                        disabled={!isCurrentMonth}
                                        className={cn(
                                            "w-7 h-7 flex items-center justify-center rounded-full text-[11px] font-medium transition-all relative z-10",
                                            !isCurrentMonth && "text-muted-foreground/20 bg-muted/10 cursor-default",
                                            isCurrentMonth && !hasSubmission && isPast && "text-red-500/60 border border-dashed border-red-500/30 bg-transparent hover:bg-red-500/5 cursor-pointer",
                                            isCurrentMonth && hasSubmission && "bg-[#84cc16] text-black border border-[#84cc16]/30 hover:bg-[#84cc16]/80 cursor-pointer",
                                            isCurrentMonth && !hasSubmission && !isPast && !isDayToday && "bg-muted/50 dark:bg-zinc-800/60 text-muted-foreground hover:bg-muted/80 cursor-pointer",
                                            isDayToday && "ring-1 ring-offset-2 ring-offset-background ring-blue-500 bg-blue-500/20 text-blue-400 font-bold hover:bg-blue-500/30 cursor-pointer"
                                        )}
                                    >
                                        {(isCurrentMonth && !hasSubmission && isPast) && (
                                            <div className="absolute inset-0 flex items-center justify-center opacity-40">
                                                <X className="w-3 h-3 text-red-500" strokeWidth={2.5} />
                                            </div>
                                        )}
                                        <span className={cn("relative z-10", (isCurrentMonth && !hasSubmission && isPast) && "opacity-70")}>
                                            {format(day, dateFormat)}
                                        </span>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </CardContent>

            <Dialog open={!!selectedDate} onOpenChange={(open) => !open && setSelectedDate(null)}>
                <DialogContent className="sm:max-w-[400px] rounded-2xl border-border/40 bg-card p-0 overflow-hidden">
                    <DialogHeader className="p-6 pb-4 border-b border-border/20 bg-muted/5">
                        <DialogTitle className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                            <span className="bg-primary/10 text-primary w-8 h-8 rounded-lg flex items-center justify-center text-sm">📅</span>
                            {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : ''}
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground/80">
                            Activity log for this day
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-6 flex flex-col gap-3 max-h-[60vh] overflow-y-auto">
                        {(() => {
                            if (!selectedDate) return null;
                            const dateKey = format(selectedDate, 'yyyy-MM-dd');
                            const dayActivities = submissions.find(s => s.date === dateKey)?.activities || [];
                            
                            if (dayActivities.length === 0) {
                                return (
                                    <div className="py-8 text-center flex flex-col items-center justify-center gap-3">
                                        <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-2 relative">
                                            <div className="absolute inset-0 rounded-full border border-dashed border-red-500/30 animate-[spin_10s_linear_infinite]" />
                                            <X className="w-6 h-6" strokeWidth={2} />
                                        </div>
                                        <div>
                                            <h4 className="text-base font-semibold text-foreground mb-1">Dear, you missed this day!</h4>
                                            <p className="text-sm text-muted-foreground max-w-[250px] mx-auto">Keep pushing! Consistency is the key to mastering algorithms.</p>
                                        </div>
                                    </div>
                                );
                            }

                            return dayActivities.map((act, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-card shadow-sm hover:border-primary/20 transition-colors group">
                                    <div className={cn(
                                        "w-2.5 h-2.5 rounded-full shrink-0 shadow-sm", 
                                        act.status === 'passed' ? "bg-green-500 shadow-green-500/20" : "bg-red-500 shadow-red-500/20"
                                    )} />
                                    <div className="flex-1 flex flex-col min-w-0">
                                        <span className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">{act.algorithm_title}</span>
                                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-0.5">
                                            {act.difficulty} • {act.language}
                                        </span>
                                    </div>
                                    <div className="text-[11px] font-mono font-medium text-muted-foreground/60 shrink-0 bg-muted/20 px-2 py-1 rounded-md">
                                        {format(new Date(act.timestamp), 'h:mm a')}
                                    </div>
                                </div>
                            ));
                        })()}
                    </div>
                </DialogContent>
            </Dialog>
        </Card>
    );
};
