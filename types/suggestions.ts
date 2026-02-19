/**
 * Result type for tab completion actions.
 * Describes what action should be taken when the user presses Tab.
 */
export type TabCompletionResult =
  | { type: "add_space"; value: string }
  | { type: "complete_single"; value: string }
  | { type: "complete_prefix"; value: string }
  | { type: "no_action" };
