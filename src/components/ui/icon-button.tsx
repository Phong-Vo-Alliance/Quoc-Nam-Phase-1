import * as React from "react";
import { Button } from "@/components/ui/button";

interface IconButtonProps extends React.ComponentProps<typeof Button> {
  icon: React.ReactNode;
  label?: string; // accessible label (tooltip)
}

export function IconButton({ icon, label, ...props }: IconButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      title={label}
      className="text-sky-600 hover:bg-sky-50"
      {...props}
    >
      {icon}
    </Button>
  );
}
