import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Map, Camera, Marker, GeoJSONSource, Layer, UserLocation, CameraRef } from '@maplibre/maplibre-react-native';
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

interface LatLng {
  latitude: number;
  longitude: number;
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
  const cameraRef = useRef<CameraRef>(null);
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

  const getStyleURL = () => {
    const key = process.env.EXPO_PUBLIC_MAPTILER_API_KEY;
    if (key) {
      switch (mapStyle) {
        case 'dark':
          return `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${key}`;
        case 'satellite':
          return `https://api.maptiler.com/maps/hybrid/style.json?key=${key}`;
        case 'streets':
        default:
          return `https://api.maptiler.com/maps/outdoor-v2/style.json?key=${key}`;
      }
    } else {
      // Fallback style if no MapTiler API Key is found (standard MapLibre demo style JSON)
      return 'https://demotiles.maplibre.org/style.json';
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

      // 1. Attempt to get the last known location instantly (takes < 50ms)
      const lastKnown = await Location.getLastKnownPositionAsync({});
      let lastKnownCoords: [number, number] | null = null;
      
      if (lastKnown) {
        lastKnownCoords = [lastKnown.coords.longitude, lastKnown.coords.latitude];
        userLocationRef.current = {
          latitude: lastKnown.coords.latitude,
          longitude: lastKnown.coords.longitude,
        };
        cameraRef.current?.easeTo({
          center: lastKnownCoords,
          zoom: 15,
          duration: 800,
        });
      }

      // 2. Fetch fresh position (might take a few seconds if GPS is cold)
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const freshCoords: [number, number] = [loc.coords.longitude, loc.coords.latitude];
      userLocationRef.current = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };

      // Animate smoothly to the refined position, with a faster transition if we already centered
      cameraRef.current?.easeTo({
        center: freshCoords,
        zoom: 15,
        duration: lastKnownCoords ? 500 : 1000,
      });
    } catch (error) {
      if (userLocationRef.current && cameraRef.current) {
        cameraRef.current.easeTo({
          center: [userLocationRef.current.longitude, userLocationRef.current.latitude],
          zoom: 15,
          duration: 1000,
        });
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
        // Fallback: straight line
      }
    };

    fetchRoute();
  }, [startLat, startLng, endLat, endLng]);

  // Fit map to coordinates only once initially, and once when driver first joins.
  const initialFitDone = useRef(false);
  const driverJoined = useRef(false);

  const handleCenterOnTrip = () => {
    if (!cameraRef.current) return;
    const lats = [startLat, endLat];
    const lngs = [startLng, endLng];
    if (driverLat && driverLng) {
      lats.push(driverLat);
      lngs.push(driverLng);
    }
    const maxLat = Math.max(...lats);
    const minLat = Math.min(...lats);
    const maxLng = Math.max(...lngs);
    const minLng = Math.min(...lngs);

    cameraRef.current.fitBounds(
      [minLng, minLat, maxLng, maxLat],
      {
        padding: { top: 60, right: 60, bottom: 120, left: 60 },
        duration: 1000,
      }
    );
  };

  useEffect(() => {
    const hasDriver = !!(driverLat && driverLng);
    const shouldFit = !initialFitDone.current || (hasDriver && !driverJoined.current);

    if (shouldFit) {
      if (hasDriver) {
        driverJoined.current = true;
      }
      initialFitDone.current = true;

      setTimeout(() => {
        handleCenterOnTrip();
      }, 500);
    }
  }, [startLat, startLng, driverLat, driverLng]);

  // Generate GeoJSON line coordinates
  const getLineCoordinates = (): number[][] => {
    if (routeCoords.length > 1) {
      return routeCoords.map((c) => [c.longitude, c.latitude]);
    }
    return [
      [startLng, startLat],
      [endLng, endLat],
    ];
  };

  return (
    <View style={styles.container}>
      <Map
        style={styles.map}
        mapStyle={getStyleURL()}
        logo={false}
        attribution={false}
        compass={true}
        compassPosition={isRTL ? { bottom: 112, right: 20 } : { bottom: 112, left: 20 }}
      >
        <Camera
          ref={cameraRef}
          initialViewState={{
            center: [(startLng + endLng) / 2, (startLat + endLat) / 2],
            zoom: 10,
          }}
        />

        {/* User Location */}
        <UserLocation />

        {/* Route Line */}
        <GeoJSONSource
          id="routeSource"
          data={{
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: getLineCoordinates(),
            },
            properties: {},
          }}
        >
          <Layer
            id="routeLine"
            type="line"
            paint={{
              'line-color': Colors.primary,
              'line-width': 4,
            }}
            layout={{
              'line-cap': 'round',
              'line-join': 'round',
            }}
          />
        </GeoJSONSource>

        {/* Start Point Marker */}
        <Marker id="startPoint" lngLat={[startLng, startLat]}>
          <View style={[styles.markerCircle, { backgroundColor: Colors.primary }]}>
            <Ionicons name="radio-button-on" size={16} color={Colors.white} />
          </View>
        </Marker>

        {/* End Point Marker */}
        <Marker id="endPoint" lngLat={[endLng, endLat]}>
          <View style={[styles.markerCircle, { backgroundColor: Colors.secondary }]}>
            <Ionicons name="flag" size={16} color={Colors.white} />
          </View>
        </Marker>

        {/* Driver Location Marker */}
        {driverLat && driverLng && (
          <Marker id="driverPoint" lngLat={[driverLng, driverLat]}>
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
      </Map>

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
    flex: 1,
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
