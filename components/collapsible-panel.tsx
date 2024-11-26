"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CollapsiblePanelProps {
  title: string;
  side: "left" | "right";
  className?: string;
  children: React.ReactNode;
  isExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}

export function CollapsiblePanel({
  title,
  side,
  className,
  children,
  isExpanded: controlledExpanded,
  onExpandedChange,
}: CollapsiblePanelProps) {
  const [isExpandedInternal, setIsExpandedInternal] = useState(false);
  
  const isExpanded = controlledExpanded ?? isExpandedInternal;
  
  const handleExpandChange = (expanded: boolean) => {
    setIsExpandedInternal(expanded);
    onExpandedChange?.(expanded);
  };

  return (
    <div
      className={cn(
        "fixed top-4 bottom-24 transition-all duration-300 ease-in-out",
        side === "left" ? "left-4" : "right-4",
        !isExpanded && "w-12 hover:w-96",
        isExpanded && "w-96",
        className
      )}
      onMouseEnter={() => handleExpandChange(true)}
      onMouseLeave={() => handleExpandChange(false)}
    >
      <div className="relative h-full">
        {/* Collapsed Title */}
        <div
          className={cn(
            "absolute top-0 left-0 w-12 h-full flex items-center justify-center transition-opacity duration-300 bg-background/95 backdrop-blur border rounded-lg shadow-md",
            isExpanded && "opacity-0"
          )}
        >
          <div className="rotate-90 whitespace-nowrap text-sm font-medium text-foreground">
            {title}
          </div>
        </div>

        {/* Expanded Content */}
        <div
          className={cn(
            "absolute top-0 left-0 w-full h-full transition-opacity duration-300",
            !isExpanded && "opacity-0 pointer-events-none",
            isExpanded && "opacity-100"
          )}
        >
          <div className="bg-background/95 backdrop-blur border rounded-lg shadow-md p-4 h-full">
            <h2 className="text-lg font-semibold mb-4 text-foreground">{title}</h2>
            <div className="h-[calc(100%-3.5rem)] overflow-auto">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
