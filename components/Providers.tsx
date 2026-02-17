"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { domAnimation, LazyMotion } from "motion/react";
import { ThemeProvider as NextThemeProvider } from "next-themes";

const queryClient = new QueryClient();

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <NextThemeProvider
        attribute="class"
        defaultTheme="dark"
        disableTransitionOnChange
      >
        <LazyMotion features={domAnimation} strict>
          {children}
        </LazyMotion>
      </NextThemeProvider>
    </QueryClientProvider>
  );
}

export default Providers;
