import { cn } from "@/lib/utils";
import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    variant?: "default" | "panel";
}

export function GlassCard({
    children,
    className,
    variant = "default",
    ...props
}: GlassCardProps) {
    return (
        <div
            className={cn(
                "rounded-2xl transition-all",
                variant === "default" ? "glass-card" : "glass-panel",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
