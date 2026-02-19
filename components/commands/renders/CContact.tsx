import Link from "next/link";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import { SITE, SOCIALS } from "@/lib/constants";

function getDisplayLink(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, "");
}

function CContact() {
  return (
    <AnimatedSpan className="gap-2">
      <p className="text-muted-foreground">
        Prefer email for opportunities, freelance requests, or technical
        collaboration.
      </p>

      <p className="text-muted-foreground">
        Primary email:{" "}
        <Link
          href={`mailto:${SITE.email}`}
          className="font-semibold text-primary transition-colors duration-200 hover:text-primary/80"
        >
          {SITE.email}
        </Link>
      </p>
      <p className="text-muted-foreground">
        Location:{" "}
        <span className="font-semibold text-foreground">{SITE.location}</span>
      </p>

      <p className="text-muted-foreground">Social profiles:</p>
      <ul className="grid list-disc gap-1 pl-4">
        {SOCIALS.map((social) => (
          <li key={social.name}>
            <Link
              href={social.url}
              target="_blank"
              className="font-semibold text-secondary transition-colors duration-200 hover:text-secondary/80"
            >
              {social.name}
            </Link>
            <span className="text-muted-foreground">
              {" "}
              · {getDisplayLink(social.url)}
            </span>
          </li>
        ))}
      </ul>
    </AnimatedSpan>
  );
}

export default CContact;
