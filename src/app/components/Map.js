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

const vetoIcon = new L.Icon({
  iconUrl: '/icons/veterinaire.png',
  iconSize: [30, 35],
  iconAnchor: [17, 45],
  popupAnchor: [0, -45],
  shadowSize: [45, 45], 
  shadowAnchor: [15, 45] 
})

const Map = ({ onSelectPatient, onSelectVetCenter }) => {
  const [markers, setMarkers] = useState([]);
  const [isSSR, setIsSSR] = useState(true);
  const [vetMarkers, setVetmarkers] = useState([]);

  const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;

  useEffect(() => {
    setIsSSR(false);
  
    const fetchPatientsAndGeocode = async () => {
      const newMarkers = [];
      const patientsByAddress = {};

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
        });
        console.log("Patients par adresse:", patientsByAddress);
  
        // Géocoder chaque adresse
        for (const address in patientsByAddress) {
          try {
            const geocodeResponse = await axios.get(
              `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`
            );
        
            const { lat, lng } = geocodeResponse.data.results[0].geometry;
      
            // Ajouter un marqueur pour chaque adresse
            newMarkers.push({
              lat,
              lng,
              patients: patientsByAddress[address]  // Tous les patients à cette adresse
            });
          } catch (error) {
            console.error(`Erreur de géocodage pour l'adresse : ${address}`, error);
          }
        }

        // Mettre à jour l'état des marqueurs
        setMarkers(newMarkers);
  
      } catch (error) {
        console.error("Erreur lors de la récupération des patients :", error);
      }
    };
  
    fetchPatientsAndGeocode();
  }, []);

  useEffect(() => {
    const fetchVetCenters = async () => {
      const newVetMarkers = [];

      try {
        const reponse = await axios('http://localhost:4000/professionals');
        const vetCenters = reponse.data;

        for (const vetCenter of vetCenters) {
          try {
            const geocodeResponse = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(vetCenter.adress)}&key=${apiKey}`)
            const {lat, lng } = geocodeResponse.data.results[0].geometry;

            newVetMarkers.push({
              ...vetCenter,
              lat,
              lng
            })
          } catch (error) {
            console.error(`Erreur de géocodage pour le centre vétérinaire : ${vetCenter.name}`, error);
          }
        }

        setVetmarkers(newVetMarkers);
      } catch (error) {
        console.error("Erreur lors de la récupération des centres vétérinaires :", error)
      }
    };

    fetchVetCenters();
  }, []);

  if (isSSR) {
    return null;
  }

  return (
    <div>
      <MapContainer center={[43.683333, 4.133333]} zoom={7} style={{ height: '900px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {markers.map((marker, idx) => (
          <Marker key={idx} position={[marker.lat, marker.lng]} icon={customIcon}>
            <Popup>
              <div>
                {marker.patients && marker.patients.length > 0 ? (
                  <>
                    <p><strong>Patients :</strong></p>
                    <ul>
                      {marker.patients.map((patient, i) => (
                        <li key={i} className="mb-2">
                          <button
                            className="bg-blue-500 text-white px-2 py-1 rounded-md ml-2"
                            onClick={() => onSelectPatient(patient.id)}
                          >
                            {patient.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                    <p><strong>Client :</strong> {marker.patients[0].client.lastname} {marker.patients[0].client.firstname}</p>
                    <p><strong>Adresse :</strong> {marker.patients[0].client.adress}, {marker.patients[0].client.city}</p>
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
                <p>Centre vétérinaire : {vetMarker.name}</p>
                <p>{vetMarker.adress}, {vetMarker.city}</p>
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
