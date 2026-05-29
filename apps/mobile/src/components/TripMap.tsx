import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import type { CameraRef } from '@maplibre/maplibre-react-native';
import MapView, { Marker as RNMarker, Polyline as RNPolyline } from 'react-native-maps';
import { Colors } from '../theme';
import { logger } from '../lib/logger';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../hooks/useTranslation';
import * as Location from 'expo-location';

let MapLibre: typeof import('@maplibre/maplibre-react-native') | null = null;
try {
  MapLibre = require('@maplibre/maplibre-react-native');
} catch (e) {
  console.warn('MapLibre is not available in this environment. Falling back to react-native-maps.');
}

const isMapLibreAvailable = !!MapLibre;

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

const TripMapInner: React.FC<TripMapProps> = ({
  startLat,
  startLng,
  endLat,
  endLng,
  driverLat,
  driverLng,
  mapStyle = 'streets',
}) => {
  const mapLibreCameraRef = useRef<import('@maplibre/maplibre-react-native').CameraRef | null>(
    null,
  );
  const mapViewRef = useRef<MapView | null>(null);
  const { t, isRTL } = useTranslation();

  // Pulsating beacon for driver marker
  const beaconScale = useRef(new Animated.Value(1)).current;
  const beaconOpacity = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.parallel([
        Animated.timing(beaconScale, {
          toValue: 2.4,
          duration: 1600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(beaconOpacity, {
          toValue: 0,
          duration: 1600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]),
    );
    if (driverLat && driverLng) {
      beaconScale.setValue(1);
      beaconOpacity.setValue(0.7);
      anim.start();
    } else {
      anim.stop();
    }
    return () => anim.stop();
  }, [driverLat, driverLng]);

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
          t('location_permission_denied') ||
            'تم رفض صلاحية الوصول للموقع. يرجى تفعيلها من الإعدادات.',
        );
        return;
      }

      // 1. Attempt to get the last known location instantly (takes < 50ms)
      const lastKnown = await Location.getLastKnownPositionAsync({});
      let lastKnownCoords: LatLng | null = null;

      if (lastKnown) {
        lastKnownCoords = {
          latitude: lastKnown.coords.latitude,
          longitude: lastKnown.coords.longitude,
        };
        userLocationRef.current = lastKnownCoords;
        if (isMapLibreAvailable) {
          mapLibreCameraRef.current?.easeTo({
            center: [lastKnownCoords.longitude, lastKnownCoords.latitude],
            zoom: 15,
            duration: 800,
          });
        } else {
          mapViewRef.current?.animateCamera(
            {
              center: lastKnownCoords,
              zoom: 15,
            },
            { duration: 800 },
          );
        }
      }

      // 2. Fetch fresh position (might take a few seconds if GPS is cold)
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const freshCoords: LatLng = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };
      userLocationRef.current = freshCoords;

      // Animate smoothly to the refined position, with a faster transition if we already centered
      if (isMapLibreAvailable) {
        mapLibreCameraRef.current?.easeTo({
          center: [freshCoords.longitude, freshCoords.latitude],
          zoom: 15,
          duration: lastKnownCoords ? 500 : 1000,
        });
      } else {
        mapViewRef.current?.animateCamera(
          {
            center: freshCoords,
            zoom: 15,
          },
          { duration: lastKnownCoords ? 500 : 1000 },
        );
      }
    } catch (error) {
      if (userLocationRef.current) {
        if (isMapLibreAvailable) {
          mapLibreCameraRef.current?.easeTo({
            center: [userLocationRef.current.longitude, userLocationRef.current.latitude],
            zoom: 15,
            duration: 1000,
          });
        } else {
          mapViewRef.current?.animateCamera(
            {
              center: userLocationRef.current,
              zoom: 15,
            },
            { duration: 1000 },
          );
        }
      } else {
        Alert.alert(
          t('error') || 'خطأ',
          t('location_fetch_error') || 'تعذر تحديد موقعك الحالي. يرجى التأكد من تفعيل الـ GPS.',
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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
        const res = await fetch(url, { signal: controller.signal });
        const json = await res.json();
        if (json.routes?.[0]?.geometry?.coordinates) {
          const coords: LatLng[] = json.routes[0].geometry.coordinates.map(
            ([lng, lat]: [number, number]) => ({ latitude: lat, longitude: lng }),
          );
          setRouteCoords(coords);
        }
      } catch (err) {
        // Fallback: straight line (also handles AbortError on timeout)
        setRouteCoords([
          { latitude: startLat, longitude: startLng },
          { latitude: endLat, longitude: endLng },
        ]);
      } finally {
        clearTimeout(timeoutId);
      }
    };

    fetchRoute();
  }, [startLat, startLng, endLat, endLng]);

  // Fit map to coordinates only once initially, and once when driver first joins.
  const initialFitDone = useRef(false);
  const driverJoined = useRef(false);

  const handleCenterOnTrip = () => {
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

    if (isMapLibreAvailable) {
      if (!mapLibreCameraRef.current) return;
      mapLibreCameraRef.current.fitBounds([minLng, minLat, maxLng, maxLat], {
        padding: { top: 60, right: 60, bottom: 120, left: 60 },
        duration: 1000,
      });
    } else {
      if (!mapViewRef.current) return;
      const coords = [
        { latitude: startLat, longitude: startLng },
        { latitude: endLat, longitude: endLng },
      ];
      if (driverLat && driverLng) {
        coords.push({ latitude: driverLat, longitude: driverLng });
      }
      mapViewRef.current.fitToCoordinates(coords, {
        edgePadding: { top: 60, right: 60, bottom: 120, left: 60 },
        animated: true,
      });
    }
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
      {isMapLibreAvailable ? (
        <MapLibre.Map
          style={styles.map}
          mapStyle={getStyleURL()}
          logo={false}
          attribution={false}
          compass={true}
          compassPosition={isRTL ? { bottom: 112, right: 20 } : { bottom: 112, left: 20 }}
        >
          <MapLibre.Camera
            ref={mapLibreCameraRef}
            initialViewState={{
              center: [(startLng + endLng) / 2, (startLat + endLat) / 2],
              zoom: 10,
            }}
          />

          {/* User Location */}
          <MapLibre.UserLocation />

          {/* Route Line */}
          <MapLibre.GeoJSONSource
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
            <MapLibre.Layer
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
          </MapLibre.GeoJSONSource>

          {/* Start Point Marker */}
          <MapLibre.Marker id="startPoint" lngLat={[startLng, startLat]}>
            <View style={[styles.markerCircle, { backgroundColor: Colors.primary }]}>
              <Ionicons name="radio-button-on" size={16} color={Colors.white} />
            </View>
          </MapLibre.Marker>

          {/* End Point Marker */}
          <MapLibre.Marker id="endPoint" lngLat={[endLng, endLat]}>
            <View style={[styles.markerCircle, { backgroundColor: Colors.secondary }]}>
              <Ionicons name="flag" size={16} color={Colors.white} />
            </View>
          </MapLibre.Marker>

          {/* Driver Location Marker — Animated Beacon */}
          {driverLat && driverLng && (
            <MapLibre.Marker id="driverPoint" lngLat={[driverLng, driverLat]}>
              <View style={styles.driverMarkerWrapper}>
                {/* Pulsating beacon ring */}
                <Animated.View
                  style={[
                    styles.beaconRing,
                    {
                      transform: [{ scale: beaconScale }],
                      opacity: beaconOpacity,
                    },
                  ]}
                />
                {/* Core bus icon */}
                <View style={styles.driverMarkerCore}>
                  <View style={styles.driverInnerRing} />
                  <Ionicons name="bus" size={16} color={Colors.white} />
                </View>
              </View>
            </MapLibre.Marker>
          )}
        </MapLibre.Map>
      ) : (
        <MapView
          ref={mapViewRef}
          style={styles.map}
          initialRegion={{
            latitude: (startLat + endLat) / 2,
            longitude: (startLng + endLng) / 2,
            latitudeDelta: Math.abs(startLat - endLat) * 1.5 || 0.05,
            longitudeDelta: Math.abs(startLng - endLng) * 1.5 || 0.05,
          }}
          showsUserLocation={true}
          showsCompass={true}
        >
          {/* Route Line */}
          <RNPolyline
            coordinates={
              routeCoords.length > 1
                ? routeCoords
                : [
                    { latitude: startLat, longitude: startLng },
                    { latitude: endLat, longitude: endLng },
                  ]
            }
            strokeColor={Colors.primary}
            strokeWidth={4}
          />

          {/* Start Point Marker */}
          <RNMarker
            coordinate={{ latitude: startLat, longitude: startLng }}
            title={t('start_point')}
          >
            <View style={[styles.markerCircle, { backgroundColor: Colors.primary }]}>
              <Ionicons name="radio-button-on" size={16} color={Colors.white} />
            </View>
          </RNMarker>

          {/* End Point Marker */}
          <RNMarker coordinate={{ latitude: endLat, longitude: endLng }} title={t('end_point')}>
            <View style={[styles.markerCircle, { backgroundColor: Colors.secondary }]}>
              <Ionicons name="flag" size={16} color={Colors.white} />
            </View>
          </RNMarker>

          {/* Driver Location Marker — Animated Beacon */}
          {driverLat && driverLng && (
            <RNMarker
              coordinate={{ latitude: driverLat, longitude: driverLng }}
              title={t('driver')}
            >
              <View style={styles.driverMarkerWrapper}>
                {/* Pulsating beacon ring */}
                <Animated.View
                  style={[
                    styles.beaconRing,
                    {
                      transform: [{ scale: beaconScale }],
                      opacity: beaconOpacity,
                    },
                  ]}
                />
                {/* Core bus icon */}
                <View style={styles.driverMarkerCore}>
                  <View style={styles.driverInnerRing} />
                  <Ionicons name="bus" size={16} color={Colors.white} />
                </View>
              </View>
            </RNMarker>
          )}
        </MapView>
      )}

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

class MapErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    logger.warn('[MapErrorBoundary] Map failed to render', { error: error?.message });
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

export const TripMap: React.FC<TripMapProps> = (props) => {
  const { t } = useTranslation();
  return (
    <MapErrorBoundary
      fallback={
        <View style={[styles.container, styles.fallbackContainer]}>
          <Ionicons name="map-outline" size={60} color={Colors.textMuted || '#8e8e93'} />
          <Text style={styles.fallbackTitle}>{t('map_load_failed') || 'تعذر تحميل الخريطة'}</Text>
          <Text style={styles.fallbackSubtitle}>
            {t('map_fallback_desc') || 'يمكنك متابعة الرحلة عبر التحديثات النصية.'}
          </Text>
          {props.driverLat !== null && props.driverLng !== null && (
            <View style={styles.fallbackDetails}>
              <Text style={styles.fallbackText}>
                {t('driver_location') || 'موقع السائق'}: {props.driverLat.toFixed(5)},{' '}
                {props.driverLng.toFixed(5)}
              </Text>
            </View>
          )}
        </View>
      }
    >
      <TripMapInner {...props} />
    </MapErrorBoundary>
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
  // ─── Animated Driver Beacon ─────────────────────────────────────────────────
  driverMarkerWrapper: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  beaconRing: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.success,
  },
  driverMarkerCore: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: Colors.white,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.55,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 10,
  },
  driverInnerRing: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
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
  fallbackContainer: {
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  fallbackTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  fallbackSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 16,
  },
  fallbackDetails: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  fallbackText: {
    fontSize: 13,
    color: '#212529',
  },
});
