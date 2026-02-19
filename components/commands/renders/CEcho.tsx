import { AnimatedSpan } from "@/components/AnimatedComponents";

function CEcho({ input }: { input: string }) {
  const msg = input.slice(5).replace(/^["']|["']$/g, "");

  return (
    <AnimatedSpan>
      <p className="text-primary">{msg}</p>
    </AnimatedSpan>
  );
}

export default CEcho;
