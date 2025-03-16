import { AnimatedSpan } from "@/components/Terminal";

function CNotFound({ input }: { input: string }) {
  return (
    <AnimatedSpan>
      <p className="text-destructive">
        Command &apos;{input}&apos; was not found.
      </p>
    </AnimatedSpan>
  );
}

export default CNotFound;
