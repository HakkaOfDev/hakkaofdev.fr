import { useEffect } from "react";
import { useCommands } from "@/components/providers/CommandsProvider";

function CReset() {
  const { reset } = useCommands();

  useEffect(() => {
    reset();
  }, [reset]);

  return null;
}

export default CReset;
