import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useEffect, useState } from 'react';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;

const customIcon = new L.Icon({
  iconUrl: '/icons/dog.png',
  iconSize: [25, 30],
  iconAnchor: [17, 45],
  popupAnchor: [0, -45],
  shadowSize: [45, 45], 
  shadowAnchor: [15, 45] 
});

const Map = ({ onSelectPatient }) => {
  const [markers, setMarkers] = useState([]);
  const [isSSR, setIsSSR] = useState(true);

  const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;
  
  const resetLocalStorage = () => {
    localStorage.clear();
    console.log("LocalStorage a été réinitialisé.");
};

  useEffect(() => {
    setIsSSR(false);
  
    const fetchPatientsAndGeocode = async () => {
      const cachedData = localStorage.getItem('patientMarkers'); // Données des anciens marqueurs
      const cachedAddresses = localStorage.getItem('cachedAddresses'); // Adresses en cache
      const oldMarkers = cachedData ? JSON.parse(cachedData) : []; // Récupération des anciens marqueurs
      const newMarkers = [];
      const patientsByAddress = {};
      const currentAddresses = []; // Nouvelle liste des adresses actuelles

      console.log("Cached Data:", cachedData);
      console.log("Cached Addresses:", cachedAddresses);
      console.log("Old Markers:", oldMarkers);
  
      try {
        // Récupérer les patients depuis votre API
        const response = await axios.get('http://localhost:4000/patients');
        const patients = response.data;

                // Regrouper les patients par adresse
                patients.forEach(patient => {
                  const client = patient.client;
                  const fullAddress = `${client.adress}, ${client.postal} ${client.city}`;
                  
                  if (!patientsByAddress[fullAddress]) {
                    patientsByAddress[fullAddress] = [];
                  }
                  patientsByAddress[fullAddress].push(patient);
                  currentAddresses.push(fullAddress);
                });
                console.log("patient by adress", patientsByAddress)
  
        for (const patient of patients) {
          const client = patient.client;
          const fullAddress = `${client.adress}, ${client.postal} ${client.city}`;
          
          currentAddresses.push(fullAddress); // Collecter toutes les adresses actuelles
  
          // Si l'adresse n'est pas dans le cache ou qu'il n'y a pas de cache
          if (!cachedAddresses || !JSON.parse(cachedAddresses).includes(fullAddress)) {
            try {
              // Géocoder les nouvelles adresses
              const geocodeResponse = await axios.get(
                `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(fullAddress)}&key=${apiKey}`
              );
  
              const { lat, lng } = geocodeResponse.data.results[0].geometry;
  
              newMarkers.push({
                id: patient.id,
                lat,
                lng,
                adress: client.adress,
                postal: client.postal,
                name: patient.name,
                lastname: client.lastname,
                firstname: client.firstname
              });
            } catch (error) {
              console.error(`Erreur de géocodage pour l'adresse : ${fullAddress}`, error);
            }
          }
        }

        console.log("New Markers:", newMarkers);
  
        // Si de nouveaux marqueurs ont été trouvés, mettre à jour le cache
        if (newMarkers.length > 0) {
          // Concaténer les anciens marqueurs avec les nouveaux
          const allMarkers = [...oldMarkers, ...newMarkers];

          // Stocker les nouvelles adresses et marqueurs dans LocalStorage
          localStorage.setItem('cachedAddresses', JSON.stringify(currentAddresses));
          localStorage.setItem('patientMarkers', JSON.stringify(allMarkers));

          // Mettre à jour l'état des marqueurs
          setMarkers(allMarkers);
        } else {
          // Utiliser les anciens marqueurs si aucune nouvelle adresse n'a été ajoutée
          setMarkers(oldMarkers);
        }
  
      } catch (error) {
        console.error("Erreur lors de la récupération des patients :", error);
      }
    };
  
    fetchPatientsAndGeocode();
  }, []);

  if (isSSR) {
    return null;
  }

  return (
    <div>
      <button onClick={resetLocalStorage}>Nettoyer le cache</button>
    <MapContainer center={[43.683333, 4.133333]} zoom={7} style={{ height: '900px', width: '100%' }}>
    
    <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {markers.map((marker, idx) => (
        <Marker key={idx} position={[marker.lat, marker.lng]} icon={customIcon}>
            <Popup>
                <div>
                    <p><strong>Patient :</strong> {marker.name}</p>
                    <p><strong>Client :</strong> {marker.lastname} {marker.firstname}</p>
                    <p><strong>Adresse :</strong> {marker.adress}</p>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                        onClick={() => onSelectPatient(marker.id)}
                    >
                        Voir détails
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
