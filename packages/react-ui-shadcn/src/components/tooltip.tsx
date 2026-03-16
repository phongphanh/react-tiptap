import React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

export interface ActionTooltipProps {
  children: React.ReactNode;
  title: string;
}

export function ActionTooltip({ children, title }: ActionTooltipProps) {
  if (!title) return <>{children}</>;

  return (
    <TooltipPrimitive.Provider delayDuration={400}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            sideOffset={6}
            className="z-50 rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white shadow-md animate-in fade-in-0 zoom-in-95"
          >
            {title}
            <TooltipPrimitive.Arrow className="fill-gray-900" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
