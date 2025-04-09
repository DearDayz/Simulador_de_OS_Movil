import React, { createContext, useContext, useState, useEffect } from "react";

type AppInfo = {
  id: string;
  name: string;
};

type PhoneContextType = {
  batteryLevel: number;
  isCharging: boolean;
  isWifiConnected: boolean;
  isCellularConnected: boolean;
  cellularStrength: number;
  storageUsed: number;
  totalStorage: number;
  ramUsed: number;
  totalRam: number;
  currentApp: string | null;
  setCurrentApp: (app: string | null) => void;
  toggleWifi: () => void;
  toggleCellular: () => void;
  setBatteryCharging: (charging: boolean) => void;
  simulateCall: (phoneNumber: string, name?: string) => void;
  endCall: () => void;
  isInCall: boolean;
  currentCallNumber: string | null;
  currentCallName: string | null;
  photos: string[];
  deletePhoto: (index: number) => void;
  goBack: () => void;
  openRecents: () => void;
  closeRecents: () => void;
  isRecentsOpen: boolean;
  recentApps: AppInfo[];
  isLocked: boolean;
  setIsLocked: (locked: boolean) => void;
  shutdownPhone: () => void;
  restartPhone: () => void;
  // isPowerMenuOpen: boolean;
  // setPowerMenuOpen: (open: boolean) => void;
  isPoweringOff: boolean;
  isRestarting: boolean;
  isShutDown: boolean;
  terminateApp: (appName: string) => void;
};

const PhoneContext = createContext<PhoneContextType | undefined>(undefined);

const APP_NAMES: Record<string, string> = {
  phone: "Teléfono",
  camera: "Cámara",
  microphone: "Micrófono",
  battery: "Batería",
  connectivity: "Wi-Fi y Datos",
  memory: "Almacenamiento",
  gallery: "Galería",
  game: "Juego",
  calculator: "Calculadora",
  calendar: "Calendario",
  contacts: "Contactos",
  messages: "Mensajes",
  amazon: "Amazon",
  tiktok: "TikTok",
  banco: "Banco",
  slither: "Slither.io",
  ujap: "UJAP",
};

