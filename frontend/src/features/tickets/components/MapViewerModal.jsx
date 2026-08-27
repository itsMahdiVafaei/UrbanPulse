import React from 'react';
import { X } from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: markerIcon, shadowUrl: markerShadow, iconSize: [25, 41], iconAnchor: [12, 41] });

export default function MapViewerModal({ position, onClose }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50/50">
                    <span className="font-black text-slate-700">موقعیت دقیق ثبت شده</span>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full cursor-pointer transition-colors text-slate-400">
                        <X size={20} />
                    </button>
                </div>
                <div className="h-96 w-full z-10">
                    <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={position} icon={DefaultIcon} />
                    </MapContainer>
                </div>
                <div className="p-4 bg-blue-50 text-center">
                    <p className="text-[10px] font-bold text-blue-600">مختصات: {position[0].toFixed(5)} , {position[1].toFixed(5)}</p>
                </div>
            </div>
        </div>
    );
}