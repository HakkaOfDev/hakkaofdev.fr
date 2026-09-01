import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";

const messages = {
  Terminal: {
    input: {
      placeholder: "Type a command…",
      submit: "Run",
    },
    closeMessages: ["bye"],
    trafficLights: {
      close: "Close terminal",
      minimize: "Minimize terminal",
      restoreMinimize: "Restore terminal",
      expand: "Expand terminal",
      restoreExpand: "Restore terminal size",
    },
  },
  Suggestions: {
    navigate: "Navigate",
    complete: "Complete",
    run: "Run",
  },
  Commands: {
    descriptions: {
      help: "Show available commands",
      about: "Display profile",
      projects: "List projects",
      experiences: "List experiences",
      skills: "List skills",
      education: "Display education",
      contact: "Show contact info",
      cv: "Open CV",
      stats: "Show stats",
      repo: "Open repo",
      echo: "Echo a string",
      lang: "Change language",
      langSet: "Set language",
      langAuto: "Auto-detect language",
      alias: "Manage aliases",
      aliasRemove: "Remove an alias",
      aliasClear: "Clear all aliases",
      history: "Show history",
      man: "Show manual",
      guestbook: "View guestbook",
      guestbookRead: "Read guestbook",
      guestbookSign: "Sign the guestbook",
      spotify: "Spotify integration",
      spotifyNow: "Now playing",
      spotifyTop: "Top tracks",
      spotifyHistory: "Listening history",
      theme: "Manage themes",
      themeList: "List themes",
      themeSet: "Set theme",
      themePreview: "Preview theme",
      themeCreate: "Create theme",
      themeValidate: "Validate theme",
      clear: "Clear terminal",
      reset: "Reset terminal",
    },
    notFound: {
      title: "Command not found: {input}",
      didYouMean: "Did you mean: {suggestions}?",
      pipeOnlyHint: "{cmd} only works in a pipeline. Try: {example}",
    },
  },
};

export function withIntl(children: ReactNode) {
  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
