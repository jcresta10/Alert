import React from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function RoutePlannerScreen() {
  const navigation = useNavigation<any>();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputCard}>
        <View style={styles.inputRow}>
          <Ionicons name="radio-button-on" size={20} color={colors.primary} />
          <TextInput style={styles.input} placeholder="Current Location" value="Central Station" />
        </View>
        <View style={styles.connector} />
        <View style={styles.inputRow}>
          <Ionicons name="location" size={20} color={colors.pins.disruption} />
          <TextInput style={styles.input} placeholder="Where to?" />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Suggested Routes</Text>
      
      <View style={styles.routeCard}>
        <View style={styles.routeHeader}>
          <Text style={styles.routeTitle}>Fastest</Text>
          <Text style={styles.routeTime}>12 min</Text>
        </View>
        <Text style={styles.routeDesc}>Moderate crowd • Line T4</Text>
        <TouchableOpacity style={styles.mapBtn} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.mapBtnTxt}>View on Map</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.routeCard}>
        <View style={styles.routeHeader}>
          <Text style={styles.routeTitle}>Less crowded</Text>
          <Text style={styles.routeTime}>18 min</Text>
        </View>
        <Text style={styles.routeDesc}>Walk to Museum Stn • Avoids Central transfer</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  inputCard: { backgroundColor: colors.surface, padding: 20, borderRadius: 16, marginBottom: 25 },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, marginLeft: 15, fontSize: 16, borderBottomWidth: 1, borderColor: colors.border, paddingVertical: 10 },
  connector: { width: 2, height: 20, backgroundColor: colors.border, marginLeft: 9, marginVertical: 5 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 15, color: colors.text },
  routeCard: { backgroundColor: colors.surface, padding: 16, borderRadius: 12, marginBottom: 15 },
  routeHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  routeTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  routeTime: { fontSize: 16, fontWeight: 'bold', color: colors.primary },
  routeDesc: { fontSize: 14, color: colors.textSecondary, marginBottom: 10 },
  mapBtn: { backgroundColor: colors.primary + '20', padding: 10, borderRadius: 8, alignItems: 'center' },
  mapBtnTxt: { color: colors.primary, fontWeight: '600' }
});
