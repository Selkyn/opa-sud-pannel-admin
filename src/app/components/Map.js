import { MapContainer, TileLayer, Marker, Popup, useMapEvent, Polyline, useMap } from 'react-leaflet';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import LocateButton from './LocateButton';
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

const geolocIcon = new L.Icon({
  iconUrl: '/icons/geoloc.png',
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
      map.flyTo(position, zoomLevel, { 
        animate: true,
        duration: 1.5,
      });
    }
  }, [position, zoomLevel, map]);

  return null;
};

const Map = ({ onSelectPatient, onSelectVetCenter, focusedPatientId, focusedProfessionalId }) => {
  const [markers, setMarkers] = useState([]);
  const [vetMarkers, setVetMarkers] = useState([]);
  const [centerPosition, setCenterPosition] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [route, setRoute] = useState(null);
  const [routeDetails, setRouteDetails] = useState(null);
  const [priceGas, setPriceGas] = useState(null);
  const zoomLevel = 14;
  const apiKeyGraphHopper = process.env.NEXT_PUBLIC_GRAPHHOPPER_API_KEY;

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

  useEffect(() => {
    if (focusedProfessionalId && vetMarkers.length > 0) {
      const professionalMarker = vetMarkers.find(marker =>
        marker.id === parseInt(focusedProfessionalId)
      );

      if (professionalMarker) {
        setCenterPosition([professionalMarker.lat, professionalMarker.lng]);
      }
    }
  }, [focusedProfessionalId, vetMarkers]);

    // Fonction pour obtenir la position de l'utilisateur
    // const locateUser = () => {
    //   if (navigator.geolocation) {
    //     navigator.geolocation.getCurrentPosition(
    //       (position) => {
    //         const { latitude, longitude } = position.coords;
    //         setUserLocation([latitude, longitude]);
    //         setCenterPosition([latitude, longitude]);
    //       },
    //       (error) => {
    //         console.error("Erreur de géolocalisation :", error);
    //       }
    //     );
    //   } else {
    //     alert("La géolocalisation n'est pas supportée par ce navigateur.");
    //   }
    // };

    useEffect(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation([latitude, longitude]);
            // setCenterPosition([latitude, longitude]);
          },
          (error) => {
            console.error("Erreur de géolocalisation :", error);
          },
          { enableHighAccuracy: true }
        );
      } else {
        console.error("La géolocalisation n'est pas supportée par ce navigateur.");
      }
    }, []);

    const getRoute = async (start, end) => {
      const url = `https://graphhopper.com/api/1/route?point=${start[0]},${start[1]}&point=${end[0]},${end[1]}&vehicle=car&locale=fr&instructions=false&points_encoded=false&key=${apiKeyGraphHopper}&avoid=toll,motorway,ferry`;
      
      try {
        const response = await axios.get(url);
        console.log("Réponse complète de l'API GraphHopper :", response.data);
        
        const paths = response.data.paths;
        if (paths && paths.length > 0) {
          const points = paths[0].points;
          const distance = paths[0].distance;
          const time = paths[0].time;
          
          setRoute(points);
          setRouteDetails({ distance, time });
        } else {
          console.error("Aucun chemin trouvé dans la réponse de l'API.");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'itinéraire :", error);
      }
    };
    

    const handleRouteToMarker = (markerPosition) => {
      if (userLocation) {
        getRoute(userLocation, markerPosition);
      } else {
        alert("Veuillez activer la géolocalisation pour obtenir votre position actuelle.");
      }
    };

    const formatDistance = (distance) => (distance / 1000).toFixed(2) + " km";
    const costGas = (distance) => {
      const distanceInKm = distance / 1000;
      const fuelConsumption = 8;
      const fuelPricePerLitre = 1.6;
    
      return ((distanceInKm / 100) * fuelConsumption * fuelPricePerLitre).toFixed(2) + " €";
    };
    const formatTime = (time) => {
      const totalMinutes = Math.floor(time / 60000);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `${hours}h ${minutes}m`;
    };
    console.log("Détails de l'itinéraire :", routeDetails);


  return (
    <div className="position: relative">
      <MapContainer
        center={[43.683333, 4.133333]}
        zoom={7}
        style={{ height: '900px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <LocateButton onLocate={(location) => setUserLocation(location)} />

        {route && route.coordinates && (
          <Polyline
            positions={route.coordinates.map(([lng, lat]) => [lat, lng])}
            color="blue"
            weight={4}
            opacity={0.7}
          />
        )}

      {routeDetails && (
        <div style={{ position: 'absolute', top: '100px', left: '10px', backgroundColor: 'white', padding: '10px', borderRadius: '5px', zIndex: 1000 }}>
          <p>Distance : {formatDistance(routeDetails.distance)}</p>
          <p>Durée estimée : {formatTime(routeDetails.time)}</p>
          <p>Prix du carburant : {costGas(routeDetails.distance)}</p>

        </div>
      )}

        {userLocation && (
          <Marker position={userLocation} icon={geolocIcon}>
            <Popup>Vous êtes ici</Popup>
          </Marker>
        )}

        {centerPosition && <CenterMap position={centerPosition} zoomLevel={zoomLevel} />}

        {markers.map((marker, idx) => (
          <Marker 
            key={idx}
            position={[marker.lat, marker.lng]}
            icon={customIcon}
            >
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
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded-md ml-2"
                      onClick={() => handleRouteToMarker([marker.lat, marker.lng])}
                >
                  Itinéraire
                </button>
                  </>
                ) : (
                  <p>Aucun patient trouvé à cette adresse.</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {vetMarkers.map((vetMarker, idx) => (
          <Marker 
            key={idx}
            position={[vetMarker.lat, vetMarker.lng]}
            icon={vetoIcon}
            >
          
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
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded-md ml-2"
                  onClick={() => handleRouteToMarker([vetMarker.lat, vetMarker.lng])}
                >
                  Itinéraire
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
