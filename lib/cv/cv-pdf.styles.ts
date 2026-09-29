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
    paddingTop: 24,
    paddingRight: 34,
    paddingBottom: 20,
    paddingLeft: 34,
    fontSize: 9.5,
    fontFamily: CV_FONT_FAMILY,
    color: COLORS.black,
    lineHeight: 1.35,
  },

  /* ── Header ─────────────────────────────────── */
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  photo: {
    width: 58,
    height: 58,
    borderRadius: 6,
    objectFit: "cover",
    marginRight: 14,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontFamily: CV_FONT_FAMILY,
    fontWeight: 700,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: COLORS.black,
    lineHeight: 1.2,
  },
  jobTitle: {
    fontSize: 12,
    color: COLORS.muted,
    marginBottom: 3,
  },
  contactRow: {
    flexDirection: "row",
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

  sectionGap: {
    flexGrow: 1,
    maxHeight: 4,
  },

  /* ── Section ────────────────────────────────── */
  section: {
    marginTop: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  sectionTitle: {
    fontSize: 10.5,
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
    fontSize: 9,
    color: COLORS.muted,
    lineHeight: 1.35,
  },

  /* ── Experience / Education items ───────────── */
  item: {
    marginBottom: 3,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  itemTitle: {
    fontFamily: CV_FONT_FAMILY,
    fontWeight: 700,
    fontSize: 10,
    color: COLORS.black,
  },
  itemLink: {
    fontSize: 8.5,
    color: COLORS.accent,
    textDecoration: "none",
  },
  itemMeta: {
    fontSize: 9,
    color: COLORS.dark,
    fontFamily: CV_FONT_FAMILY,
    fontStyle: "italic",
    marginBottom: 1,
  },
  bulletText: {
    fontSize: 9,
    color: COLORS.dark,
    lineHeight: 1.3,
    paddingLeft: 6,
    marginBottom: 0,
  },

  /* ── Skills ─────────────────────────────────── */
  skillsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skillCell: {
    flexDirection: "row",
    width: "50%",
    paddingRight: 8,
    marginBottom: 1,
  },
  skillRow: {
    flexDirection: "row",
  },
  skillLabel: {
    fontFamily: CV_FONT_FAMILY,
    fontWeight: 700,
    fontSize: 9,
    lineHeight: 1.3,
    color: COLORS.black,
    width: 86,
    paddingRight: 6,
  },
  skillValues: {
    flex: 1,
    fontSize: 9,
    lineHeight: 1.3,
    color: COLORS.dark,
  },

  /* ── Projects ───────────────────────────────── */
  projectItem: {
    marginBottom: 7,
  },
  projectHeader: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "baseline",
    gap: 6,
    marginBottom: 3,
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
    marginLeft: "auto",
    textAlign: "right",
    fontSize: 8.5,
    fontFamily: CV_FONT_FAMILY,
    fontStyle: "italic",
    color: COLORS.muted,
  },
  projectDesc: {
    fontSize: 9,
    color: COLORS.dark,
    lineHeight: 1.35,
    marginBottom: 2,
  },

  /* ── Info row (Languages + Links + Hobbies) ─── */
  infoRow: {
    flexDirection: "row",
    gap: 14,
  },
  infoCol: {
    flexShrink: 1,
  },
  infoColLanguages: {
    flexGrow: 1,
    flexBasis: 0,
  },
  infoColLinks: {
    flexGrow: 1.45,
    flexBasis: 0,
  },
  infoColHobbies: {
    flexGrow: 1,
    flexBasis: 0,
  },
  langLine: {
    fontSize: 9,
    color: COLORS.dark,
    marginBottom: 1,
  },
  langBold: {
    fontFamily: CV_FONT_FAMILY,
    fontWeight: 700,
    color: COLORS.black,
  },
  socialLine: {
    flexDirection: "row",
    marginBottom: 1,
    alignItems: "baseline",
  },
  socialLabel: {
    fontFamily: CV_FONT_FAMILY,
    fontWeight: 700,
    fontSize: 9,
    color: COLORS.black,
    marginRight: 4,
  },
  socialLink: {
    fontSize: 8,
    color: COLORS.accent,
    textDecoration: "none",
  },

  /* ── Hobbies & Interests ────────────────────── */
  hobbiesText: {
    fontSize: 9,
    color: COLORS.dark,
    lineHeight: 1.3,
  },
});
