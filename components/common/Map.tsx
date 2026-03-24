"use client";
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L, { LatLngExpression } from 'leaflet';
import { useRef, useMemo, useState, useEffect } from 'react';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-routing-machine';

// Correctly handle default Leaflet icon with bundlers like Next.js
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl.src,
  iconUrl: iconUrl.src,
  shadowUrl: shadowUrl.src,
});

// --- UTILITY COMPONENTS ---

// This utility is crucial for maps in dynamic containers. It tells the map 
// to re-calculate its size after the container has finished rendering,
// preventing the map from initializing with a zero height.
const InvalidateSize = () => {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100); // A small delay is often necessary
    return () => clearTimeout(timer);
  }, [map]);
  return null;
};

// --- FEATURE COMPONENTS ---

const SearchField = ({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) => {
  const map = useMap();
  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider,
      style: 'bar',
      showMarker: true,
      showPopup: false,
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: true,
    });
    map.addControl(searchControl);
    const onResult = (result: any) => onLocationSelect(result.location.y, result.location.x);
    map.on('geosearch/showlocation', onResult);
    return () => {
      map.off('geosearch/showlocation', onResult);
      map.removeControl(searchControl);
    };
  }, [map, onLocationSelect]);
  return null;
};

const Routing = ({ start, end }: { start: LatLngExpression, end: LatLngExpression }) => {
  const map = useMap();
  const routingControlRef = useRef<L.Routing.Control | null>(null);

  useEffect(() => {
    if (!map) return;
    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }
    routingControlRef.current = L.Routing.control({
      waypoints: [L.latLng(start), L.latLng(end)],
      routeWhileDragging: false,
      show: false, // Hide the default routing panel
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
    }).addTo(map);

    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }
    };
  }, [map, start, end]);

  return null;
};

// --- MAIN MAP COMPONENT ---

const defaultPosition: LatLngExpression = [21.1458, 79.0882]; // Default to Nagpur, India
const defaultOnLocationSelect = () => {};

interface MapProps {
  onLocationSelect?: (lat: number, lng: number) => void;
  position?: LatLngExpression | null;
  start?: LatLngExpression | null;
  end?: LatLngExpression | null;
}

const Map = ({ onLocationSelect = defaultOnLocationSelect, position, start, end }: MapProps) => {
  const markerRef = useRef<L.Marker | null>(null);
  const centerPosition = position || defaultPosition;

  return (
    <MapContainer center={centerPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* Features */}
      <SearchField onLocationSelect={onLocationSelect} />
      {start && end ? (
        <Routing start={start} end={end} />
      ) : (
        <Marker
          draggable={true}
          eventHandlers={{
            dragend() {
              const marker = markerRef.current;
              if (marker) {
                const { lat, lng } = marker.getLatLng();
                onLocationSelect(lat, lng);
              }
            },
          }}
          position={centerPosition} // Marker starts at the center position
          ref={markerRef}
        />
      )}

      {/* This is the critical piece to ensure the map renders correctly */}
      <InvalidateSize />
    </MapContainer>
  );
};

export default Map;
