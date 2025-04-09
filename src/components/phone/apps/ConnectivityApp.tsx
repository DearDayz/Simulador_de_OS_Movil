
import React from "react";
import { usePhone } from "@/context/PhoneContext";
import { Wifi, Signal, WifiOff, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const ConnectivityApp: React.FC = () => {
  const { 
    isWifiConnected, 
    isCellularConnected, 
    cellularStrength,
    toggleWifi,
    toggleCellular
  } = usePhone();
  
  return (
    <div className="h-full flex flex-col p-6">
      <h2 className="text-2xl font-semibold text-center mb-8">Conectividad</h2>
      
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              {isWifiConnected ? (
                <Wifi size={24} className="text-blue-500 mr-3" />
              ) : (
                <WifiOff size={24} className="text-gray-400 mr-3" />
              )}
              <div>
                <div className="font-medium">Wi-Fi</div>
                <div className="text-sm text-gray-500">
                  {isWifiConnected ? "Conectado a Red Hogar" : "Desconectado"}
                </div>
              </div>
            </div>
            <Switch checked={isWifiConnected} onCheckedChange={toggleWifi} />
          </div>
          
          {isWifiConnected && (
            <div className="mt-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Dirección IP</span>
                <span>192.168.1.5</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Fuerza de Señal</span>
                <span>Excelente</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              {isCellularConnected ? (
                <Signal size={24} className="text-green-500 mr-3" />
              ) : (
                <div className="relative mr-3">
                  <Signal size={24} className="text-gray-400" />
                  <X size={14} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              )}
              <div>
                <div className="font-medium">Datos Móviles</div>
                <div className="text-sm text-gray-500">
                  {isCellularConnected 
                    ? `Conectado (${cellularStrength}G)` 
                    : "Desconectado"}
                </div>
              </div>
            </div>
            <Switch checked={isCellularConnected} onCheckedChange={toggleCellular} />
          </div>
          
          {isCellularConnected && (
            <div className="mt-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Operador</span>
                <span>MiOperador Móvil</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Fuerza de Señal</span>
                <span>{cellularStrength === 5 
                  ? "Excelente" 
                  : cellularStrength === 4 
                  ? "Buena" 
                  : "Regular"}</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-medium mb-2">Estadísticas de Red</h3>
          <div className="text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Datos Usados</span>
              <span>2.4 GB / 10 GB</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Velocidad de Subida</span>
              <span>8.2 Mbps</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Velocidad de Descarga</span>
              <span>32.5 Mbps</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectivityApp;
