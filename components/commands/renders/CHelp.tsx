import { COMMANDS } from "@/components/commands/registry";
import CommandList from "./CommandList";

function CHelp() {
  return <CommandList items={COMMANDS} />;
}

export default CHelp;
