import React, { useEffect, useState } from "react";
import { usePhone } from "@/context/PhoneContext";
import { Battery, Wifi, WifiOff, Signal, X, Power, RefreshCw } from "lucide-react";
import SystemInfo from "./SystemInfo";
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
    wifiSignalStrength,
    connectedWifiName,
    wifiIp,
    shutdownPhone,
    restartPhone,
  } = usePhone();

  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );

  useEffect(() => {
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

  const renderWifiIcon = () => {
    if (!isWifiConnected) {
      return (
        <div className="relative">
          <WifiOff size={10} className="text-gray-400" />
        </div>
      );
    }
    if (wifiSignalStrength >= 75) {
      return <Wifi size={10} className="text-white" />;
    } else if (wifiSignalStrength >= 50) {
      return <Wifi size={10} className="text-white opacity-80" />;
    } else if (wifiSignalStrength >= 25) {
      return <Wifi size={10} className="text-white opacity-60" />;
    } else {
      return (
        <span className="relative">
          <Wifi size={10} className="text-white opacity-40" />
          <div className="absolute left-1.5 top-1 h-1 w-1 bg-red-500 rounded-full" />
        </span>
      );
    }
  };

  return (
    <div className="h-5 bg-black bg-opacity-80 flex justify-between items-center px-4 text-xs font-medium text-white z-10">
      <div className="flex items-center gap-2">
        <SystemInfo />
        {currentTime}
      </div>

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

        {renderWifiIcon()}

        <div className="flex items-center space-x-2">
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

          <Popover>
            <PopoverTrigger asChild>
              <div className="cursor-pointer">
                <Power size={10} className="text-white" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-24 p-2">
              <div className="flex flex-col space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center justify-center w-full aspect-square"
                  onClick={shutdownPhone}
                >
                  <Power size={14} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center justify-center w-full aspect-square"
                  onClick={restartPhone}
                >
                  <RefreshCw size={14} />
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
