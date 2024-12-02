import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L, { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import carSticker from '../../assets/HomePage/carSticker.png';
import locationMarker from '../../assets/HomePage/location_sticker.png';

// Define a custom icon for the markers
const blueMarker = new L.Icon({
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const pinkMarker = new L.Icon({
  iconUrl: locationMarker,
  iconSize: [33, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface CurrentLocationMapProps {
  onMapClick: (location: LatLngTuple) => void;
  startPosition: LatLngTuple | null;
  destinationPosition: LatLngTuple | null;
  cursorStyle: string; // Add cursorStyle prop
}

const MapClickHandler: React.FC<{ onMapClick: (location: LatLngTuple) => void }> = ({ onMapClick }) => {
  useMapEvents({
    click(event) {
      const latLng = event.latlng;
      const latLngTuple: LatLngTuple = [latLng.lat, latLng.lng];
      onMapClick(latLngTuple);
    },
  });

  return null;
};

const CurrentLocationMap: React.FC<CurrentLocationMapProps> = ({
  onMapClick,
  startPosition,
  destinationPosition,
  cursorStyle,
}) => {
  const [position, setPosition] = useState<LatLngTuple | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // Format coordinates to 5 decimal places
          const userPosition: LatLngTuple = [
            parseFloat(pos.coords.latitude.toFixed(5)),
            parseFloat(pos.coords.longitude.toFixed(5))
          ];
          setPosition(userPosition);
        },
        (error) => {
          console.error('Error fetching location:', error);
          const defaultPosition: LatLngTuple = [51.505, -0.09]; // Example: London coordinates
          setPosition(defaultPosition);
        }
      );
    }
  }, []);

  return position ? (
    <MapContainer
      center={position}
      zoom={17}
      className="w-full h-[834px] rounded-[25px] relative z-0"
      style={{ cursor: cursorStyle }} // Apply the cursor style inline
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {/* Conditionally render the "You are here" marker */}
      {!startPosition && (
        <Marker position={position} icon={blueMarker}>
          <Popup>Vous etes ici.</Popup>
        </Marker>
      )}
      {startPosition && (
        <Marker position={startPosition} icon={blueMarker}>
          <Popup>Localisation de depart.</Popup>
        </Marker>
      )}
      {destinationPosition && (
        <Marker position={destinationPosition} icon={pinkMarker}>
          <Popup>Destination.</Popup>
        </Marker>
      )}
      <MapClickHandler onMapClick={onMapClick} />
    </MapContainer>
  ) : (
    <div>Chargement du carte...</div>
  );
};

const Maps: React.FC = () => {
  const [startLocation, setStartLocation] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [selectedField, setSelectedField] = useState<'start' | 'destination' | null>(null);
  const [startPosition, setStartPosition] = useState<LatLngTuple | null>(null);
  const [destinationPosition, setDestinationPosition] = useState<LatLngTuple | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          // Format coordinates to 5 decimal places
          const userPosition: LatLngTuple = [
            parseFloat(pos.coords.latitude.toFixed(5)),
            parseFloat(pos.coords.longitude.toFixed(5))
          ];
          const placeName = await reverseGeocode(userPosition);
          setStartLocation(placeName);
          setStartPosition(userPosition);
        },
        async (error) => {
          console.error('Error fetching location:', error);
          const defaultPosition: LatLngTuple = [51.505, -0.09]; // Example: London coordinates
          const placeName = await reverseGeocode(defaultPosition);
          setStartLocation(placeName);
          setStartPosition(defaultPosition);
        }
      );
    }
  }, []);

  const handleMapClick = async (location: LatLngTuple) => {
    if (selectedField) {
      // Format coordinates to 5 decimal places
      const formattedLocation: LatLngTuple = [
        parseFloat(location[0].toFixed(5)), // Latitude
        parseFloat(location[1].toFixed(5))  // Longitude
      ];
      const placeName = await reverseGeocode(formattedLocation);
      if (selectedField === 'start') {
        setStartLocation(placeName);
        setStartPosition(formattedLocation);
      } else if (selectedField === 'destination') {
        setDestination(placeName);
        setDestinationPosition(formattedLocation);
      }
      // Deselect the input field after setting the location
      setSelectedField(null);
    }
  };

  const handleInputClick = (field: 'start' | 'destination') => {
    setSelectedField(field);
  };

  const cursorStyle = selectedField === 'start' ? `url(${blueMarker.options.iconUrl}), auto` : selectedField === 'destination' ? `url(${pinkMarker.options.iconUrl}), auto` : 'auto';

  // Function to reverse geocode coordinates to place name
  const reverseGeocode = async (coords: LatLngTuple): Promise<string> => {
    const [lat, lon] = coords;
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const data = await response.json();
      return data.display_name || 'Unknown Location';
    } catch (error) {
      console.error('Error fetching place name:', error);
      return 'Unknown Location';
    }
  };

  return (
    <div className="w-full max-w-[700px] lg:w-1/2 bg-transparent bg-no-repeat bg-center shadow-md rounded-[25px] mb-0 xl:mr-12 lg:mr-5 relative">
      <CurrentLocationMap
        onMapClick={handleMapClick}
        startPosition={startPosition}
        destinationPosition={destinationPosition}
        cursorStyle={cursorStyle} // Pass cursorStyle to the map component
      />

      <div className="absolute bottom-11 left-1/2 -translate-x-1/2 transform z-10 w-full max-w-[370px] sm:max-w-[450px] lg:max-w-[420px] xl:max-w-[450px] md:max-h-[240px] bg-[#F6F6F6] shadow-md rounded-2xl opacity-100 flex flex-col items-center justify-center space-y-4 p-6 mt-4">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Sélectionner un lieu de départ sur la carte"
            value={startLocation}
            onClick={() => handleInputClick('start')}
            className="w-full p-4 bg-white bg-opacity-100 rounded-md font-rubik"
          />
        </div>
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Sélectionner votre destination sur la carte"
            value={destination}
            onClick={() => handleInputClick('destination')}
            className="w-full p-4 bg-white bg-opacity-100 rounded-md font-rubik"
          />
        </div>
        <button className="w-full p-4 bg-pink-400 text-white rounded-md flex items-center justify-center mb-4 font-rubik">
          Trouver un chauffeur <img src={carSticker} alt="Car" className="h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default Maps;