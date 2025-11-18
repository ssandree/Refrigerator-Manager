import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors, FontSizes } from "../../styles/common";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export default function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: FontSizes["2xl"],
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
  },
});
