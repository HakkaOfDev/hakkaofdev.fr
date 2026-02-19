import type { DynamicParamConfig } from "@/types/command";

/**
 * Registry of commands with dynamic parameters.
 * Each entry defines a command pattern and a function to provide parameter values.
 *
 * To add a new dynamic command:
 * 1. Add an entry to this array with the command pattern
 * 2. Provide a paramProvider function that returns available values
 * 3. The suggestion system will automatically use these for autocomplete
 */
export const DYNAMIC_PARAM_COMMANDS: DynamicParamConfig[] = [];

/**
 * Register a new dynamic parameter command.
 * This allows external modules to add their own dynamic commands.
 */
export function registerDynamicParamCommand(config: DynamicParamConfig) {
  DYNAMIC_PARAM_COMMANDS.push(config);
}
