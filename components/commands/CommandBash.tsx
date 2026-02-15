import React from "react";
import { AnimatedSpan } from "../Terminal";

function CommandBash({
  input,
  timestamp,
}: {
  input: string;
  timestamp: Date;
}) {
  return (
    <AnimatedSpan>
      <div className="flex w-full items-center justify-between font-semibold text-sm gap-2">
        <p># {input}</p>
        <p className="text-muted-foreground text-xs">
          {timestamp.toLocaleTimeString()}
        </p>
      </div>
    </AnimatedSpan>
  );
}

export default CommandBash;
