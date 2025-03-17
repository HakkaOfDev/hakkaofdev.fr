import { AnimatedSpan } from "@/components/Terminal";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

function CWelcome() {
  return (
    <AnimatedSpan>
      <Image
        src="/avatar.jpeg"
        alt="Alexandre Gossard"
        className="rounded-lg object-cover max-h-[100px] scale-x-[-1] object-bottom"
        quality={100}
        width={100}
        height={100}
        sizes="100px"
        priority
      />
      <p className="mt-4 text-sm md:text-base text-muted-foreground">
        Hellooo!{" "}
        <motion.span
          initial={{
            rotate: 0,
            transformOrigin: "70% 70%",
          }}
          animate={{
            rotate: [0, 14, -8, 14, -4, 10, 0],
            transformOrigin: "70% 70%",
          }}
          transition={{
            duration: 2.5,
            repeat: 1,
            repeatDelay: 0.5,
            ease: "easeInOut",
          }}
          className="inline-block"
        >
          👋
        </motion.span>{" "}
      </p>
      <h1 className="text-xl md:text-2xl font-semibold">
        I&apos;m Alexandre{" "}
        <span className="font-bold text-chart-1">GOSSARD</span>.
      </h1>
      <h2 className="mt-4 text-muted-foreground">
        Currently{" "}
        <b className="font-semibold text-chart-2">Lead Frontend Developer</b> at{" "}
        <Link
          href="https://kabila.app"
          className="text-chart-2 font-semibold"
          target="_blank"
        >
          kabila.app
        </Link>
        .
      </h2>
      <h3 className="text-muted-foreground">
        Passionate about open source and specialized in React, Next.js, and
        modern web technologies.
      </h3>
      <p className="mt-4">
        Start to explore by typing{" "}
        <span className="text-chart-2 font-semibold">help</span> in the terminal
        and enjoy the experience 😁
      </p>
    </AnimatedSpan>
  );
}

export default CWelcome;
