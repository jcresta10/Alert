import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function AlertsScreen() {
  const navigation = useNavigation<any>();

  const alerts = [
    { id: 1, type: 'delay', text: 'Delay on Line A', time: '5 mins ago', icon: 'time', color: colors.pins.delay },
    { id: 2, type: 'crowding', text: 'High crowding at Central', time: '12 mins ago', icon: 'people', color: colors.pins.crowding },
    { id: 3, type: 'inspection', text: 'Activity reported nearby', time: '20 mins ago', icon: 'shield', color: colors.pins.inspection },
  ];

  return (
    <ScrollView style={styles.container}>
      {alerts.map(alert => (
        <TouchableOpacity key={alert.id} style={styles.alertCard} onPress={() => navigation.navigate('Home')}>
          <View style={[styles.iconBox, { backgroundColor: alert.color + '20' }]}>
            <Ionicons name={alert.icon as any} size={24} color={alert.color} />
          </View>
          <View style={styles.alertContent}>
            <Text style={styles.alertText}>{alert.text}</Text>
            <Text style={styles.alertTime}>{alert.time}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  alertCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, padding: 16, borderRadius: 12, marginBottom: 12 },
  iconBox: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  alertContent: { flex: 1 },
  alertText: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 4 },
  alertTime: { fontSize: 13, color: colors.textSecondary },
});
