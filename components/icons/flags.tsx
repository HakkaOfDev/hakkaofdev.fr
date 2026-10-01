import { type SVGProps, useId } from "react";
import { cn } from "@/lib/utils";

type FlagProps = SVGProps<SVGSVGElement>;

export type FlagIcon = (props: FlagProps) => React.ReactElement;

/**
 * Real flag artwork (emoji flags render as letter pairs on Windows). Every
 * flag is shown in a 3:2 box; wider flags are center-cropped to fit.
 */
function FlagSvg({
  viewBox,
  className,
  children,
  ...rest
}: FlagProps & { viewBox: string }) {
  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={cn(
        "h-2.5 w-3.75 shrink-0 rounded-[2px] ring-1 ring-border/60 dark:ring-overlay-medium",
        className,
      )}
      {...rest}
    >
      {children}
    </svg>
  );
}

export const FranceFlag: FlagIcon = (props) => (
  <FlagSvg viewBox="0 0 3 2" {...props}>
    <rect width="1" height="2" fill="#002654" />
    <rect x="1" width="1" height="2" fill="#FFFFFF" />
    <rect x="2" width="1" height="2" fill="#CE1126" />
  </FlagSvg>
);

export const UnitedKingdomFlag: FlagIcon = (props) => {
  const id = useId();
  const canvasClip = `${id}-canvas`;
  const diagonalClip = `${id}-diagonal`;
  return (
    <FlagSvg viewBox="0 0 60 30" {...props}>
      <clipPath id={canvasClip}>
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <clipPath id={diagonalClip}>
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <g clipPath={`url(#${canvasClip})`}>
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFFFFF" strokeWidth="6" />
        <path
          d="M0,0 L60,30 M60,0 L0,30"
          clipPath={`url(#${diagonalClip})`}
          stroke="#C8102E"
          strokeWidth="4"
        />
        <path d="M30,0 v30 M0,15 h60" stroke="#FFFFFF" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </FlagSvg>
  );
};

export const RussiaFlag: FlagIcon = (props) => (
  <FlagSvg viewBox="0 0 3 2" {...props}>
    <rect width="3" height="2" fill="#FFFFFF" />
    <rect y="0.667" width="3" height="0.667" fill="#0039A6" />
    <rect y="1.333" width="3" height="0.667" fill="#D52B1E" />
  </FlagSvg>
);

export const SpainFlag: FlagIcon = (props) => (
  <FlagSvg viewBox="0 0 3 2" {...props}>
    <rect width="3" height="2" fill="#AA151B" />
    <rect y="0.5" width="3" height="1" fill="#F1BF00" />
  </FlagSvg>
);

/** Flag shown next to each spoken language, keyed by language code. */
export const LANGUAGE_FLAGS: Partial<Record<string, FlagIcon>> = {
  fr: FranceFlag,
  en: UnitedKingdomFlag,
  ru: RussiaFlag,
  es: SpainFlag,
};
