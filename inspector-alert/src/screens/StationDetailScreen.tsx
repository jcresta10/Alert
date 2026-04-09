import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';

export default function StationDetailScreen() {
  const route = useRoute<RouteProp<{ params: { pin: any } }>>();
  const { pin } = route.params || { pin: { title: 'Unknown Station', type: 'safe' } };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerCard}>
        <Ionicons name="train" size={40} color={colors.primary} />
        <Text style={styles.stationName}>{pin.title}</Text>
        <Text style={styles.statusText}>Current Status</Text>
      </View>

      <View style={styles.summaryBox}>
        <Text style={styles.sectionTitle}>Status Summary</Text>
        <View style={styles.statusRow}>
          <View style={[styles.dot, { backgroundColor: colors.pins.crowding }]} />
          <Text style={styles.statusDetail}>Moderate Crowding</Text>
        </View>
        <View style={styles.statusRow}>
           <View style={[styles.dot, { backgroundColor: colors.pins.delay }]} />
          <Text style={styles.statusDetail}>Minor Delays Expected</Text>
        </View>
        {pin.type === 'inspection' && (
          <View style={styles.statusRow}>
             <View style={[styles.dot, { backgroundColor: colors.pins.inspection }]} />
            <Text style={styles.statusDetail}>Inspection Activity Reported</Text>
          </View>
        )}
      </View>

      <Text style={styles.sectionTitle}>Recent Reports</Text>
      <View style={styles.reportCard}>
        <Text style={styles.reportTime}>2 mins ago</Text>
        <Text style={styles.reportText}>"Busy platform on line 4"</Text>
        <View style={styles.voteRow}>
          <TouchableOpacity style={styles.voteBtn}>
            <Ionicons name="thumbs-up-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.voteTxt}>Helpful (12)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.voteBtn}>
            <Ionicons name="thumbs-down-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.voteTxt}>Not valid</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.reportCard}>
        <Text style={styles.reportTime}>10 mins ago</Text>
        <Text style={styles.reportText}>"Train delayed by ~5 mins"</Text>
        <View style={styles.voteRow}>
          <TouchableOpacity style={styles.voteBtn}>
            <Ionicons name="thumbs-up-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.voteTxt}>Helpful (5)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.voteBtn}>
            <Ionicons name="thumbs-down-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.voteTxt}>Not valid</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.updateBtn}>
        <Text style={styles.updateBtnText}>Report Update</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  headerCard: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  stationName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 10,
  },
  statusText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 5,
  },
  summaryBox: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 15,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  statusDetail: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  reportCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  reportTime: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 5,
  },
  reportText: {
    fontSize: 16,
    color: colors.text,
    fontStyle: 'italic',
    marginBottom: 15,
  },
  voteRow: {
    flexDirection: 'row',
    gap: 15,
  },
  voteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 5,
  },
  voteTxt: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  updateBtn: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  updateBtnText: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: 'bold',
  }
});
