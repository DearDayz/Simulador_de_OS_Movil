import React, { useEffect, useState } from "react";
import { usePhone } from "@/context/PhoneContext";
import { Battery, Wifi, Signal, X, Power, RefreshCw } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const StatusBar: React.FC = () => {
  const {
    batteryLevel,
    isCharging,
    isWifiConnected,
    isCellularConnected,
    cellularStrength,
    //setPowerMenuOpen,
    shutdownPhone,
    restartPhone,
  } = usePhone();

  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );

  useEffect(() => {
    // Actualizar hora cada minuto
    const interval = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const batteryPercentage = Math.floor(batteryLevel);

  return (
    <div className="h-5 bg-black bg-opacity-80 flex justify-between items-center px-4 text-xs font-medium text-white z-10">
      <div>{currentTime}</div>

      {/* Notch con cámara frontal simulada */}
      <div className="absolute top-0 left-0 right-0 flex justify-center">
        <div className="w-12 h-2 bg-black rounded-b-xl flex items-center justify-center">
          <div className="w-2 h-2 bg-gray-900 rounded-full border border-gray-700"></div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {isCellularConnected ? (
          <Signal size={10} className="text-white" />
        ) : (
          <div className="relative">
            <Signal size={10} className="text-gray-400" />
            <X
              size={6}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
        )}

        {isWifiConnected ? (
          <Wifi size={10} className="text-white" />
        ) : (
          <div className="relative">
            <Wifi size={10} className="text-gray-400" />
            <X
              size={6}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
        )}

        <Popover>
          <PopoverTrigger asChild>
            <div className="flex items-center cursor-pointer">
              <Battery
                size={10}
                className={
                  isCharging
                    ? "text-green-500"
                    : batteryPercentage < 20
                    ? "text-red-500"
                    : "text-white"
                }
              />
              <span className="text-xs ml-1">{batteryPercentage}%</span>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-30 p-2">
            <div className="flex flex-col space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 w-full"
                onClick={shutdownPhone}
              >
                <Power size={14} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 w-full"
                onClick={restartPhone} // Sin funcionalidad por ahora
              >
                <RefreshCw size={14} />
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default StatusBar;
