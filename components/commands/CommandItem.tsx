"use client";

import { Command } from "@/types";
import CommandBash from "./CommandBash";
import { useEffect, useMemo, useState } from "react";
import CHelp from "./renders/CHelp";
import CNotFound from "./renders/CNotFound";
import { Loader } from "lucide-react";
import CClear from "./renders/CClear";
import CWelcome from "./renders/CWelcome";
import CProjects from "./renders/CProjects";
import CSkills from "./renders/CSkills";
import CEducation from "./renders/CEducation";
import CExperiences from "./renders/CExperiences";

function CommandWrapper({
  children,
  input,
  timestamp,
}: { children: React.ReactNode } & Command) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(true);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex flex-col gap-2 w-full pb-4">
      <CommandBash input={input} timestamp={timestamp} />
      {!show ? <Loader size={16} className="animate-spin" /> : children}
    </div>
  );
}

function CommandItem({ input, timestamp }: Command) {
  const content = useMemo(() => {
    switch (input) {
      case "help":
        return <CHelp />;
      case "clear":
        return <CClear />;
      case "welcome":
        return <CWelcome />;
      case "projects":
        return <CProjects />;
      case "skills":
        return <CSkills />;
      case "education":
        return <CEducation />;
      case "experiences":
        return <CExperiences />;
      default:
        return <CNotFound input={input} />;
    }
  }, [input]);

  return (
    <CommandWrapper input={input} timestamp={timestamp}>
      {content}
    </CommandWrapper>
  );
}

export default CommandItem;
