import React, { useState, useEffect, useRef } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface CollapsibleCategoriesProps {
    categories: string[];
    onCategoryClick?: (category: string, e: React.MouseEvent) => void;
    isSidebar?: boolean;
}

export const CollapsibleCategories = ({ categories, onCategoryClick, isSidebar }: CollapsibleCategoriesProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [visibleCount, setVisibleCount] = useState(Math.min(categories.length, 3));

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const checkWidths = () => {
            const parentRow = container.closest('.meta-info-row');
            if (!parentRow || !parentRow.parentElement) return;

            const parentWidth = parentRow.parentElement.getBoundingClientRect().width;
            
            const difficultyBadge = parentRow.querySelector('.difficulty-badge');
            const likesBadge = parentRow.querySelector('.likes-badge');
            const serialBadge = parentRow.querySelector('.serial-badge');
            const timeBadge = parentRow.querySelector('.time-badge');

            const currentTop = container.getBoundingClientRect().top;
            const isSameLine = (el: Element | null) => {
                if (!el) return false;
                return Math.abs(el.getBoundingClientRect().top - currentTop) < 8;
            };

            const diffWidth = (difficultyBadge && isSameLine(difficultyBadge)) ? difficultyBadge.getBoundingClientRect().width : 0;
            const likesWidth = (likesBadge && isSameLine(likesBadge)) ? likesBadge.getBoundingClientRect().width : 0;
            const serialWidth = (serialBadge && isSameLine(serialBadge)) ? serialBadge.getBoundingClientRect().width : 0;
            const timeWidth = (timeBadge && isSameLine(timeBadge)) ? timeBadge.getBoundingClientRect().width : 0;

            const safetyMargin = isSidebar ? 20 : 60;
            const availableWidth = parentWidth - diffWidth - likesWidth - serialWidth - timeWidth - safetyMargin;

            const measureContainer = container.querySelector('.measure-container');
            if (!measureContainer) return;

            const measureTags = measureContainer.querySelectorAll('.measure-tag');
            const plusTag = measureContainer.querySelector('.measure-plus');
            const plusWidth = plusTag ? plusTag.getBoundingClientRect().width : 30;

            const tagWidths: number[] = [];
            measureTags.forEach((tag) => {
                tagWidths.push(tag.getBoundingClientRect().width);
            });

            const gap = 6;
            let currentWidth = 0;
            let fitCount = 0;

            const maxToShow = Math.min(categories.length, 3);

            for (let i = 0; i < maxToShow; i++) {
                const tagW = tagWidths[i] || 50;
                const nextWidth = currentWidth + (i > 0 ? gap : 0) + tagW;

                if (i === maxToShow - 1) {
                    if (nextWidth <= availableWidth) {
                        fitCount = maxToShow;
                        currentWidth = nextWidth;
                    }
                } else {
                    const widthWithPlus = nextWidth + gap + plusWidth;
                    if (widthWithPlus <= availableWidth) {
                        fitCount = i + 1;
                        currentWidth = nextWidth;
                    } else {
                        break;
                    }
                }
            }

            if (categories.length > 0) {
                fitCount = Math.max(1, fitCount);
            }

            setVisibleCount(fitCount);
        };

        checkWidths();

        const observer = new ResizeObserver(() => {
            window.requestAnimationFrame(checkWidths);
        });

        const parentRow = container.closest('.meta-info-row');
        if (parentRow) observer.observe(parentRow);
        
        return () => observer.disconnect();
    }, [categories, isSidebar]);

    const visibleCats = categories.slice(0, visibleCount);
    const hiddenCats = categories.slice(visibleCount);

    const tagBaseClass = isSidebar
        ? "px-2 py-0.5 rounded-full text-[8px] font-semibold bg-muted/60 text-muted-foreground/90 shrink-0 select-none h-5 flex items-center"
        : "font-semibold px-3 py-0.5 h-6 rounded-full text-[10px] sm:text-[11px] bg-muted/60 text-muted-foreground/90 hover:bg-primary/10 hover:text-primary transition-all duration-300 border border-border/30 hover:border-primary/20 shrink-0 select-none z-10 flex items-center";

    const plusClass = isSidebar
        ? "px-2 py-0.5 rounded-full text-[8px] font-semibold bg-primary/10 text-primary shrink-0 select-none h-5 flex items-center"
        : "font-semibold px-3 py-0.5 h-6 rounded-full text-[10px] sm:text-[11px] bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-300 border border-primary/20 shrink-0 z-10 flex items-center";

    return (
        <div ref={containerRef} className="flex items-center gap-1.5 flex-nowrap relative">
            {visibleCats.map((cat) => (
                <button
                    key={cat}
                    onClick={(e) => {
                        if (onCategoryClick) {
                            onCategoryClick(cat, e);
                        } else {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    }}
                    className={tagBaseClass}
                >
                    {cat}
                </button>
            ))}

            {hiddenCats.length > 0 && (
                <span
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                >
                    <Popover>
                        <PopoverTrigger asChild>
                            <button className={plusClass}>
                                +{hiddenCats.length}
                            </button>
                        </PopoverTrigger>
                        <PopoverContent 
                            className="w-48 p-2 bg-popover border border-border/60 shadow-xl rounded-xl z-50"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                        >
                            <div className="flex flex-col gap-1.5">
                                {hiddenCats.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={(e) => {
                                            if (onCategoryClick) {
                                                onCategoryClick(cat, e);
                                            }
                                        }}
                                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-[10px] sm:text-[11px] font-medium hover:bg-accent hover:text-accent-foreground transition-colors duration-200 select-none"
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>
                </span>
            )}

            <div className="measure-container absolute invisible opacity-0 pointer-events-none flex flex-nowrap gap-1.5">
                {categories.slice(0, 3).map((cat, i) => (
                    <span key={i} className={cn(tagBaseClass, "measure-tag")}>
                        {cat}
                    </span>
                ))}
                <span className={cn(plusClass, "measure-plus")}>
                    +{categories.length}
                </span>
            </div>
        </div>
    );
};
