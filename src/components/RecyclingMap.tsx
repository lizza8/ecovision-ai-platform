import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Filter, Phone, Clock, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface RecyclingPoint {
  id: number;
  name: string;
  lat: number;
  lng: number;
  materials: string[];
  hours: string;
  phone: string;
  address: string;
  website?: string;
}

const RECYCLING_POINTS: RecyclingPoint[] = [
  { 
    id: 1, 
    name: 'Tbilisi Central Recycling Hub', 
    lat: 41.7151, 
    lng: 44.8271, 
    materials: ['Plastic', 'Metal', 'Glass', 'Paper'], 
    hours: '24/7', 
    phone: '+995 32 2 123 456',
    address: 'Rustaveli Ave 12, Tbilisi',
    website: 'https://example.com'
  },
  { 
    id: 2, 
    name: 'Vake Eco Collection Point', 
    lat: 41.6938, 
    lng: 44.7710, 
    materials: ['Plastic', 'Paper'], 
    hours: '9:00-18:00', 
    phone: '+995 32 2 234 567',
    address: 'Chavchavadze Ave 45, Tbilisi'
  },
  { 
    id: 3, 
    name: 'Saburtalo Green Center', 
    lat: 41.7225, 
    lng: 44.7514, 
    materials: ['Metal', 'Glass', 'Paper'], 
    hours: '8:00-20:00', 
    phone: '+995 32 2 345 678',
    address: 'Vazha-Pshavela Ave 71, Tbilisi'
  },
  { 
    id: 4, 
    name: 'Batumi Coastal Recycling', 
    lat: 41.6168, 
    lng: 41.6367, 
    materials: ['Plastic', 'Metal'], 
    hours: '10:00-19:00', 
    phone: '+995 422 27 1234',
    address: 'Gogebashvili St 2, Batumi'
  },
  { 
    id: 5, 
    name: 'Batumi Port Eco Station', 
    lat: 41.6422, 
    lng: 41.6344, 
    materials: ['Glass', 'Paper'], 
    hours: '7:00-22:00', 
    phone: '+995 422 27 2345',
    address: 'Port Area, Batumi'
  },
  { 
    id: 6, 
    name: 'Rustavi Industrial Recycling', 
    lat: 41.5492, 
    lng: 45.0036, 
    materials: ['Metal', 'Plastic', 'Glass'], 
    hours: '24/7', 
    phone: '+995 341 2 3456',
    address: 'Industrial Zone, Rustavi'
  },
  { 
    id: 7, 
    name: 'Kutaisi Green Hub', 
    lat: 42.2679, 
    lng: 42.6993, 
    materials: ['Plastic', 'Paper', 'Glass'], 
    hours: '9:00-18:00', 
    phone: '+995 431 2 4567',
    address: 'Tsereteli St 15, Kutaisi'
  },
  { 
    id: 8, 
    name: 'Gori Eco Center', 
    lat: 41.9842, 
    lng: 44.1089, 
    materials: ['Metal', 'Paper'], 
    hours: '8:00-17:00', 
    phone: '+995 370 2 5678',
    address: 'Stalin Ave 23, Gori'
  },
];

const MATERIAL_COLORS: Record<string, string> = {
  Plastic: 'bg-primary text-background',
  Metal: 'bg-secondary text-white',
  Glass: 'bg-accent text-background',
  Paper: 'bg-warning text-background',
};

const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

const materialIcons: Record<string, L.DivIcon> = {
  Plastic: createCustomIcon('hsl(190, 100%, 50%)'),
  Metal: createCustomIcon('hsl(276, 78%, 58%)'),
  Glass: createCustomIcon('hsl(155, 100%, 50%)'),
  Paper: createCustomIcon('hsl(40, 100%, 50%)'),
  Mixed: createCustomIcon('hsl(200, 100%, 50%)'),
};

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
}

