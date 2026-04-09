import React from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { colors } from '../theme/colors';

export default function SettingsScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.row}>
          <Text style={styles.rowText}>Push Notifications</Text>
          <Switch value={true} />
        </View>
        <View style={styles.row}>
          <Text style={styles.rowText}>Anonymous Mode (Privacy)</Text>
          <Switch value={true} trackColor={{ true: colors.primary }} />
        </View>
        <View style={styles.row}>
          <Text style={styles.rowText}>Dark Theme</Text>
          <Switch value={false} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About & Legal</Text>
        <View style={styles.row}>
          <Text style={styles.rowText}>Terms & Safety Disclaimer</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowText}>Data Usage Policy</Text>
        </View>
      </View>
      
      <Text style={styles.disclaimer}>
        Disclaimer: This app provides community-powered transport insights. Users must ensure lawful travel at all times.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  section: { marginTop: 20, backgroundColor: colors.surface, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: colors.textSecondary, paddingHorizontal: 20, paddingTop: 15, paddingBottom: 5 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: colors.border },
  rowText: { fontSize: 16, color: colors.text },
  disclaimer: { margin: 20, fontSize: 13, color: colors.textSecondary, textAlign: 'center', fontStyle: 'italic', lineHeight: 20 }
});
