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
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const router = useRouter();

  // Expose router globally so Leaflet popup inline onclick events can utilize Next.js client-side navigation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).nextRouter = router;
    }
  }, [router]);

  // 1. Initialize Map Instance (Once on Mount)
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Fix Leaflet marker icons in Next.js
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });

    // Center on Baghdad by default
    const map = L.map(mapContainerRef.current).setView([33.3128, 44.3615], 12);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Create a Layer Group for dynamic markers and route lines
    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      layerGroupRef.current = null;
    };
  }, []);

  // 2. Render Markers and Route Polylines dynamically (No map destruction)
  useEffect(() => {
    const map = mapRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    // Clear previous markers/lines from the map
    layerGroup.clearLayers();

    // Custom premium marker icons using DivIcon
    const startIcon = L.divIcon({
      className: 'custom-marker-container-start',
      html: `
        <div class="custom-marker start-marker">
          <div class="marker-pulse"></div>
          <div class="marker-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const endIcon = L.divIcon({
      className: 'custom-marker-container-end',
      html: `
        <div class="custom-marker end-marker">
          <div class="marker-pulse"></div>
          <div class="marker-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
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
        .addTo(layerGroup)
        .bindPopup(`<strong>نقطة الانطلاق لـ: ${route.title}</strong><br/>${route.start_location}`);

      // End Marker
      L.marker(endPos, { icon: endIcon })
        .addTo(layerGroup)
        .bindPopup(`<strong>نقطة النهاية لـ: ${route.title}</strong><br/>${route.end_location}`);

      const driverName = driverNames[route.driver_id] || 'سائق غير معين';
      const statusText = route.is_active ? 'نشط' : 'غير نشط';
      const statusColor = route.is_active ? '#10B981' : '#EF4444';

      // Bind detailed popup on the line
      const popupHtml = `
        <div style="font-family: var(--font-noto-arabic), sans-serif; direction: rtl; text-align: right; min-width: 220px;">
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
        }).addTo(layerGroup);

        polyline.bindPopup(popupHtml);
      };

      void drawRoutePolyline();
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
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
