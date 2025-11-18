import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import SettingsMenu from "../../src/components/tabs/myinfo/SettingsMenu";
import { Colors } from "../../src/styles/common";

export default function Settings() {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SettingsMenu />
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
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});
