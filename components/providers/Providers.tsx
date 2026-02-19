"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { domAnimation, LazyMotion } from "motion/react";
import { ThemeEngineProvider } from "@/components/providers/ThemeProvider";
import { CommandsProvider } from "./CommandsProvider";

// Import theme registry to register dynamic param commands
import "@/components/commands/registries/theme-registry";

const queryClient = new QueryClient();

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <CommandsProvider>
        <ThemeEngineProvider>
          <LazyMotion features={domAnimation} strict>
            {children}
          </LazyMotion>
        </ThemeEngineProvider>
      </CommandsProvider>
    </QueryClientProvider>
  );
}

export default Providers;
