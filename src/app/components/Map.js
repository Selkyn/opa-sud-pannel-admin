import { MapContainer, TileLayer, Marker, Popup, useMapEvent, Polyline, useMap, useMapEvents } from 'react-leaflet';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import LocateButton from './LocateButton';
import { capitalizeFirstLetter } from '../utils/stringUtils';
import MapControls from './MapControls';
import api from '@/utils/apiCall';


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

const osmVetIcon = new L.Icon({
  iconUrl: '/icons/osmVet.png',
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

const osteoIcon = new L.Icon({
  iconUrl: '/icons/osteo.png',
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

const Map = ({ 
  onSelectPatient, 
  onSelectVetCenter,
  onSelectOsteoCenter, 
  focusedPatientId, 
  focusedVetCenterId,
  focusedOsteoCenterId 
}) => {
  const [markers, setMarkers] = useState([]);
  const [vetMarkers, setVetMarkers] = useState([]);
  const [osteoMarkers, setOsteoMarkers] = useState([]);
  const [centerPosition, setCenterPosition] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [route, setRoute] = useState(null);
  const [routeDetails, setRouteDetails] = useState(null);
  const [destination, setDestination] = useState(null);

  const [priceGas, setPriceGas] = useState(null);
  const [avoidMotorways, setAvoidMotorways] = useState(false);
  const [isCreatingRoute, setIsCreatingRoute] = useState(false);
  const [selectedPoints, setSelectedPoints] = useState([]);
  const [stepDetails, setStepDetails] = useState([]);
  const [namePoints, setNamePoints] = useState([])
  const zoomLevel = 14;
  const apiKeyTomTom = process.env.NEXT_PUBLIC_TOMTOM_API_KEY;
  // const [osmVetMarkers, setOsmVetMarkers] = useState([]);

  // const fetchVetCentersFromOSM = async (bounds, zoom) => {
  //   if (zoom < 12) {
  //     setOsmVetMarkers([]); // Supprime les marqueurs si on dézoome trop
  //     return;
  //   }
  //   if (zoom < 12) return;

  //   const { _northEast, _southWest } = bounds;
  //   const overpassUrl = "https://overpass-api.de/api/interpreter";
  //   const query = `
  //   [out:json];
  //   (
  //     node["amenity"="veterinary"](${_southWest.lat},${_southWest.lng},${_northEast.lat},${_northEast.lng});
  //     node["amenity"="animal_hospital"](${_southWest.lat},${_southWest.lng},${_northEast.lat},${_northEast.lng});
  //     node["office"="veterinary"](${_southWest.lat},${_southWest.lng},${_northEast.lat},${_northEast.lng});
  //     node["amenity"="clinic"][animal="yes"](${_southWest.lat},${_southWest.lng},${_northEast.lat},${_northEast.lng}); 
  //   );
  //   out body;
  // `;

  //   try {
  //     const response = await axios.post(overpassUrl, query, {
  //       headers: { "Content-Type": "text/plain" },
  //     });
  //     const data = response.data.elements.map((node) => ({
  //       lat: node.lat,
  //       lng: node.lon,
  //       name: node.tags.name || "vétérinaire" || "veterinaire",
  //       address: node.tags["addr:street"] || "Adresse inconnue",
  //     }));
  //     setOsmVetMarkers(data);
  //     console.log('Centres vétérinaires OSM récupérés :', data);
  //   } catch (error) {
  //     console.error("Erreur lors de la récupération des centres vétérinaires via OSM :", error);
  //   }
  // };

  // const handleMapMove = (bounds, zoom) => {
  //   fetchVetCentersFromOSM(bounds, zoom);
  // };


  const MapEventHandler = ({ onMapMove }) => {
    useMapEvents({
      moveend: (e) => {
        const map = e.target;
        const bounds = map.getBounds();
        const zoom = map.getZoom();
  
        // console.log('Carte déplacée, niveau de zoom :', zoom, 'Limites de la carte :', bounds);
        onMapMove(bounds, zoom); // Passe les informations à la fonction parent
      },
    });
  
    return null;
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await api.get('/patients');
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
                patients: [],
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
        const response = await api.get('/vet-centers');
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
    const fetchOsteoCenters = async () => {
      try {
        const response = await api.get('/osteo-centers');
        const osteoCenters = response.data;
        const newOsteoMarkers = osteoCenters
          .filter(osteoCenter => osteoCenter.latitude && osteoCenter.longitude)
          .map((osteoCenter) => ({
            lat: osteoCenter.latitude,
            lng: osteoCenter.longitude,
            ...osteoCenter,
          }));

        setOsteoMarkers(newOsteoMarkers);
      } catch (error) {
        console.error("Erreur lors de la récupération des centres vétérinaires :", error);
      }
    };

    fetchOsteoCenters();
  }, []);

  useEffect(() => {
    // console.log("ID du patient reçu dans Map :", focusedPatientId);

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
    if (focusedVetCenterId && vetMarkers.length > 0) {
      const vetCenterMarker = vetMarkers.find(marker =>
        marker.id === parseInt(focusedVetCenterId)
      );

      if (vetCenterMarker) {
        setCenterPosition([vetCenterMarker.lat, vetCenterMarker.lng]);
      }
    }
  }, [focusedVetCenterId, vetMarkers]);

  useEffect(() => {
    if (focusedOsteoCenterId && osteoMarkers.length > 0) {
      const osteoCenterMarker = osteoMarkers.find(marker =>
        marker.id === parseInt(focusedOsteoCenterId)
      );

      if (osteoCenterMarker) {
        setCenterPosition([osteoCenterMarker.lat, osteoCenterMarker.lng]);
      }
    }
  }, [focusedOsteoCenterId, osteoMarkers]);

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

    const calculateRoute = async () => {
      if (selectedPoints.length < 2) {
        alert("Veuillez sélectionner au moins deux points.");
        return;
      }
    
      // Extract only coordinates from selectedPoints
      const start = selectedPoints[0].coords;
      const end = selectedPoints[selectedPoints.length - 1].coords;
      const waypoints = selectedPoints.slice(1, -1).map(point => point.coords); // Only pass coordinates, not names
      const waypointsParam = waypoints.map((point) => `${point[0]},${point[1]}`).join(':');
      const avoidParam = avoidMotorways ? '&avoid=tollRoads' : ''; 
      const url = `https://api.tomtom.com/routing/1/calculateRoute/${start[0]},${start[1]}:${waypointsParam}:${end[0]},${end[1]}/json?avoid=unpavedRoads${avoidParam}&key=${apiKeyTomTom}`;
    
      try {
        const response = await axios.get(url);
        const routeData = response.data.routes[0];
        const decodedPolyline = routeData.legs.flatMap((leg) => leg.points.map((point) => [point.latitude, point.longitude]));
        setRoute(decodedPolyline);
        setRouteDetails({ distance: routeData.summary.lengthInMeters, duration: routeData.summary.travelTimeInSeconds * 1000 });
    
        // Update steps with only distance and duration
        const steps = routeData.legs.map((leg, index) => ({
          distance: leg.summary.lengthInMeters,
          duration: leg.summary.travelTimeInSeconds * 1000,
          from: selectedPoints[index],
          to: selectedPoints[index + 1],
        }));
        
        setStepDetails(steps);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'itinéraire TomTom :", error);
      }
    };
    

    const handleMarkerClick = (lat, lng, name) => {
      if (isCreatingRoute) {
        setSelectedPoints((prevPoints) => [...prevPoints, { coords: [lat, lng], name }]);
      }
    };

    const toggleCreateRoute = () => {
      setIsCreatingRoute((prev) => !prev);
      setSelectedPoints(userLocation ? [{ coords: userLocation, name: "Votre position" }] : []); // Initialize with user location and label
      // Initialiser le point de départ avec la géolocalisation
      setRoute(null); // Réinitialiser le parcours
      setStepDetails([]);
    };

    const getRoute = async (start, end) => {
      const avoidParam = avoidMotorways ? '&avoid=tollRoads' : '';
      const url = `https://api.tomtom.com/routing/1/calculateRoute/${start[0]},${start[1]}:${end[0]},${end[1]}/json?avoid=unpavedRoads${avoidParam}&key=${apiKeyTomTom}`;      
      try {
        const response = await axios.get(url);
        const routeData = response.data.routes[0];
        const distance = routeData.summary.lengthInMeters;
        const duration = routeData.summary.travelTimeInSeconds * 1000;
  
        // Les points de l’itinéraire sont stockés dans `legs[0].points`
        const decodedPolyline = routeData.legs[0].points.map(point => [point.latitude, point.longitude]);
        
        setRoute(decodedPolyline);
        setRouteDetails({ distance, duration });
      } catch (error) {
        console.error("Erreur lors de la récupération de l'itinéraire TomTom :", error);
      }
    };
    
    const handleAvoidMotorwaysChange = (shouldAvoid) => {
      setAvoidMotorways(shouldAvoid);
    };

    useEffect(() => {
      if (userLocation && destination && !isCreatingRoute) {
        getRoute(userLocation, destination, avoidMotorways);
      }
    }, [avoidMotorways, destination, userLocation]);

    useEffect(() => {
      if (isCreatingRoute && selectedPoints.length > 1) {
        calculateRoute();
      }
    }, [avoidMotorways]);

    const handleRouteToMarker = (markerPosition) => {
      setDestination(markerPosition);
    };

    const formatDistance = (distance) => (distance / 1000).toFixed(2) + " km";
    const costGas = (distance) => {
      const distanceInKm = distance / 1000;
      const fuelConsumption = 10;
      const fuelPricePerLitre = 1.6;
    
      return ((distanceInKm / 100) * fuelConsumption * fuelPricePerLitre).toFixed(2) + " €";
    };
    const formatTime = (time) => {
      const totalMinutes = Math.floor(time / 60000);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `${hours}h ${minutes}m`;
    };
    // console.log("Détails de l'itinéraire :", routeDetails);


  return (
    <div className="position: relative">
      <MapContainer
        center={[43.683333, 4.133333]}
        zoom={7}
        style={{ height: '100vh', width: '100%' }}
        // onMoveEnd={handleMapMove}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* <MapEventHandler onMapMove={handleMapMove} /> */}
        <MapControls onAvoidMotorwaysChange={handleAvoidMotorwaysChange} />
        <LocateButton onLocate={(location) => setUserLocation(location)} />

        {route && (
        <Polyline positions={route} color="blue" weight={4} />
      )}

        {routeDetails && (
          <div style={{ position: 'absolute', top: '100px', left: '10px', backgroundColor: 'white', padding: '10px', borderRadius: '5px', zIndex: 1000 }}>
            <h3>Détails du parcours</h3>
            <p>Distance totale : {formatDistance(routeDetails.distance)}</p>
            <p>Durée totale : {formatTime(routeDetails.duration)}</p>
            <p>Prix essence : {costGas(routeDetails.distance)}</p>
            <h4>Étapes :</h4>
            <ul>
            {stepDetails.map((step, index) => (
              <li 
                key={index}
                className="mb-2"
                >
                  De {(step.from.name === "Votre position" ? "Votre position " : step.from.name + " ") || `${step.from.coords[0].toFixed(3)}, ${step.from.coords[1].toFixed(3)} `} 
                  à {(step.to.name || `${step.to.coords[0].toFixed(3)}, ${step.to.coords[1].toFixed(3)}`)} :<br />
                  Distance : {formatDistance(step.distance)}, Durée : {formatTime(step.duration)}
              </li>
            ))}
            </ul>
          </div>
        )}

            {/* Route creation controls */}
            <div style={{ position: 'absolute', top: '500px', left: '10px', zIndex: 1000, backgroundColor: 'white' }}>
              <button onClick={toggleCreateRoute} style={{ padding: '10px', marginRight: '5px' }}>
                {isCreatingRoute ? "Annuler" : "Créer un parcours"}
              </button>
              {isCreatingRoute && (
                <button onClick={calculateRoute} style={{ padding: '10px' }}>
                  Calculer le parcours
                </button>
              )}
            </div>

        {userLocation && (
          <Marker position={userLocation} icon={geolocIcon}>
            <Popup>Vous êtes ici</Popup>
          </Marker>
        )}

        {centerPosition && <CenterMap position={centerPosition} zoomLevel={zoomLevel} />}

        {/* {osmVetMarkers.map((osmMarker, idx) => (
          <Marker
            key={`osm-${idx}`}
            position={[osmMarker.lat, osmMarker.lng]}
            icon={osmVetIcon}
          >
            <Popup>
              <p>{osmMarker.name}</p>
              <p>{osmMarker.address}</p>
            </Popup>
          </Marker>
        ))} */}

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
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded-md ml-2"
                  onClick={() => handleMarkerClick(marker.lat, marker.lng, marker.patients[0].client.lastname)}
                  >
                    ajouter
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
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded-md ml-2"
                  onClick={() => {
                    // console.log(vetMarker.name);
                    handleMarkerClick(vetMarker.lat, vetMarker.lng, vetMarker.name);
                  }}
                >
                  ajouter
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {osteoMarkers.map((osteoMarker, idx) => (
          <Marker 
            key={idx}
            position={[osteoMarker.lat, osteoMarker.lng]}
            icon={osteoIcon}
            >
          
            <Popup>
              <div>
                <p>Centre ostéopathe : {capitalizeFirstLetter(osteoMarker.name)}</p>
                <p>{osteoMarker.adress}, {capitalizeFirstLetter(osteoMarker.city)}</p>
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded-md ml-2"
                  onClick={() => onSelectOsteoCenter(osteoMarker.id)}
                >
                  Détails
                </button>
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded-md ml-2"
                  onClick={() => handleRouteToMarker([osteoMarker.lat, osteoMarker.lng])}
                >
                  Itinéraire
                </button>
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded-md ml-2"
                  onClick={() => {
                    // console.log(osteoMarker.name);
                    handleMarkerClick(osteoMarker.lat, osteoMarker.lng, osteoMarker.name);
                  }}
                >
                  ajouter
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
