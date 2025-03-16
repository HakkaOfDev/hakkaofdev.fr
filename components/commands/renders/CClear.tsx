import { useCommands } from "@/components/CommandsProvider";
import { useEffect } from "react";

function CClear() {
  const { clearCommands } = useCommands();

  useEffect(() => {
    clearCommands();
  }, []);

  return null;
}

export default CClear;
