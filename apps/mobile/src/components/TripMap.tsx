import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline, UrlTile, PROVIDER_DEFAULT, LatLng } from 'react-native-maps';
import { Colors } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../hooks/useTranslation';
import * as Location from 'expo-location';

interface TripMapProps {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  driverLat: number | null;
  driverLng: number | null;
  mapStyle?: 'streets' | 'dark' | 'satellite';
}

export const TripMap: React.FC<TripMapProps> = ({
  startLat,
  startLng,
  endLat,
  endLng,
  driverLat,
  driverLng,
  mapStyle = 'streets',
}) => {
    const mapRef = useRef<MapView>(null);
  const { t, isRTL } = useTranslation();

  // Cache OSRM route — fetch once, never re-fetch on driver location updates
  const [routeCoords, setRouteCoords] = useState<LatLng[]>([]);
  const [isLocating, setIsLocating] = useState(false);
  const routeFetched = useRef(false);
  
  // Track user location
  const userLocationRef = useRef<LatLng | null>(null);

  // Request permissions and seed location on mount
  useEffect(() => {
    const requestPermission = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          userLocationRef.current = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          };
        }
      } catch {
        // Fail silently on mount permissions check
      }
    };
    requestPermission();
  }, []);

  const getUrlTemplate = () => {
    const key = process.env.EXPO_PUBLIC_MAPTILER_API_KEY;
    if (key) {
      switch (mapStyle) {
        case 'dark':
          return `https://api.maptiler.com/maps/dataviz-dark/256/{z}/{x}/{y}.png?key=${key}`;
        case 'satellite':
          return `https://api.maptiler.com/maps/hybrid/256/{z}/{x}/{y}.png?key=${key}`;
        case 'streets':
        default:
          return `https://api.maptiler.com/maps/outdoor-v2/256/{z}/{x}/{y}.png?key=${key}`;
      }
    } else {
      switch (mapStyle) {
        case 'dark':
          return 'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png';
        case 'satellite':
          return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        case 'streets':
        default:
          return 'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'; // Voyager is a rich streets basemap
      }
    }
  };

  const handleCenterOnUser = async () => {
    if (isLocating) return;
    setIsLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          t('alert') || 'تنبيه',
          t('location_permission_denied') || 'تم رفض صلاحية الوصول للموقع. يرجى تفعيلها من الإعدادات.'
        );
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coords = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };

      userLocationRef.current = coords;

      if (mapRef.current) {
        mapRef.current.animateToRegion(
          {
            ...coords,
            latitudeDelta: 0.015,
            longitudeDelta: 0.015,
          },
          1000
        );
      }
    } catch (error) {
      // Fallback if getCurrentPositionAsync fails, try to use ref if available
      if (userLocationRef.current && mapRef.current) {
        mapRef.current.animateToRegion(
          {
            latitude: userLocationRef.current.latitude,
            longitude: userLocationRef.current.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.015,
          },
          1000
        );
      } else {
        Alert.alert(
          t('error') || 'خطأ',
          t('location_fetch_error') || 'تعذر تحديد موقعك الحالي. يرجى التأكد من تفعيل الـ GPS.'
        );
      }
    } finally {
      setIsLocating(false);
    }
  };

  useEffect(() => {
    if (routeFetched.current) return;
    routeFetched.current = true;

    const fetchRoute = async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const json = await res.json();
        if (json.routes?.[0]?.geometry?.coordinates) {
          const coords: LatLng[] = json.routes[0].geometry.coordinates.map(
            ([lng, lat]: [number, number]) => ({ latitude: lat, longitude: lng }),
          );
          setRouteCoords(coords);
        }
      } catch {
        // Fallback: straight line (already rendered below)
      }
    };

    fetchRoute();
  }, [startLat, startLng, endLat, endLng]);

  // Fit map to coordinates only once initially, and once when driver first joins.
  const initialFitDone = useRef(false);
  const driverJoined = useRef(false);

  useEffect(() => {
    if (mapRef.current) {
      const hasDriver = !!(driverLat && driverLng);
      const shouldFit = !initialFitDone.current || (hasDriver && !driverJoined.current);

      if (shouldFit) {
        const coordinates = [
          { latitude: startLat, longitude: startLng },
          { latitude: endLat, longitude: endLng },
        ];
        if (hasDriver) {
          coordinates.push({ latitude: driverLat!, longitude: driverLng! });
          driverJoined.current = true;
        }
        initialFitDone.current = true;

        setTimeout(() => {
          mapRef.current?.fitToCoordinates(coordinates, {
            edgePadding: { top: 60, right: 60, bottom: 120, left: 60 },
            animated: true,
          });
        }, 500);
      }
    }
  }, [startLat, startLng, driverLat, driverLng]);

  // Manual re-centering to fit whole trip
  const handleCenterOnTrip = () => {
    if (mapRef.current) {
      const coordinates = [
        { latitude: startLat, longitude: startLng },
        { latitude: endLat, longitude: endLng },
      ];
      if (driverLat && driverLng) {
        coordinates.push({ latitude: driverLat, longitude: driverLng });
      }
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 60, right: 60, bottom: 120, left: 60 },
        animated: true,
      });
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        showsUserLocation={true}
        showsMyLocationButton={false}
        onUserLocationChange={(event) => {
          if (event.nativeEvent.coordinate) {
            userLocationRef.current = {
              latitude: event.nativeEvent.coordinate.latitude,
              longitude: event.nativeEvent.coordinate.longitude,
            };
          }
        }}
        initialRegion={{
          latitude: (startLat + endLat) / 2,
          longitude: (startLng + endLng) / 2,
          latitudeDelta: Math.abs(startLat - endLat) * 2 || 0.05,
          longitudeDelta: Math.abs(startLng - endLng) * 2 || 0.05,
        }}
      >
        <UrlTile
          urlTemplate={getUrlTemplate()}
          tileSize={256}
          maximumZ={19}
          flipY={false}
          shouldReplaceMapContent={true}
        />
        {/* Route Line — OSRM or fallback straight line */}
        {routeCoords.length > 1 ? (
          <Polyline
            coordinates={routeCoords}
            strokeColor={Colors.primary}
            strokeWidth={4}
            lineCap="round"
            lineJoin="round"
          />
        ) : (
          <Polyline
            coordinates={[
              { latitude: startLat, longitude: startLng },
              { latitude: endLat, longitude: endLng },
            ]}
            strokeColor={Colors.primary}
            strokeWidth={4}
            lineDashPattern={[10, 5]}
            lineCap="round"
            lineJoin="round"
          />
        )}

        {/* Start Point */}
        <Marker coordinate={{ latitude: startLat, longitude: startLng }} title={t('start_point')}>
          <View style={[styles.markerCircle, { backgroundColor: Colors.primary }]}>
            <Ionicons name="radio-button-on" size={16} color={Colors.white} />
          </View>
        </Marker>

        {/* End Point */}
        <Marker coordinate={{ latitude: endLat, longitude: endLng }} title={t('end_point')}>
          <View style={[styles.markerCircle, { backgroundColor: Colors.secondary }]}>
            <Ionicons name="flag" size={16} color={Colors.white} />
          </View>
        </Marker>

        {/* Driver Point */}
        {driverLat && driverLng && (
          <Marker
            coordinate={{ latitude: driverLat, longitude: driverLng }}
            title={t('driver_location')}
          >
            <View
              style={[
                styles.markerCircle,
                { backgroundColor: Colors.success, width: 36, height: 36, borderRadius: 18 },
              ]}
            >
              <Ionicons name="car" size={20} color={Colors.white} />
            </View>
          </Marker>
        )}
      </MapView>

      {/* Floating Center on Trip Button */}
      <TouchableOpacity
        style={[styles.tripCenterButton, isRTL ? { left: 16 } : { right: 16 }]}
        onPress={handleCenterOnTrip}
        activeOpacity={0.7}
      >
        <Ionicons name="map" size={22} color={Colors.primary} />
      </TouchableOpacity>

      {/* Floating My Location Button */}
      <TouchableOpacity
        style={[styles.locateButton, isRTL ? { left: 16 } : { right: 16 }]}
        onPress={handleCenterOnUser}
        activeOpacity={0.7}
        disabled={isLocating}
      >
        {isLocating ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
          <Ionicons name="locate" size={22} color={Colors.primary} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 12,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  markerCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  locateButton: {
    position: 'absolute',
    bottom: 112,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 100,
  },
  tripCenterButton: {
    position: 'absolute',
    bottom: 168,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 100,
  },
});
