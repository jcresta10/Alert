import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Platform, Alert } from 'react-native';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { API_BASE } from '../config/api';

const CATEGORIES = [
  { id: 'delay', label: 'Delay', icon: 'time-outline', color: colors.pins.delay },
  { id: 'crowding', label: 'Crowding', icon: 'people-outline', color: colors.pins.crowding },
  { id: 'disruption', label: 'Disruption', icon: 'warning-outline', color: colors.pins.disruption },
  { id: 'inspection', label: 'Inspection Activity', icon: 'shield-checkmark-outline', color: colors.pins.inspection },
];

export default function ReportScreen() {
  const navigation = useNavigation();
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [locationText, setLocationText] = useState('Detecting location...');
  const [isLocating, setIsLocating] = useState(true);
  const [coords, setCoords] = useState<{lat: number, lng: number}>({ lat: -33.8688, lng: 151.2093 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationText('Location denied – using default');
        setIsLocating(false);
        return;
      }

      try {
        let loc = await Location.getLastKnownPositionAsync({});
        if (!loc) {
          loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        }
        
        if (loc) {
          setCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });
          try {
            let reverseGeo = await Location.reverseGeocodeAsync({
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude
            });
            if (reverseGeo && reverseGeo.length > 0) {
              let addr = reverseGeo[0];
              const bestName = addr.street || addr.name || addr.district || 'Unknown';
              const bestCity = addr.city || addr.region || '';
              setLocationText(`Near ${bestName}, ${bestCity}`);
            } else {
              setLocationText(`${loc.coords.latitude.toFixed(4)}, ${loc.coords.longitude.toFixed(4)}`);
            }
          } catch {
            setLocationText(`${loc.coords.latitude.toFixed(4)}, ${loc.coords.longitude.toFixed(4)}`);
          }
        } else {
          throw new Error("No location");
        }
      } catch (e) {
        setLocationText('Default location (Sydney)');
      } finally {
        setIsLocating(false);
      }
    })();
  }, []);

  const handleSubmit = async () => {
    if (!selectedCat) {
      Alert.alert("Select a Category", "Tap one of the report types above first.");
      return;
    }

    setIsSubmitting(true);
    const catLabel = CATEGORIES.find(c => c.id === selectedCat)?.label || 'Report';
    const payload = {
      type: selectedCat,
      lat: coords.lat,
      lng: coords.lng,
      title: catLabel,
      note: note
    };

    try {
      const url = `${API_BASE}/reports`;
      console.log('Submitting to:', url, payload);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const responseText = await response.text();
      console.log('Response:', response.status, responseText);

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${responseText}`);
      }

      Alert.alert("Report Submitted!", "Your report is now live on the map.", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (e: any) {
      console.error('Submit error:', e);
      Alert.alert(
        "Submission Failed",
        `Could not reach the server.\n\nMake sure:\n1. Backend is running (node server.js)\n2. Phone and PC are on same Wi-Fi\n\nServer: ${API_BASE}\nError: ${e.message}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCategory = (item: typeof CATEGORIES[0]) => (
    <TouchableOpacity 
      key={item.id} 
      style={[
        styles.catCard, 
        selectedCat === item.id && { borderColor: item.color, backgroundColor: item.color + '15' }
      ]}
      onPress={() => setSelectedCat(item.id)}
    >
      <Ionicons name={item.icon as any} size={28} color={item.color} />
      <Text style={styles.catLabel}>{item.label}</Text>
      {selectedCat === item.id && <Ionicons name="checkmark-circle" size={20} color={item.color} />}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>What's happening?</Text>
      
      <View style={styles.grid}>
        {CATEGORIES.map(renderCategory)}
      </View>

      <Text style={styles.sectionTitle}>Location</Text>
      <View style={styles.locationBox}>
        {isLocating ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Ionicons name="location" size={20} color={colors.primary} />
        )}
        <Text style={styles.locationText}>{locationText}</Text>
      </View>

      <Text style={styles.sectionTitle}>Optional Note</Text>
      <TextInput
        style={styles.input}
        placeholder="Add details (e.g. Platform 3 is packed)"
        value={note}
        onChangeText={setNote}
        multiline
      />

      <TouchableOpacity 
        style={[styles.submitButton, isSubmitting && styles.submitDisabled]} 
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color={colors.surface} />
        ) : (
          <Text style={styles.submitText}>Submit Report</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  title: { fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: 20 },
  grid: { flexDirection: 'column', gap: 12, marginBottom: 24 },
  catCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    padding: 16, borderRadius: 12, borderWidth: 2, borderColor: 'transparent',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  catLabel: { fontSize: 16, fontWeight: '600', color: colors.text, marginLeft: 16, flex: 1 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.textSecondary, marginBottom: 10 },
  locationBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, padding: 16, borderRadius: 12, marginBottom: 24 },
  locationText: { marginLeft: 10, fontSize: 16, color: colors.text, fontWeight: '500' },
  input: { backgroundColor: colors.surface, borderRadius: 12, padding: 16, fontSize: 16, minHeight: 100, textAlignVertical: 'top', marginBottom: 30 },
  submitButton: { backgroundColor: colors.primary, padding: 16, borderRadius: 30, alignItems: 'center', marginBottom: 40 },
  submitDisabled: { backgroundColor: colors.border },
  submitText: { color: colors.surface, fontSize: 18, fontWeight: '700' },
});
