import { Text, View } from "@react-pdf/renderer";
import { styles } from "@/lib/cv/cv-pdf.styles";

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
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
