import Link from "next/link";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import { SITE, SOCIALS } from "@/lib/constants";

function CContact() {
  return (
    <AnimatedSpan className="gap-1">
      <p className="text-muted-foreground">
        Email:{" "}
        <Link
          href={`mailto:${SITE.email}`}
          className="font-semibold text-chart-1 hover:text-chart-1/80 transition-colors duration-200"
        >
          {SITE.email}
        </Link>
      </p>
      <p className="text-muted-foreground">
        Location:{" "}
        <span className="text-foreground font-semibold">{SITE.location}</span>
      </p>
      <p className="text-muted-foreground">Socials:</p>
      <ul className="list-disc pl-4">
        {SOCIALS.map((social) => (
          <li key={social.name}>
            <Link
              href={social.url}
              target="_blank"
              className="font-semibold text-chart-2 hover:text-chart-2/80 transition-colors duration-200"
            >
              {social.name}
            </Link>
          </li>
        ))}
      </ul>
    </AnimatedSpan>
  );
}

export default CContact;
