import React, { useEffect, useRef } from 'react';
import { Map, NavigationControl, Marker, setWorkerUrl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import { mapService } from '../services/mapService';

setWorkerUrl(workerUrl);

export default function URMap({ 
  events = [], 
  listings = [], 
  center = [91.7362, 26.1445], // Default Guwahati
  zoom = 13, 
  onMarkerClick, 
  onBoundsChange 
}) {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  // Initialize Map
  useEffect(() => {
    if (mapInstance.current) return;

    mapInstance.current = new Map({
      container: mapContainer.current,
      style: 'https://demotiles.maplibre.org/style.json', // Free open testing tiles
      center: center,
      zoom: zoom,
      attributionControl: false
    });

    // Add zoom and rotation controls
    mapInstance.current.addControl(new NavigationControl(), 'top-right');

    // Bounds change listener
    mapInstance.current.on('moveend', () => {
      if (onBoundsChange && mapInstance.current) {
        const bounds = mapInstance.current.getBounds();
        onBoundsChange(bounds);
      }
    });

    // Initial bounds fire
    mapInstance.current.on('load', () => {
      if (onBoundsChange && mapInstance.current) {
        const bounds = mapInstance.current.getBounds();
        onBoundsChange(bounds);
      }
    });

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, []);

  // Update center when props change
  useEffect(() => {
    if (mapInstance.current) {
      // Check if it's far from current center to avoid constant jumping
      const currentCenter = mapInstance.current.getCenter();
      const dist = Math.abs(currentCenter.lng - center[0]) + Math.abs(currentCenter.lat - center[1]);
      if (dist > 0.0001) {
        mapInstance.current.setCenter(center);
      }
    }
  }, [center]);

  // Update zoom when props change
  useEffect(() => {
    if (mapInstance.current) {
      const currentZoom = mapInstance.current.getZoom();
      if (Math.abs(currentZoom - zoom) > 0.1) {
        mapInstance.current.setZoom(zoom);
      }
    }
  }, [zoom]);

  // Re-draw Markers when listings or filters change
  useEffect(() => {
    if (!mapInstance.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Draw Events
    events.forEach(evt => {
      const [lng, lat] = mapService.itemToLatLng(evt);
      
      // Determine clay marker color & icon
      let bgColor = 'var(--primary-cyan)'; // Default cyan
      let icon = '🎉';
      
      if (evt.category === 'Nightlife') {
        bgColor = 'var(--pink)';
        icon = '🎧';
      } else if (evt.category === 'Music') {
        bgColor = 'var(--purple)';
        icon = '🎵';
      } else if (evt.category === 'Festivals') {
        bgColor = 'var(--yellow)';
        icon = '🪔';
      } else if (evt.category === 'Social') {
        bgColor = 'var(--green)';
        icon = '🤝';
      }

      // Create Custom Claymorphic HTML Element
      const el = document.createElement('div');
      el.style.width = '38px';
      el.style.height = '38px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = bgColor;
      el.style.border = '3px solid #FFFFFF';
      el.style.boxShadow = '0 6px 12px rgba(8, 127, 140, 0.25), inset 3px 3px 6px rgba(255,255,255,0.4), inset -3px -3px 6px rgba(0,0,0,0.15)';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.cursor = 'pointer';
      el.style.transition = 'transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.2)';
      el.innerHTML = `<span style="font-size: 15px; margin-bottom: 2px;">${icon}</span>`;

      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.15) translateY(-2px)';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1.0)';
      });
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        el.style.transform = 'scale(0.9)';
        setTimeout(() => { el.style.transform = 'scale(1.0)'; }, 150);
        if (onMarkerClick) {
          onMarkerClick({ type: 'event', data: evt });
        }
      });

      const marker = new Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(mapInstance.current);

      markersRef.current.push(marker);
    });

    // Draw Listings (Housing & Roommates)
    listings.forEach(list => {
      const [lng, lat] = mapService.itemToLatLng(list);
      
      let bgColor = 'var(--yellow)';
      let icon = '🏠';

      if (list.type === 'Roommate') {
        bgColor = 'var(--purple)';
        icon = '👥';
      } else if (list.type === 'Room') {
        bgColor = 'var(--primary-cyan)';
        icon = '🛏️';
      } else if (list.type === 'PG') {
        bgColor = 'var(--pink)';
        icon = '🏢';
      }

      const el = document.createElement('div');
      el.style.width = '38px';
      el.style.height = '38px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = bgColor;
      el.style.border = '3px solid #FFFFFF';
      el.style.boxShadow = '0 6px 12px rgba(8, 127, 140, 0.25), inset 3px 3px 6px rgba(255,255,255,0.4), inset -3px -3px 6px rgba(0,0,0,0.15)';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.cursor = 'pointer';
      el.style.transition = 'transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.2)';
      el.innerHTML = `<span style="font-size: 15px; margin-bottom: 2px;">${icon}</span>`;

      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.15) translateY(-2px)';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1.0)';
      });
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        el.style.transform = 'scale(0.9)';
        setTimeout(() => { el.style.transform = 'scale(1.0)'; }, 150);
        if (onMarkerClick) {
          onMarkerClick({ type: 'housing', data: list });
        }
      });

      const marker = new Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(mapInstance.current);

      markersRef.current.push(marker);
    });

  }, [events, listings]);

  return (
    <div 
      ref={mapContainer} 
      className="clay-card"
      style={{ 
        width: '100%', 
        height: '100%', 
        minHeight: '400px', 
        padding: 0,
        borderRadius: '32px',
        overflow: 'hidden',
        border: '4px solid #FFFFFF',
        boxShadow: '20px 20px 60px rgba(8, 127, 140, 0.15), -20px -20px 60px #FFFFFF'
      }}
    />
  );
}
