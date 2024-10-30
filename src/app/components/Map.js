import { MapContainer, TileLayer, Marker, Popup, useMapEvent, useMap } from 'react-leaflet';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import { capitalizeFirstLetter } from '../utils/stringUtils';

delete L.Icon.Default.prototype._getIconUrl;

const customIcon = new L.Icon({
  iconUrl: '/icons/dog.png',
  iconSize: [25, 30],
  iconAnchor: [17, 45],
  popupAnchor: [0, -45],
  shadowSize: [45, 45], 
  shadowAnchor: [15, 45] 
});

const vetoIcon = new L.Icon({
  iconUrl: '/icons/veterinaire.png',
  iconSize: [30, 35],
  iconAnchor: [17, 45],
  popupAnchor: [0, -45],
  shadowSize: [45, 45], 
  shadowAnchor: [15, 45] 
});

const CenterMap = ({ position, zoomLevel }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, zoomLevel, { animate: true });
    }
  }, [position, zoomLevel, map]);

  return null;
};

const Map = ({ onSelectPatient, onSelectVetCenter, focusedPatientId }) => {
  const [markers, setMarkers] = useState([]);
  const [vetMarkers, setVetMarkers] = useState([]);
  const [centerPosition, setCenterPosition] = useState(null);
  const zoomLevel = 17;

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:4000/patients');
        const patients = response.data;
  
        // Regrouper les patients par adresse
        const patientsByAddress = {};
        patients.forEach((patient) => {
          const client = patient.client;
          if (client && client.latitude && client.longitude) {
            const addressKey = `${client.adress}, ${client.postal} ${client.city}`;
            if (!patientsByAddress[addressKey]) {
              patientsByAddress[addressKey] = {
                lat: client.latitude,
                lng: client.longitude,
                patients: []
              };
            }
            patientsByAddress[addressKey].patients.push(patient);
          }
        });
  
        // Créer les marqueurs à partir des adresses groupées
        const newMarkers = Object.values(patientsByAddress).map((group) => ({
          lat: group.lat,
          lng: group.lng,
          patients: group.patients,
        }));
  
        setMarkers(newMarkers);
      } catch (error) {
        console.error("Erreur lors de la récupération des patients :", error);
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    const fetchVetCenters = async () => {
      try {
        const response = await axios.get('http://localhost:4000/professionals');
        const vetCenters = response.data;
        const newVetMarkers = vetCenters
          .filter(vetCenter => vetCenter.latitude && vetCenter.longitude)
          .map((vetCenter) => ({
            lat: vetCenter.latitude,
            lng: vetCenter.longitude,
            ...vetCenter,
          }));

        setVetMarkers(newVetMarkers);
      } catch (error) {
        console.error("Erreur lors de la récupération des centres vétérinaires :", error);
      }
    };

    fetchVetCenters();
  }, []);

  useEffect(() => {
    console.log("ID du patient reçu dans Map :", focusedPatientId);

    if (focusedPatientId && markers.length > 0) {
      const patientMarker = markers.find(marker =>
        marker.patients.some(patient => patient.id === parseInt(focusedPatientId))
      );

      if (patientMarker) {
        setCenterPosition([patientMarker.lat, patientMarker.lng]);
      }
    }
  }, [focusedPatientId, markers]);

  return (
    <div>
      <MapContainer
        center={[43.683333, 4.133333]}
        zoom={7}
        style={{ height: '900px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {centerPosition && <CenterMap position={centerPosition} zoomLevel={zoomLevel} />}

        {markers.map((marker, idx) => (
          <Marker key={idx} position={[marker.lat, marker.lng]} icon={customIcon}>
            <Popup>
              <div>
                {marker.patients && marker.patients.length > 0 ? (
                  <>
                    <p><strong>Patients :</strong></p>
                    <ul className="flex flex-wrap">
                      {marker.patients.map((patient, i) => (
                        <li key={i} className="mb-2">
                          <button
                            className="bg-blue-500 text-white px-2 py-1 rounded-md ml-2"
                            onClick={() => onSelectPatient(patient.id)}
                          >
                            {capitalizeFirstLetter(patient.name)}
                          </button>
                        </li>
                      ))}
                    </ul>
                    <p><strong>Client :</strong> {capitalizeFirstLetter(marker.patients[0].client.lastname)} {capitalizeFirstLetter(marker.patients[0].client.firstname)}</p>
                    <p><strong>Adresse :</strong> {marker.patients[0].client.adress}, {capitalizeFirstLetter(marker.patients[0].client.city)}</p>
                  </>
                ) : (
                  <p>Aucun patient trouvé à cette adresse.</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {vetMarkers.map((vetMarker, idx) => (
          <Marker key={idx} position={[vetMarker.lat, vetMarker.lng]} icon={vetoIcon}>
            <Popup>
              <div>
                <p>Centre vétérinaire : {capitalizeFirstLetter(vetMarker.name)}</p>
                <p>{vetMarker.adress}, {capitalizeFirstLetter(vetMarker.city)}</p>
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded-md ml-2"
                  onClick={() => onSelectVetCenter(vetMarker.id)}
                >
                  Détails
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
