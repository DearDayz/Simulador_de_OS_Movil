import React, { useState, useEffect } from "react";
import { usePhone } from "@/context/PhoneContext";
import { Wifi, WifiOff, Signal, X, Image } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";

const WIFI_NETWORKS = [
  { 
    id: 1, 
    name: "Red Hogar", 
    secured: true, 
    signal: 90, // excelente 
    signalText: "Excelente",
    ip: "192.168.1.5"
  },
  { 
    id: 2, 
    name: "VecindarioWiFi", 
    secured: false, 
    signal: 52, // buena 
    signalText: "Buena",
    ip: "192.168.2.14"
  },
  { 
    id: 3, 
    name: "CoffeeShop", 
    secured: true, 
    signal: 30, // regular 
    signalText: "Regular",
    ip: "10.0.0.15"
  },
  { 
    id: 4, 
    name: "AeroHotel", 
    secured: true, 
    signal: 12, // débil 
    signalText: "Débil",
    ip: "172.22.0.111"
  },
];

const ConnectivityApp: React.FC = () => {
  const { 
    isWifiConnected, 
    isCellularConnected, 
    cellularStrength,
    toggleWifi,
    toggleCellular,
    wifiSignalStrength,
    connectedWifiName,
    setCustomWifiSignal,
    setCustomWifiIp,
    wifiIp,
    photos
  } = usePhone();

  const [showNetworks, setShowNetworks] = useState(false);

  const [wifiSpeed, setWifiSpeed] = useState({ upload: 0, download: 0 });
  
  useEffect(() => {
    if (isWifiConnected) {
      const baseUpload = 8.2;
      const baseDownload = 32.5;
      const signalMultiplier = wifiSignalStrength / 100;
      setWifiSpeed({
        upload: parseFloat((baseUpload * signalMultiplier).toFixed(1)),
        download: parseFloat((baseDownload * signalMultiplier).toFixed(1))
      });
    } else {
      setWifiSpeed({ upload: 0, download: 0 });
    }
  }, [isWifiConnected, wifiSignalStrength]);

  const handleNetworkSelect = (networkId: number) => {
    const network = WIFI_NETWORKS.find(net => net.id === networkId);
    if (network) {
      toggleWifi(true, network.name);
      setCustomWifiSignal(network.signal);
      setCustomWifiIp(network.ip);
    }
    setShowNetworks(false);
  };

  const getWifiIcon = () => {
    if (!isWifiConnected) return <WifiOff size={24} className="text-gray-400 mr-3" />;
    if (wifiSignalStrength > 75) {
      return <Wifi size={24} className="text-blue-500 mr-3" />;
    } else if (wifiSignalStrength > 50) {
      return <Wifi size={24} className="text-green-500 mr-3" />;
    } else if (wifiSignalStrength > 25) {
      return <Wifi size={24} className="text-yellow-500 mr-3" />;
    } else {
      return (
        <span className="mr-3 relative">
          <Wifi size={24} className="text-red-500 opacity-30" />
          <div className="absolute left-3 top-3 w-2 h-2 bg-red-500 rounded-full" />
        </span>
      );
    }
  };

  return (
    <div className="h-full flex flex-col p-6 bg-white">
      <h2 className="text-2xl font-semibold text-center mb-8">Conectividad</h2>
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              {getWifiIcon()}
              <div>
                <div className="font-medium">Wi-Fi</div>
                <div className="text-sm text-gray-500">
                  {isWifiConnected 
                    ? `Conectado a ${connectedWifiName || "Red Hogar"}` 
                    : "Desconectado"}
                </div>
              </div>
            </div>
            <Switch checked={isWifiConnected} onCheckedChange={(checked) => {
                if (!checked) {
                  toggleWifi(false);
                  setCustomWifiSignal(0);
                  setCustomWifiIp("-");
                } else {
                  toggleWifi(true, WIFI_NETWORKS[0].name);
                  setCustomWifiSignal(WIFI_NETWORKS[0].signal);
                  setCustomWifiIp(WIFI_NETWORKS[0].ip);
                }
              }} />
          </div>
          {isWifiConnected && (
            <div className="mt-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Dirección IP</span>
                <span>{wifiIp || "192.168.1.5"}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Fuerza de Señal</span>
                <span>
                  {wifiSignalStrength > 75
                    ? "Excelente"
                    : wifiSignalStrength > 50
                    ? "Buena"
                    : wifiSignalStrength > 25
                    ? "Regular"
                    : "Débil"}
                </span>
              </div>
            </div>
          )}
          <div className="mt-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => setShowNetworks(true)}
            >
              Buscar redes WiFi
            </Button>
          </div>
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
                <span>Movistar</span>
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
              <span>{isWifiConnected ? wifiSpeed.upload : 3.1} Mbps</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Velocidad de Descarga</span>
              <span>{isWifiConnected ? wifiSpeed.download : 12.3} Mbps</span>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={showNetworks} onOpenChange={setShowNetworks}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Redes WiFi disponibles</DialogTitle>
            <DialogDescription>
              Selecciona una red para conectarte
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 mt-2">
            {WIFI_NETWORKS.map((network) => (
              <div 
                key={network.id}
                className="p-3 border rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-50"
                onClick={() => handleNetworkSelect(network.id)}
              >
                <div className="flex items-center">
                  <Wifi size={18} className="mr-2" 
                    color={
                      network.signal > 75
                        ? "#3b82f6"
                        : network.signal > 50
                        ? "#22c55e"
                        : network.signal > 25
                        ? "#eab308"
                        : "#ef4444"
                    }
                  />
                  <div>
                    <div>{network.name}</div>
                    <div className="text-xs text-gray-500">
                      {network.secured ? "Segura" : "Abierta"} • {network.signalText}
                    </div>
                  </div>
                </div>
                {isWifiConnected && connectedWifiName === network.name && (
                  <div className="text-xs text-green-500 font-medium">Conectado</div>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConnectivityApp;
