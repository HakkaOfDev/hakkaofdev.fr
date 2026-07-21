import { Text, View } from "@react-pdf/renderer";
import { styles } from "@/lib/cv/cv-pdf.styles";

export function Section({
  title,
  children,
  keepTogether = false,
}: {
  title: string;
  children: React.ReactNode;
  /** Keep the whole section on a single page: react-pdf moves it to the next
      page rather than splitting it (and stranding the title) across a break.
      Only use for sections short enough to never exceed one page. */
  keepTogether?: boolean;
}) {
  return (
    <View style={styles.section} wrap={!keepTogether}>
      <View style={styles.sectionHeader} wrap={false}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.sectionRule} />
      </View>
      {children}
    </View>
  );
}

export function Sep() {
  return <Text style={styles.contactSep}>|</Text>;
}

export function BulletItem({ text }: { text: string }) {
  return <Text style={styles.bulletText}>{`•  ${text}`}</Text>;
}
