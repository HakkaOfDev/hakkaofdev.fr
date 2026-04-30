"use client";

import { routing } from "@/i18n/routing";
import { registerDynamicParamCommand } from "./dynamic-param.registry";

export type { LangCommandDescriptor } from "../../../lib/command-descriptors";
export { LANG_COMMANDS } from "../../../lib/command-descriptors";

registerDynamicParamCommand({
  pattern: "lang set",
  paramProvider: () => [...routing.locales],
  group: "Terminal",
});
