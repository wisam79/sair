import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline, UrlTile, PROVIDER_DEFAULT, LatLng } from 'react-native-maps';
import { Colors } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../hooks/useTranslation';

interface TripMapProps {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  driverLat: number | null;
  driverLng: number | null;
}

export const TripMap: React.FC<TripMapProps> = ({
  startLat,
  startLng,
  endLat,
  endLng,
  driverLat,
  driverLng,
}) => {
  const mapRef = useRef<MapView>(null);
  const { t } = useTranslation();

  // Cache OSRM route — fetch once, never re-fetch on driver location updates
  const [routeCoords, setRouteCoords] = useState<LatLng[]>([]);
  const routeFetched = useRef(false);

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

  useEffect(() => {
    if (mapRef.current) {
      const coordinates = [
        { latitude: startLat, longitude: startLng },
        { latitude: endLat, longitude: endLng },
      ];
      if (driverLat && driverLng) {
        coordinates.push({ latitude: driverLat, longitude: driverLng });
      }

      // Small delay to ensure map layout is calculated before fitting coordinates
      setTimeout(() => {
        mapRef.current?.fitToCoordinates(coordinates, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      }, 500);
    }
  }, [startLat, startLng, endLat, endLng, driverLat, driverLng]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        mapType="none" // Important to hide Google/Apple basemap to use OSM
        initialRegion={{
          latitude: (startLat + endLat) / 2,
          longitude: (startLng + endLng) / 2,
          latitudeDelta: Math.abs(startLat - endLat) * 2 || 0.05,
          longitudeDelta: Math.abs(startLng - endLng) * 2 || 0.05,
        }}
      >
        <UrlTile
          urlTemplate="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
        />

        {/* Route Line — OSRM or fallback straight line */}
        {routeCoords.length > 1 ? (
          <Polyline coordinates={routeCoords} strokeColor={Colors.primary} strokeWidth={4} />
        ) : (
          <Polyline
            coordinates={[
              { latitude: startLat, longitude: startLng },
              { latitude: endLat, longitude: endLng },
            ]}
            strokeColor={Colors.primary}
            strokeWidth={4}
            lineDashPattern={[10, 5]}
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
});
