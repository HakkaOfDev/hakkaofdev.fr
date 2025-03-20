import { useCommands } from "@/components/CommandsProvider";
import { useEffect } from "react";

function CReset() {
  const { reset } = useCommands();

  useEffect(() => {
    reset();
  }, [reset]);

  return null;
}

export default CReset;
