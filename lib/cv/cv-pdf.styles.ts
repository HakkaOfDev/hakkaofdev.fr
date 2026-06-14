import { StyleSheet } from "@react-pdf/renderer";
import { CV_FONT_FAMILY } from "./cv-pdf.fonts";

export const COLORS = {
  black: "#111827",
  dark: "#1F2937",
  muted: "#374151",
  accent: "#1D4ED8",
  rule: "#111827",
  lightRule: "#D1D5DB",
} as const;

export const styles = StyleSheet.create({
  /* ── Page ───────────────────────────────────── */
  page: {
    paddingTop: 28,
    paddingRight: 36,
    paddingBottom: 22,
    paddingLeft: 36,
    fontSize: 10,
    fontFamily: CV_FONT_FAMILY,
    color: COLORS.black,
    lineHeight: 1.35,
  },

  /* ── Header ─────────────────────────────────── */
  header: {
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 22,
    fontFamily: CV_FONT_FAMILY,
    fontWeight: 700,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: COLORS.black,
    marginBottom: 10,
  },
  jobTitle: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 2,
    marginBottom: 6,
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 2,
  },
  contactItem: {
    fontSize: 9,
    color: COLORS.dark,
  },
  contactSep: {
    fontSize: 9,
    color: COLORS.lightRule,
    marginHorizontal: 4,
  },
  contactLink: {
    fontSize: 9,
    color: COLORS.accent,
    textDecoration: "none",
  },

  /* ── Section ────────────────────────────────── */
  section: {
    marginTop: 6,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: CV_FONT_FAMILY,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: COLORS.black,
    marginRight: 6,
  },
  sectionRule: {
    flex: 1,
    borderBottomWidth: 1.2,
    borderBottomColor: COLORS.rule,
  },

  /* ── Summary ────────────────────────────────── */
  summary: {
    fontSize: 9.5,
    color: COLORS.muted,
    lineHeight: 1.4,
  },

  /* ── Experience / Education items ───────────── */
  item: {
    marginBottom: 4,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  itemTitle: {
    fontFamily: CV_FONT_FAMILY,
    fontWeight: 700,
    fontSize: 10.5,
    color: COLORS.black,
  },
  itemLink: {
    fontSize: 8.5,
    color: COLORS.accent,
    textDecoration: "none",
  },
  itemMeta: {
    fontSize: 9.5,
    color: COLORS.dark,
    fontFamily: CV_FONT_FAMILY,
    fontStyle: "italic",
    marginBottom: 2,
  },
  bulletText: {
    fontSize: 9.5,
    color: COLORS.dark,
    lineHeight: 1.4,
    paddingLeft: 6,
    marginBottom: 0,
  },

  /* ── Skills ─────────────────────────────────── */
  skillsGrid: {
    flexDirection: "column",
  },
  skillRow: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 1,
  },
  skillLabel: {
    fontFamily: CV_FONT_FAMILY,
    fontWeight: 700,
    fontSize: 9.5,
    color: COLORS.black,
    width: 96,
  },
  skillValues: {
    flex: 1,
    fontSize: 9.5,
    color: COLORS.dark,
  },

  /* ── Projects ───────────────────────────────── */
  projectItem: {
    marginBottom: 5,
  },
  projectHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  projectName: {
    fontFamily: CV_FONT_FAMILY,
    fontWeight: 700,
    fontSize: 10,
    color: COLORS.black,
  },
  projectLink: {
    fontSize: 8.5,
    color: COLORS.accent,
    textDecoration: "none",
  },
  projectTags: {
    fontSize: 8.5,
    color: COLORS.muted,
    fontFamily: CV_FONT_FAMILY,
    fontStyle: "italic",
    marginBottom: 1,
  },
  projectDesc: {
    fontSize: 9.5,
    color: COLORS.dark,
    lineHeight: 1.4,
  },

  /* ── Bottom row (Languages + Links) ─────────── */
  bottomRow: {
    flexDirection: "row",
  },
  bottomCol: {
    flex: 1,
  },
  bottomColRight: {
    paddingLeft: 16,
  },
  langLine: {
    fontSize: 9.5,
    color: COLORS.dark,
    marginBottom: 1.5,
  },
  langBold: {
    fontFamily: CV_FONT_FAMILY,
    fontWeight: 700,
    color: COLORS.black,
  },
  socialLine: {
    flexDirection: "row",
    marginBottom: 1.5,
    alignItems: "baseline",
  },
  socialLabel: {
    fontFamily: CV_FONT_FAMILY,
    fontWeight: 700,
    fontSize: 9.5,
    color: COLORS.black,
    marginRight: 4,
  },
  socialLink: {
    fontSize: 9,
    color: COLORS.accent,
    textDecoration: "none",
  },

  /* ── Hobbies & Interests ────────────────────── */
  hobbiesText: {
    fontSize: 9.5,
    color: COLORS.dark,
    lineHeight: 1.4,
  },
});
