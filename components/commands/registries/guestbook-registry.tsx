"use client";

import type { ReactNode } from "react";
import CGuestbookSign from "../renders/guestbook/CGuestbookSign";
import CGuestbookRead from "../renders/guestbook/read/CGuestbookRead";

export type { GuestbookCommandDescriptor } from "../command-descriptors";
export { GUESTBOOK_COMMANDS } from "../command-descriptors";

export const GUESTBOOK_COMMAND_RENDERERS: Record<string, () => ReactNode> = {
  read: () => <CGuestbookRead />,
  sign: () => <CGuestbookSign />,
};
