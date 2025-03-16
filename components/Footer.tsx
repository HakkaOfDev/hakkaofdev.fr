import { SOCIALS } from "@/lib/constants";
import { Heart } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import Link from "next/link";

function Footer() {
  return (
    <div className="flex flex-col justify-center items-center gap-4 pt-8 pb-4">
      <div className="flex gap-3 items-center">
        {SOCIALS.map((social) => (
          <Link
            key={social.name}
            href={social.url}
            className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            target="_blank"
          >
            <DynamicIcon name={social.icon} />
          </Link>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        Made with <Heart className="inline-block text-chart-1" size={20} /> by{" "}
        <Link
          href="https://github.com/hakkaofdev"
          className="text-chart-1 font-semibold relative after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-chart-1 after:transition-transform hover:after:scale-x-100"
        >
          Alexandre Gossard
        </Link>
        .
      </p>
    </div>
  );
}

export default Footer;
