import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';

interface MapModalProps {
  onLocationSelect: (coordinates: { lat: number; lon: number }) => void;
  onClose: () => void;
}

const MapModal: React.FC<MapModalProps> = ({ onLocationSelect, onClose }) => {
  const [position, setPosition] = useState<LatLngTuple | null>(null);
  const [userLocation, setUserLocation] = useState<LatLngTuple | null>(null);

  // Handle map click event
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        onLocationSelect({ lat: e.latlng.lat, lon: e.latlng.lng });
      },
    });
    return null;
  };

  // Get user's location when the component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.error('Error getting user location:', error);
          // Fallback to a default location if location access is denied
          setUserLocation([51.505, -0.09]); // Default to London
        }
      );
    } else {
      // If geolocation is not supported, fallback to a default location
      setUserLocation([51.505, -0.09]);
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
      <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Select Location</h2>

        {/* Leaflet map */}
        {userLocation && (
          <MapContainer
            center={userLocation} // Use user's location as the initial center
            zoom={17}
            style={{ height: '400px', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {position && <Marker position={position}></Marker>}
            <MapClickHandler />
          </MapContainer>
        )}

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapModal;
