'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Box,
  TextField,
  Stack,
  Typography,
  CircularProgress,
  Autocomplete,
  Grid,
  Card,
  CardContent,
  Divider,
  Paper,
  InputAdornment,
} from '@mui/material';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import MapIcon from '@mui/icons-material/Map';
import NavigationIcon from '@mui/icons-material/Navigation';

export interface RouteLocationFormValues {
  start_location: string;
  end_location: string;
  start_lat: number;
  start_lng: number;
  end_lat: number;
  end_lng: number;
}

interface MapPickerProps {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  onChangeStart: (lat: number, lng: number, address?: string) => void;
  onChangeEnd: (lat: number, lng: number, address?: string) => void;
  register: UseFormRegister<RouteLocationFormValues>;
  errors: FieldErrors<RouteLocationFormValues>;
}

export default function MapPicker({
  startLat,
  startLng,
  endLat,
  endLng,
  onChangeStart,
  onChangeEnd,
  register,
  errors,
}: MapPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const startMarkerRef = useRef<L.Marker | null>(null);
  const endMarkerRef = useRef<L.Marker | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const isDraggingRef = useRef(false);

  // Autocomplete states for Start location
  const [startOptions, setStartOptions] = useState<any[]>([]);
  const [startInputValue, setStartInputValue] = useState('');
  const [startLoading, setStartLoading] = useState(false);

  // Autocomplete states for End location
  const [endOptions, setEndOptions] = useState<any[]>([]);
  const [endInputValue, setEndInputValue] = useState('');
  const [endLoading, setEndLoading] = useState(false);

  // Helper to fetch actual road routing path from OSRM
  const updateRouteLine = async (sLat: number, sLng: number, eLat: number, eLng: number) => {
    if (!polylineRef.current || !sLat || !sLng || !eLat || !eLng) return;

    let latlngs: L.LatLngExpression[] = [
      [sLat, sLng],
      [eLat, eLng],
    ];

    try {
      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${sLng},${sLat};${eLng},${eLat}?overview=full&geometries=geojson`,
      );
      const json = await res.json();
      if (json.routes?.[0]?.geometry?.coordinates) {
        latlngs = json.routes[0].geometry.coordinates.map(
          ([lng, lat]: [number, number]) => [lat, lng] as L.LatLngExpression,
        );
      }
    } catch (err) {
      console.warn('Failed to fetch OSRM route for picker:', err);
    }

    if (polylineRef.current) {
      polylineRef.current.setLatLngs(latlngs);
    }
  };

  // Debounced API call for Start location geocoding
  useEffect(() => {
    if (!startInputValue.trim()) {
      setStartOptions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setStartLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&countrycodes=iq&q=${encodeURIComponent(
            startInputValue,
          )}`,
        );
        const data = await response.json();
        setStartOptions(data || []);
      } catch (err) {
        console.error('Nominatim start search error:', err);
      } finally {
        setStartLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [startInputValue]);

  // Debounced API call for End location geocoding
  useEffect(() => {
    if (!endInputValue.trim()) {
      setEndOptions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setEndLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&countrycodes=iq&q=${encodeURIComponent(
            endInputValue,
          )}`,
        );
        const data = await response.json();
        setStartOptions(data || []); // Fix autocomplete target to endOptions
      } catch (err) {
        console.error('Nominatim end search error:', err);
      } finally {
        setEndLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [endInputValue]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Center map around Baghdad or coordinates if available
    const centerLat = startLat || 33.3128;
    const centerLng = startLng || 44.3615;

    const map = L.map(mapContainerRef.current).setView([centerLat, centerLng], 12);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Custom marker icons to prevent bundling path issues
    const startIcon = L.icon({
      iconUrl:
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const endIcon = L.icon({
      iconUrl:
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    // Start marker setup
    const startMarker = L.marker([startLat || 33.3128, startLng || 44.3615], {
      draggable: true,
      icon: startIcon,
    }).addTo(map);
    startMarkerRef.current = startMarker;

    // End marker setup
    const endMarker = L.marker([endLat || 33.34, endLng || 44.4], {
      draggable: true,
      icon: endIcon,
    }).addTo(map);
    endMarkerRef.current = endMarker;

    // Draw route path polyline between markers
    const polyline = L.polyline(
      [
        [startMarker.getLatLng().lat, startMarker.getLatLng().lng],
        [endMarker.getLatLng().lat, endMarker.getLatLng().lng],
      ],
      { color: '#2563EB', weight: 5, opacity: 0.85 },
    ).addTo(map);
    polylineRef.current = polyline;

    // Adjust map zoom/bounds to fit both markers
    if (startLat && endLat) {
      map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
    }

    // Connect drag listeners: use local straight lines during drag, snap to OSRM on dragend
    startMarker.on('dragstart', () => {
      isDraggingRef.current = true;
    });

    startMarker.on('drag', () => {
      const pos = startMarker.getLatLng();
      if (polylineRef.current && endMarkerRef.current) {
        polylineRef.current.setLatLngs([
          [pos.lat, pos.lng],
          [endMarkerRef.current.getLatLng().lat, endMarkerRef.current.getLatLng().lng],
        ]);
      }
    });

    startMarker.on('dragend', () => {
      isDraggingRef.current = false;
      const pos = startMarker.getLatLng();
      onChangeStart(pos.lat, pos.lng);
      if (endMarkerRef.current) {
        updateRouteLine(
          pos.lat,
          pos.lng,
          endMarkerRef.current.getLatLng().lat,
          endMarkerRef.current.getLatLng().lng,
        );
      }
    });

    endMarker.on('dragstart', () => {
      isDraggingRef.current = true;
    });

    endMarker.on('drag', () => {
      const pos = endMarker.getLatLng();
      if (polylineRef.current && startMarkerRef.current) {
        polylineRef.current.setLatLngs([
          [startMarkerRef.current.getLatLng().lat, startMarkerRef.current.getLatLng().lng],
          [pos.lat, pos.lng],
        ]);
      }
    });

    endMarker.on('dragend', () => {
      isDraggingRef.current = false;
      const pos = endMarker.getLatLng();
      onChangeEnd(pos.lat, pos.lng);
      if (startMarkerRef.current) {
        updateRouteLine(
          startMarkerRef.current.getLatLng().lat,
          startMarkerRef.current.getLatLng().lng,
          pos.lat,
          pos.lng,
        );
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update marker locations if form values change externally (e.g. from inputs)
  useEffect(() => {
    if (!mapRef.current) return;

    if (startMarkerRef.current && startLat && startLng) {
      const curLatLng = startMarkerRef.current.getLatLng();
      if (
        Math.abs(curLatLng.lat - startLat) > 0.0001 ||
        Math.abs(curLatLng.lng - startLng) > 0.0001
      ) {
        startMarkerRef.current.setLatLng([startLat, startLng]);
      }
    }

    if (endMarkerRef.current && endLat && endLng) {
      const curLatLng = endMarkerRef.current.getLatLng();
      if (Math.abs(curLatLng.lat - endLat) > 0.0001 || Math.abs(curLatLng.lng - endLng) > 0.0001) {
        endMarkerRef.current.setLatLng([endLat, endLng]);
      }
    }

    // Only update OSRM road line if not actively dragging a marker
    if (!isDraggingRef.current) {
      updateRouteLine(startLat, startLng, endLat, endLng);
    }
  }, [startLat, startLng, endLat, endLng]);

  return (
    <Card variant="outlined" sx={{ mb: 3, overflow: 'hidden' }}>
      <Box
        sx={{
          p: 2,
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <MapIcon color="primary" />
          <Typography variant="subtitle1" fontWeight={600} color="text.primary">
            الموقع والمسار الجغرافي للرحلة
          </Typography>
        </Stack>
      </Box>

      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Grid container spacing={3}>
          {/* Map Viewer Column */}
          <Grid item xs={12} md={7} lg={8}>
            <Paper
              elevation={0}
              sx={{
                height: { xs: '350px', md: '480px' },
                width: '100%',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <Box ref={mapContainerRef} sx={{ height: '100%', width: '100%' }} />
            </Paper>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              * يمكنك سحب العلامات مباشرة على الخريطة لتعديل الإحداثيات: العلامة الخضراء للبدء،
              والحمراء للنهاية.
            </Typography>
          </Grid>

          {/* Locations and Coordinates Configuration Panel */}
          <Grid item xs={12} md={5} lg={4}>
            <Stack spacing={3.5} sx={{ height: '100%' }}>
              {/* Start Point Configuration */}
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                  <LocationOnIcon sx={{ color: 'success.main', fontSize: 20 }} />
                  <Typography variant="subtitle2" fontWeight={600} color="success.main">
                    نقطة الانطلاق (البداية)
                  </Typography>
                </Stack>

                <Stack spacing={2}>
                  {/* Start Search Autocomplete */}
                  <Autocomplete
                    options={startOptions}
                    getOptionLabel={(option: any) => option.display_name}
                    filterOptions={(x) => x}
                    loading={startLoading}
                    inputValue={startInputValue}
                    onInputChange={(_, newValue) => setStartInputValue(newValue)}
                    onChange={(_, selection: any) => {
                      if (selection) {
                        const lat = parseFloat(selection.lat);
                        const lon = parseFloat(selection.lon);
                        const cleanAddress = selection.display_name.split(',')[0];
                        onChangeStart(lat, lon, cleanAddress);
                        if (mapRef.current) {
                          mapRef.current.setView([lat, lon], 14);
                        }
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="ابحث عن نقطة البدء..."
                        size="small"
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <>
                              {startLoading ? <CircularProgress color="inherit" size={16} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                    fullWidth
                  />

                  {/* Custom Start Location Name Input */}
                  <TextField
                    {...register('start_location', { required: 'اسم موقع البداية مطلوب' })}
                    error={!!errors.start_location}
                    helperText={errors.start_location?.message}
                    label="اسم نقطة الانطلاق"
                    placeholder="مثال: الكرادة، بغداد"
                    size="small"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />

                  <input
                    type="hidden"
                    {...register('start_lat', {
                      required: 'مطلوب',
                      valueAsNumber: true,
                      validate: (v: number) => (!isNaN(v) && v >= -90 && v <= 90) || 'بين -90 و 90',
                    })}
                  />
                  <input
                    type="hidden"
                    {...register('start_lng', {
                      required: 'مطلوب',
                      valueAsNumber: true,
                      validate: (v: number) =>
                        (!isNaN(v) && v >= -180 && v <= 180) || 'بين -180 و 180',
                    })}
                  />
                </Stack>
              </Box>

              <Divider />

              {/* End Point Configuration */}
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                  <NavigationIcon
                    sx={{ color: 'error.main', fontSize: 18, transform: 'rotate(90deg)' }}
                  />
                  <Typography variant="subtitle2" fontWeight={600} color="error.main">
                    نقطة الوصول (النهاية)
                  </Typography>
                </Stack>

                <Stack spacing={2}>
                  {/* End Search Autocomplete */}
                  <Autocomplete
                    options={endOptions}
                    getOptionLabel={(option: any) => option.display_name}
                    filterOptions={(x) => x}
                    loading={endLoading}
                    inputValue={endInputValue}
                    onInputChange={(_, newValue) => setEndInputValue(newValue)}
                    onChange={(_, selection: any) => {
                      if (selection) {
                        const lat = parseFloat(selection.lat);
                        const lon = parseFloat(selection.lon);
                        const cleanAddress = selection.display_name.split(',')[0];
                        onChangeEnd(lat, lon, cleanAddress);
                        if (mapRef.current) {
                          mapRef.current.setView([lat, lon], 14);
                        }
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="ابحث عن نقطة النهاية..."
                        size="small"
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <>
                              {endLoading ? <CircularProgress color="inherit" size={16} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                    fullWidth
                  />

                  {/* Custom End Location Name Input */}
                  <TextField
                    {...register('end_location', { required: 'اسم موقع النهاية مطلوب' })}
                    error={!!errors.end_location}
                    helperText={errors.end_location?.message}
                    label="اسم نقطة النهاية"
                    placeholder="مثال: جامعة بغداد (الجادرية)"
                    size="small"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />

                  <input
                    type="hidden"
                    {...register('end_lat', {
                      required: 'مطلوب',
                      valueAsNumber: true,
                      validate: (v: number) => (!isNaN(v) && v >= -90 && v <= 90) || 'بين -90 و 90',
                    })}
                  />
                  <input
                    type="hidden"
                    {...register('end_lng', {
                      required: 'مطلوب',
                      valueAsNumber: true,
                      validate: (v: number) =>
                        (!isNaN(v) && v >= -180 && v <= 180) || 'بين -180 و 180',
                    })}
                  />
                </Stack>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