export default function RecyclingMap() {
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([41.7151, 44.8271]);
  const [mapZoom, setMapZoom] = useState(12);
  const [nearestPoint, setNearestPoint] = useState<RecyclingPoint | null>(null);

  const materials = ['Plastic', 'Metal', 'Glass', 'Paper'];

  const toggleMaterial = (material: string) => {
    setSelectedMaterials(prev =>
      prev.includes(material)
        ? prev.filter(m => m !== material)
        : [...prev, material]
    );
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleNearMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos: [number, number] = [position.coords.latitude, position.coords.longitude];
          setUserLocation(userPos);
          setMapCenter(userPos);
          setMapZoom(13);

          let nearest = RECYCLING_POINTS[0];
          let minDistance = calculateDistance(userPos[0], userPos[1], nearest.lat, nearest.lng);

          RECYCLING_POINTS.forEach(point => {
            const distance = calculateDistance(userPos[0], userPos[1], point.lat, point.lng);
            if (distance < minDistance) {
              minDistance = distance;
              nearest = point;
            }
          });

          setNearestPoint(nearest);
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to access your location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const filteredPoints = useMemo(() => {
    return RECYCLING_POINTS.filter(point =>
      selectedMaterials.length === 0 ||
      point.materials.some(m => selectedMaterials.includes(m))
    );
  }, [selectedMaterials]);

  const getMarkerIcon = (point: RecyclingPoint) => {
    if (point.materials.length === 1) {
      return materialIcons[point.materials[0]];
    }
    return materialIcons.Mixed;
  };

  return (
    <Card className="card-elevated p-6 space-y-6 rounded-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-primary/50" />
      <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-primary/50" />
      
      <div className="flex items-center justify-between relative z-10">
        <h2 className="text-h3 font-bold text-primary tracking-wider">RECYCLING MAP</h2>
        <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary flex items-center justify-center shadow-neon">
          <MapPin className="w-5 h-5 text-primary" strokeWidth={2} />
        </div>
      </div>

      <div className="relative h-20 rounded-xl overflow-hidden bg-gradient-holographic border border-primary/30">
        <div className="absolute inset-0 flex items-center justify-center gap-8">
          <div className="text-center">
            <div className="text-h3 font-bold text-foreground">{filteredPoints.length}</div>
            <div className="text-caption text-gray-300">Recycling Centers</div>
          </div>
          {nearestPoint && (
            <div className="text-center">
              <div className="text-h4 font-bold text-accent">{nearestPoint.name}</div>
              <div className="text-caption text-gray-300">Nearest Location</div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 relative z-10">
        <div className="flex items-center gap-2 text-body-sm text-gray-300">
          <Filter className="w-4 h-4" strokeWidth={2} />
          <span className="font-medium">Filter:</span>
        </div>
        {materials.map(material => (
          <motion.button
            key={material}
            onClick={() => toggleMaterial(material)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-lg text-body-sm font-medium transition-all border-2 ${
              selectedMaterials.includes(material)
                ? `${MATERIAL_COLORS[material]} border-transparent shadow-neon`
                : 'bg-secondary/50 text-gray-300 border-primary/30 hover:border-primary'
            }`}
          >
            {material}
          </motion.button>
        ))}
        <Button
          onClick={handleNearMe}
          className="ml-auto h-10 bg-primary text-background font-bold hover:bg-primary-hover shadow-neon hover:shadow-neon-lg transition-all"
        >
          <Navigation className="w-4 h-4 mr-2" strokeWidth={2} />
          Near Me
        </Button>
      </div>

      <div className="relative h-[500px] rounded-xl overflow-hidden border-2 border-primary/30 shadow-neon z-0">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <MapController center={mapCenter} zoom={mapZoom} />
          
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {userLocation && (
            <Marker 
              position={userLocation}
              icon={L.divIcon({
                className: 'user-location-marker',
                html: '<div style="background-color: #ff0000; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(255,0,0,0.5);"></div>',
                iconSize: [20, 20],
                iconAnchor: [10, 10],
              })}
            >
              <Popup>
                <div className="text-center">
                  <strong>Your Location</strong>
                </div>
              </Popup>
            </Marker>
          )}

          {filteredPoints.map(point => (
            <Marker 
              key={point.id} 
              position={[point.lat, point.lng]}
              icon={getMarkerIcon(point)}
            >
              <Popup maxWidth={300}>
                <div className="p-2">
                  <h3 className="font-bold text-lg mb-2 text-gray-900">{point.name}</h3>
                  
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{point.address}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span>{point.hours}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <a href={`tel:${point.phone}`} className="text-blue-600 hover:underline">
                        {point.phone}
                      </a>
                    </div>

                    {point.website && (
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 flex-shrink-0" />
                        <a 
                          href={point.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                    
                    <div className="pt-2 border-t border-gray-200">
                      <div className="text-xs font-semibold text-gray-600 mb-1">Accepted Materials:</div>
                      <div className="flex flex-wrap gap-1">
                        {point.materials.map(material => (
                          <span
                            key={material}
                            className={`px-2 py-1 rounded text-xs font-medium ${MATERIAL_COLORS[material]}`}
                          >
                            {material}
                          </span>
                        ))}
                      </div>
                    </div>

                    {userLocation && (
                      <div className="pt-2 border-t border-gray-200">
                        <div className="text-xs font-semibold text-gray-600">
                          Distance: {calculateDistance(userLocation[0], userLocation[1], point.lat, point.lng).toFixed(2)} km
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto relative z-10">
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">ALL LOCATIONS</h3>
        {filteredPoints.map((point, index) => {
          const distance = userLocation 
            ? calculateDistance(userLocation[0], userLocation[1], point.lat, point.lng)
            : null;

          return (
            <motion.div
              key={point.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => {
                setMapCenter([point.lat, point.lng]);
                setMapZoom(15);
              }}
              className="p-4 rounded-xl bg-secondary/50 border-2 border-primary/30 hover:border-primary transition-all cursor-pointer hover:shadow-neon"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-body-sm font-bold text-foreground mb-1">{point.name}</div>
                  
                  <div className="flex items-center gap-2 text-caption text-gray-400 mb-1">
                    <MapPin className="w-3 h-3" strokeWidth={2} />
                    {point.address}
                  </div>
                  
                  <div className="flex items-center gap-2 text-caption text-gray-400 mb-1">
                    <Clock className="w-3 h-3" strokeWidth={2} />
                    {point.hours}
                  </div>
                  
                  <div className="flex items-center gap-2 text-caption text-gray-400 mb-2">
                    <Phone className="w-3 h-3" strokeWidth={2} />
                    {point.phone}
                  </div>

                  {distance && (
                    <div className="text-caption font-bold text-accent mb-2">
                      {distance.toFixed(2)} km away
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-1">
                    {point.materials.map(material => (
                      <span
                        key={material}
                        className={`px-2 py-0.5 rounded text-caption font-medium ${MATERIAL_COLORS[material]}`}
                      >
                        {material}
                      </span>
                    ))}
                  </div>
                </div>
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 ml-2" strokeWidth={2} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
