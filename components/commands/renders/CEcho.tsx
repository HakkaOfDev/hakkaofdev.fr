import { AnimatedSpan } from "@/components/AnimatedComponents";

function CEcho({ input }: { input: string }) {
  const msg = input.slice(5).replace(/^["']|["']$/g, "");

  return (
    <AnimatedSpan>
      <p className="text-chart-1">{msg}</p>
    </AnimatedSpan>
  );
}

export default CEcho;
