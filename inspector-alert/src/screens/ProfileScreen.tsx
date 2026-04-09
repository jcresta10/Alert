import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color={colors.surface} />
        </View>
        <Text style={styles.name}>Anonymous User</Text>
        <Text style={styles.reputation}>Reputation Score: ⭐ 120</Text>
      </View>

      <Text style={styles.sectionTitle}>Contributions</Text>
      <View style={styles.statsCard}>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>34</Text>
          <Text style={styles.statLabel}>Reports Submitted</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNum}>89</Text>
          <Text style={styles.statLabel}>Helpful Votes</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Badges</Text>
      <View style={styles.badgesWrapper}>
        <View style={styles.badge}>
          <Ionicons name="shield-checkmark" size={20} color={colors.pins.safe} />
          <Text style={styles.badgeText}>Trusted Reporter</Text>
        </View>
        <View style={styles.badge}>
          <Ionicons name="star" size={20} color={colors.primary} />
          <Text style={styles.badgeText}>Active Contributor</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { alignItems: 'center', padding: 30, backgroundColor: colors.surface, borderBottomWidth: 1, borderColor: colors.border },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  name: { fontSize: 22, fontWeight: 'bold', color: colors.text, marginBottom: 5 },
  reputation: { fontSize: 16, color: colors.pins.crowding, fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text, margin: 20, marginBottom: 10 },
  statsCard: { flexDirection: 'row', backgroundColor: colors.surface, marginHorizontal: 20, borderRadius: 12, padding: 20 },
  statBox: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: colors.border },
  statNum: { fontSize: 24, fontWeight: 'bold', color: colors.primary, marginBottom: 5 },
  statLabel: { fontSize: 14, color: colors.textSecondary, textAlign: 'center' },
  badgesWrapper: { flexDirection: 'row', paddingHorizontal: 20, gap: 10 },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, padding: 12, borderRadius: 20, gap: 8 },
  badgeText: { fontSize: 14, fontWeight: '600', color: colors.text },
});
