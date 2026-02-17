import { useEffect } from "react";
import { useCommands } from "@/components/CommandsProvider";

function CClear() {
  const { clearCommands } = useCommands();

  useEffect(() => {
    clearCommands();
  }, [clearCommands]);

  return null;
}

export default CClear;
