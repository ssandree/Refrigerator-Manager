import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Colors, FontSizes } from "../../src/styles/common";

export default function Notifications() {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>알림이 없습니다.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: FontSizes.lg,
    color: Colors.textTertiary,
    textAlign: "center",
  },
});
