import Link from "next/link";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import { HOBBIES, LANGUAGES, SITE } from "@/lib/constants";

function CAbout() {
  return (
    <AnimatedSpan className="gap-1">
      <Info title="First Name" value="Alexandre" />
      <Info title="Last Name" value="Gossard" />
      <Info
        title="Age"
        value={`${Math.floor((Date.now() - new Date("2002-12-24").getTime()) / (1000 * 60 * 60 * 24 * 365.25))} years`}
      />
      <Info title="Location" value={SITE.location} />
      <p className="text-muted-foreground">
        Email:{" "}
        <Link
          href={`mailto:${SITE.email}`}
          className="font-semibold text-primary transition-colors duration-200 hover:text-primary/80"
        >
          {SITE.email}
        </Link>
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
      {title}: <span className="font-semibold text-foreground">{value}</span>
    </p>
  );
}

export default CAbout;
