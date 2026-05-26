'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Box } from '@mui/material';
import { useRouter } from 'next/navigation';

export interface RouteData {
  id: string;
  title: string;
  start_location: string;
  end_location: string;
  start_lat: number | null;
  start_lng: number | null;
  end_lat: number | null;
  end_lng: number | null;
  price: number;
  capacity: number;
  available_seats: number;
  is_active: boolean;
  driver_id: string;
}

interface RouteMapViewerProps {
  routes: RouteData[];
  driverNames?: Record<string, string>; // maps driver_id -> driver full name
  height?: string;
}

export default function RouteMapViewer({
  routes,
  driverNames = {},
  height = '500px',
}: RouteMapViewerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const router = useRouter();

  // Expose router globally so Leaflet popup inline onclick events can utilize Next.js client-side navigation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).nextRouter = router;
    }
  }, [router]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Center on Baghdad by default
    const map = L.map(mapContainerRef.current).setView([33.3128, 44.3615], 12);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

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

    const bounds = L.latLngBounds([]);
    const colors = ['#2563EB', '#10B981', '#EF4444', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];

    routes.forEach((route, index) => {
      const { start_lat, start_lng, end_lat, end_lng } = route;
      if (!start_lat || !start_lng || !end_lat || !end_lng) return;

      const startPos: L.LatLngExpression = [start_lat, start_lng];
      const endPos: L.LatLngExpression = [end_lat, end_lng];

      bounds.extend(startPos);
      bounds.extend(endPos);

      const color = colors[index % colors.length];

      // Start Marker
      L.marker(startPos, { icon: startIcon })
        .addTo(map)
        .bindPopup(`<strong>نقطة الانطلاق لـ: ${route.title}</strong><br/>${route.start_location}`);

      // End Marker
      L.marker(endPos, { icon: endIcon })
        .addTo(map)
        .bindPopup(`<strong>نقطة النهاية لـ: ${route.title}</strong><br/>${route.end_location}`);

      const driverName = driverNames[route.driver_id] || 'سائق غير معين';
      const statusText = route.is_active ? 'نشط' : 'غير نشط';
      const statusColor = route.is_active ? '#10B981' : '#EF4444';

      // Bind detailed popup on the line
      const popupHtml = `
        <div style="font-family: var(--font-ibm-arabic), sans-serif; direction: rtl; text-align: right; min-width: 220px;">
          <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #1E293B; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px;">${route.title}</h4>
          <p style="margin: 4px 0; font-size: 12px; color: #64748B; line-height: 1.6;">
            <strong>البداية:</strong> ${route.start_location}<br/>
            <strong>النهاية:</strong> ${route.end_location}<br/>
            <strong>السائق:</strong> ${driverName}<br/>
            <strong>السعر:</strong> ${route.price.toLocaleString()} د.ع<br/>
            <strong>المقاعد:</strong> ${route.available_seats} / ${route.capacity}<br/>
            <strong>الحالة:</strong> <span style="color: ${statusColor}; font-weight: bold;">${statusText}</span>
          </p>
          <div style="margin-top: 10px; display: flex; gap: 8px;">
            <button onclick="if(window.nextRouter) window.nextRouter.push('/routes/show/${route.id}')" 
              style="padding: 6px 12px; font-size: 11px; cursor: pointer; border-radius: 4px; border: none; background: #2563EB; color: white; font-weight: bold; flex: 1;">
              عرض التفاصيل
            </button>
            <button onclick="if(window.nextRouter) window.nextRouter.push('/routes/edit/${route.id}')" 
              style="padding: 6px 12px; font-size: 11px; cursor: pointer; border-radius: 4px; border: 1px solid #CBD5E1; background: white; color: #1E293B; font-weight: bold; flex: 1;">
              تعديل
            </button>
          </div>
        </div>
      `;

      // Fetch road routing coords from OSRM
      const drawRoutePolyline = async () => {
        let latlngs: L.LatLngExpression[] = [startPos, endPos];
        try {
          const res = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${start_lng},${start_lat};${end_lng},${end_lat}?overview=full&geometries=geojson`,
          );
          const json = await res.json();
          if (json.routes?.[0]?.geometry?.coordinates) {
            latlngs = json.routes[0].geometry.coordinates.map(
              ([lng, lat]: [number, number]) => [lat, lng] as L.LatLngExpression,
            );
          }
        } catch (err) {
          console.warn('Failed to fetch OSRM route for admin viewer:', err);
        }

        const polyline = L.polyline(latlngs, {
          color,
          weight: 5,
          opacity: 0.85,
        }).addTo(map);

        polyline.bindPopup(popupHtml);
      };

      drawRoutePolyline();
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [routes, driverNames]);

  return (
    <Box
      ref={mapContainerRef}
      sx={{
        height,
        width: '100%',
        borderRadius: '8px',
        border: '1px solid #E2E8F0',
        zIndex: 1,
      }}
    />
  );
}
