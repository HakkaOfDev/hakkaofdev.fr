import { AnimatedSpan } from "@/components/AnimatedComponents";
import { HOBBIES, LANGUAGES } from "@/lib/constants";
import Link from "next/link";

function CAbout() {
  return (
    <AnimatedSpan className="gap-1">
      <Info title="First Name" value="Alexandre" />
      <Info title="Last Name" value="Gossard" />
      <Info
        title="Age"
        value={`${Math.floor((new Date().getTime() - new Date("2002-12-24").getTime()) / (1000 * 60 * 60 * 24 * 365.25))} years`}
      />
      <Info title="Location" value="Châlons-en-Champagne, France" />
      <p className="text-muted-foreground">
        Email: <Link href="mailto:alexandre.gossard.pro@gmail.com" className="font-semibold text-chart-1 hover:text-chart-1/80 transition-colors duration-200">alexandre.gossard.pro@gmail.com</Link>
      </p>
      <Info
        title="Languages"
        value={LANGUAGES.map((lang) => `${lang.lang} (${lang.level})`).join(
          ", ",
        )}
      />
      <Info title="Hobbies" value={HOBBIES.join(", ")} />
    </AnimatedSpan>
  );
}

function Info({ title, value }: { title: string; value: string }) {
  return (
    <p className="text-muted-foreground">
      {title}: <span className="text-foreground font-semibold">{value}</span>
    </p>
  );
}

export default CAbout;
