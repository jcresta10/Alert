import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions, Platform, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, Region } from 'react-native-maps';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';
import { API_BASE } from '../config/api';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [pins, setPins] = useState<any[]>([]);
  const [userRegion, setUserRegion] = useState<Region>({
    latitude: -33.8688,
    longitude: 151.2093,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const fetchReports = async () => {
    try {
      const response = await fetch(`${API_BASE}/reports`);
      if (!response.ok) throw new Error('API issue');
      const data = await response.json();
      setPins(data);
    } catch (e) {
      console.log('Failed to fetch reports:', e);
    }
  };

  // Refresh reports whenever this screen comes back into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchReports();
    }, [])
  );

  useEffect(() => {
    const interval = setInterval(fetchReports, 15000);

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      
      try {
        let location = await Location.getLastKnownPositionAsync({});
        if (!location) {
          location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        }
        if (location) {
          setUserRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          });
        }
      } catch (e) {
        console.log('Location error:', e);
      }
    })();

    return () => clearInterval(interval);
  }, []);

  const getPinColor = (type: string) => {
    switch(type) {
      case 'delay': return colors.pins.delay;
      case 'crowding': return colors.pins.crowding;
      case 'disruption': return colors.pins.disruption;
      case 'inspection': return colors.pins.inspection;
      default: return colors.pins.safe;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search route/station..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.alertIcon} onPress={() => navigation.navigate('Alerts')}>
          <Ionicons name="notifications-outline" size={24} color={colors.text} />
          <View style={styles.alertBadge} />
        </TouchableOpacity>
      </View>

      <MapView
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        region={userRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {pins.map(pin => (
          <Marker
            key={pin.id}
            coordinate={{ latitude: pin.lat, longitude: pin.lng }}
            title={pin.title}
            description={`Reported: ${new Date(pin.timestamp).toLocaleTimeString()}`}
            pinColor={getPinColor(pin.type)}
            onPress={() => navigation.navigate('StationDetail', { pin })}
          />
        ))}
      </MapView>

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Report')}>
        <Ionicons name="add" size={28} color={colors.surface} />
        <Text style={styles.fabText}>Report</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  map: { flex: 1 },
  header: { position: 'absolute', top: Platform.OS === 'ios' ? 60 : 40, left: 20, right: 20, flexDirection: 'row', alignItems: 'center', zIndex: 10 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 12, paddingHorizontal: 15, height: 50, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: colors.text },
  alertIcon: { width: 50, height: 50, backgroundColor: colors.surface, borderRadius: 25, marginLeft: 15, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  alertBadge: { position: 'absolute', top: 12, right: 12, width: 10, height: 10, backgroundColor: colors.pins.disruption, borderRadius: 5 },
  fab: { position: 'absolute', bottom: 30, right: 20, backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  fabText: { color: colors.surface, fontSize: 16, fontWeight: '700', marginLeft: 5 }
});
