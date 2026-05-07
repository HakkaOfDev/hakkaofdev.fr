"use client";

import { MAN_PAGE_NAMES } from "@/lib/constants";
import { registerDynamicParamCommand } from "./dynamic-param.registry";

registerDynamicParamCommand({
  pattern: "man",
  paramProvider: () => MAN_PAGE_NAMES,
  group: "Terminal",
});
