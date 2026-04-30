import { StyleSheet } from "@react-pdf/renderer";

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
    paddingTop: 32,
    paddingRight: 36,
    paddingBottom: 28,
    paddingLeft: 36,
    fontSize: 10,
    fontFamily: "Helvetica",
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
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: COLORS.black,
    marginBottom: 10,
  },
  jobTitle: {
    fontSize: 11,
    color: COLORS.muted,
    marginBottom: 8,
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
    marginTop: 9,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
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
    lineHeight: 1.45,
  },

  /* ── Experience / Education items ───────────── */
  item: {
    marginBottom: 7,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  itemTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10.5,
    color: COLORS.black,
  },
  itemPeriod: {
    fontSize: 9,
    color: COLORS.muted,
    fontFamily: "Helvetica-Oblique",
  },
  itemSubRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 2,
  },
  itemCompanyGroup: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  itemCompany: {
    fontSize: 9.5,
    color: COLORS.dark,
    fontFamily: "Helvetica-Oblique",
  },
  itemCompanyLink: {
    fontSize: 8.5,
    color: COLORS.accent,
    textDecoration: "none",
  },
  itemLocation: {
    fontSize: 9,
    color: COLORS.muted,
  },
  bullet: {
    flexDirection: "row",
    marginBottom: 1,
    paddingLeft: 6,
  },
  bulletDot: {
    width: 8,
    fontSize: 9.5,
    color: COLORS.dark,
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
    color: COLORS.dark,
    lineHeight: 1.4,
  },

  /* ── Skills ─────────────────────────────────── */
  skillsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skillRow: {
    flexDirection: "row",
    width: "50%",
    marginBottom: 2,
    paddingRight: 8,
  },
  skillLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
    color: COLORS.black,
    width: 76,
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
    fontFamily: "Helvetica-Bold",
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
    fontFamily: "Helvetica-Oblique",
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
    fontFamily: "Helvetica-Bold",
    color: COLORS.black,
  },
  socialLine: {
    flexDirection: "row",
    marginBottom: 1.5,
    alignItems: "baseline",
  },
  socialLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
    color: COLORS.black,
    marginRight: 4,
  },
  socialLink: {
    fontSize: 9,
    color: COLORS.accent,
    textDecoration: "none",
  },
});