export const PhoneProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [isCharging, setIsCharging] = useState(false);
  const [isWifiConnected, setIsWifiConnected] = useState(true);
  const [isCellularConnected, setIsCellularConnected] = useState(true);
  const [cellularStrength, setCellularStrength] = useState(4);
  const [storageUsed, setStorageUsed] = useState(28);
  const [totalStorage, setTotalStorage] = useState(64);
  const [ramUsed, setRamUsed] = useState(3.2);
  const [totalRam, setTotalRam] = useState(8);
  const [currentApp, setCurrentApp] = useState<string | null>(null);
  const [isInCall, setIsInCall] = useState(false);
  const [currentCallNumber, setCurrentCallNumber] = useState<string | null>(
    null
  );
  const [currentCallName, setCurrentCallName] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [appHistory, setAppHistory] = useState<string[]>([]);
  const [isRecentsOpen, setIsRecentsOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  //const [isPowerMenuOpen, setPowerMenuOpen] = useState(false);
  const [isPoweringOff, setIsPoweringOff] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [isShutDown, setIsShutDown] = useState(false);
  const [runningApps, setRunningApps] = useState([
    { name: "Sistema", ram: 1.6, icon: "database" },
    { name: "Cámara", ram: 0.8, icon: "camera" },
    { name: "Galería", ram: 0.4, icon: "image" },
    { name: "Teléfono", ram: 0.3, icon: "phone" },
    { name: "Aplicaciones en Segundo Plano", ram: 0.1, icon: "database" },
  ]);

  // Sync with device battery
  useEffect(() => {
    // Check if the Battery API is available
    if ("getBattery" in navigator) {
      const updateBatteryStatus = (battery: any) => {
        // Update battery level (0 to 100)
        setBatteryLevel(Math.floor(battery.level * 100));

        // Update charging status
        setIsCharging(battery.charging);
      };

      const setupBattery = async () => {
        try {
          const battery: any = await (navigator as any).getBattery();

          // Initial update
          updateBatteryStatus(battery);

          // Add event listeners for changes
          battery.addEventListener("levelchange", () =>
            updateBatteryStatus(battery)
          );
          battery.addEventListener("chargingchange", () =>
            updateBatteryStatus(battery)
          );
        } catch (error) {
          console.error("Error accessing battery status:", error);
        }
      };

      setupBattery();
    } else {
      console.log(
        "Battery API not supported, using fallback battery simulation"
      );
      // Fallback to simulated battery if Battery API not available
      const interval = setInterval(() => {
        if (isCharging) {
          setBatteryLevel((prev) => Math.min(prev + 1, 100));
        } else {
          setBatteryLevel((prev) => Math.max(prev - 0.1, 0));
        }
      }, 10000); // Update every 10 seconds

      return () => clearInterval(interval);
    }
  }, [isCharging]);

  // RAM management
  useEffect(() => {
    const ramInterval = setInterval(() => {
      setRamUsed((prev) => {
        // Fluctuate RAM between 2.8 and 4.2 GB
        const randomChange = Math.random() * 0.3 - 0.15;
        const newValue = Math.max(2.8, Math.min(4.2, prev + randomChange));
        return parseFloat(newValue.toFixed(1));
      });
    }, 5000);

    return () => clearInterval(ramInterval);
  }, []);

  // RAM updates based on open apps
  useEffect(() => {
    if (currentApp) {
      const appRamUsage = {
        camera: 0.8,
        microphone: 0.6,
        gallery: 0.5,
        game: 1.2,
        calculator: 0.3,
        battery: 0.2,
        connectivity: 0.2,
        memory: 0.3,
        calendar: 0.4,
        contacts: 0.3,
        messages: 0.5,
        phone: 0.4,
        amazon: 0.9,
        tiktok: 1.1,
        banco: 0.7,
        slither: 1.0,
        ujap: 0.8,
      };

      const usage = appRamUsage[currentApp as keyof typeof appRamUsage] || 0.5;
      setRamUsed((prev) => Math.min(prev + usage, totalRam));

      setAppHistory((prev) => {
        if (prev[prev.length - 1] !== currentApp) {
          const filteredHistory = prev.filter((app) => app !== currentApp);
          return [...filteredHistory, currentApp];
        }
        return prev;
      });
    }
  }, [currentApp, totalRam]);

  // Initialize sample photos
  useEffect(() => {
    if (photos.length === 0) {
      const samplePhotos = [
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzM0OThkYiIgLz48dGV4dCB4PSIxNTAiIHk9IjIwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjIwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Rm90byBkZSBwbGF5YTwvdGV4dD48L3N2Zz4=",
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzJlY2M3MSIgLz48dGV4dCB4PSIxNTAiIHk9IjIwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjIwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Rm90byBkZSBtb250YcOxYTwvdGV4dD48L3N2Zz4=",
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2U3NGMzYyIgLz48dGV4dCB4PSIxNTAiIHk9IjIwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjIwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Rm90byBkZSBhdGFyZGVjZXI8L3RleHQ+PC9zdmc+",
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YzOWMxMiIgLz48dGV4dCB4PSIxNTAiIHk9IjIwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjIwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Rm90byBkZSBhbWlnb3M8L3RleHQ+PC9zdmc+",
      ];

      setPhotos(samplePhotos);
    }
  }, [photos.length]);

  // Shutdown and Restart functions
  const shutdownPhone = () => {
    setIsPoweringOff(true);
    setTimeout(() => {
      setIsShutDown(true);
      setIsPoweringOff(false);
      //setPowerMenuOpen(false);
    }, 2000);
  };

  const restartPhone = () => {
    setIsRestarting(true);
    setTimeout(() => {
      setIsShutDown(true);
      setTimeout(() => {
        setIsShutDown(false);
        setIsLocked(true);
        setCurrentApp(null);
        setIsRestarting(false);
        // setPowerMenuOpen(false);
      }, 3000);
    }, 2000);
  };

  // Terminate specific running app
  const terminateApp = (appName: string) => {
    setRunningApps((prev) => {
      const updatedApps = prev.filter((app) => app.name !== appName);
      // Recalculate RAM usage
      const releasedRam = prev.find((app) => app.name === appName)?.ram || 0;
      setRamUsed((prevRam) => Math.max(1.5, prevRam - releasedRam));
      return updatedApps;
    });
  };

  const getRecentApps = () => {
    return appHistory
      .filter((appId) => appId !== currentApp)
      .map((appId) => ({
        id: appId,
        name: APP_NAMES[appId] || appId,
      }))
      .reverse()
      .slice(0, 5);
  };

  const toggleWifi = () => {
    setIsWifiConnected((prev) => !prev);
  };

  const toggleCellular = () => {
    setIsCellularConnected((prev) => !prev);
  };

  const setBatteryCharging = (charging: boolean) => {
    // Only update the charging icon, don't affect real battery charging
    setIsCharging(charging);
  };

  const simulateCall = (phoneNumber: string, name: string = "") => {
    setIsInCall(true);
    setCurrentCallNumber(phoneNumber);
    setCurrentCallName(name || null);
    // Cambiar a la aplicación de teléfono
    setCurrentApp("phone");
  };

  const endCall = () => {
    setIsInCall(false);
    setCurrentCallNumber(null);
    setCurrentCallName(null);
  };

  const deletePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const goBack = () => {
    if (currentApp !== null) {
      setCurrentApp(null);
    }
  };

  const openRecents = () => {
    setIsRecentsOpen(true);
  };

  const closeRecents = () => {
    setIsRecentsOpen(false);
  };

  useEffect(() => {
    const handleNewPhoto = (event: CustomEvent) => {
      if (event.detail && event.detail.photoUrl) {
        setPhotos((prev) => [...prev, event.detail.photoUrl]);
      }
    };

    window.addEventListener(
      "new-photo-captured",
      handleNewPhoto as EventListener
    );

    return () => {
      window.removeEventListener(
        "new-photo-captured",
        handleNewPhoto as EventListener
      );
    };
  }, []);

  const value = {
    batteryLevel,
    isCharging,
    isWifiConnected,
    isCellularConnected,
    cellularStrength,
    storageUsed,
    totalStorage,
    ramUsed,
    totalRam,
    currentApp,
    setCurrentApp,
    toggleWifi,
    toggleCellular,
    setBatteryCharging,
    simulateCall,
    endCall,
    isInCall,
    currentCallNumber,
    currentCallName,
    photos,
    deletePhoto,
    goBack,
    openRecents,
    closeRecents,
    isRecentsOpen,
    recentApps: getRecentApps(),
    isLocked,
    setIsLocked,
    shutdownPhone,
    restartPhone,
    //isPowerMenuOpen,
    //setPowerMenuOpen,
    isPoweringOff,
    isRestarting,
    isShutDown,
    terminateApp,
  };

  return (
    <PhoneContext.Provider value={value}>{children}</PhoneContext.Provider>
  );
};

export const usePhone = (): PhoneContextType => {
  const context = useContext(PhoneContext);
  if (context === undefined) {
    throw new Error("usePhone debe ser usado dentro de un PhoneProvider");
  }
  return context;
};
