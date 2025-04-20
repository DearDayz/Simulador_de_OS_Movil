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
  wifiSignalStrength: number;
  connectedWifiName: string | null;
  storageUsed: number;
  totalStorage: number;
  ramUsed: number;
  totalRam: number;
  currentApp: string | null;
  setCurrentApp: (app: string | null) => void;
  toggleWifi: (state?: boolean, networkName?: string) => void;
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
  isPoweringOff: boolean;
  isRestarting: boolean;
  isShutDown: boolean;
  terminateApp: (appName: string) => void;
  setWallpaperFromGallery: (imageUrl: string) => void;
  wallpaperImage: string | null;
  wifiSignalStrength: number;
  connectedWifiName: string | null;
  wifiIp: string;
  setCustomWifiSignal: (strength: number) => void;
  setCustomWifiIp: (ip: string) => void;
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
  const [wifiSignalStrength, setWifiSignalStrength] = useState(85);
  const [connectedWifiName, setConnectedWifiName] = useState<string | null>("Red Hogar");
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
  const [isPoweringOff, setIsPoweringOff] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [isShutDown, setIsShutDown] = useState(false);
  const [wallpaperImage, setWallpaperImage] = useState<string | null>(null);
  const [runningApps, setRunningApps] = useState([
    { name: "Sistema", ram: 1.6, icon: "database" },
    { name: "Cámara", ram: 0.8, icon: "camera" },
    { name: "Galería", ram: 0.4, icon: "image" },
    { name: "Teléfono", ram: 0.3, icon: "phone" },
    { name: "Aplicaciones en Segundo Plano", ram: 0.1, icon: "database" },
  ]);

  const [wifiIp, setWifiIp] = useState<string>("192.168.1.5");

  // Sync with device battery
  useEffect(() => {
    if ("getBattery" in navigator) {
      const updateBatteryStatus = (battery: any) => {
        setBatteryLevel(Math.floor(battery.level * 100));
        setIsCharging(battery.charging);
      };

      const setupBattery = async () => {
        try {
          const battery: any = await (navigator as any).getBattery();

          updateBatteryStatus(battery);

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
      const interval = setInterval(() => {
        if (isCharging) {
          setBatteryLevel((prev) => Math.min(prev + 1, 100));
        } else {
          setBatteryLevel((prev) => Math.max(prev - 0.1, 0));
        }
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [isCharging]);

  // WiFi signal strength simulation
  useEffect(() => {
    if (isWifiConnected) {
      if ('connection' in navigator && (navigator as any).connection) {
        const connection = (navigator as any).connection;
        
        if (connection.addEventListener) {
          const updateSignalStrength = () => {
            const effectiveType = connection.effectiveType;
            let strength = 75;
            
            if (effectiveType === '4g') {
              strength = 85 + Math.random() * 15;
            } else if (effectiveType === '3g') {
              strength = 60 + Math.random() * 20;
            } else if (effectiveType === '2g') {
              strength = 30 + Math.random() * 30;
            } else {
              strength = 10 + Math.random() * 20;
            }
            
            setWifiSignalStrength(Math.floor(strength));
          };
          
          updateSignalStrength();
          connection.addEventListener('change', updateSignalStrength);
          
          return () => {
            connection.removeEventListener('change', updateSignalStrength);
          };
        }
      }
      
      const interval = setInterval(() => {
        const baseStrength = 65;
        const fluctuation = Math.random() * 35;
        setWifiSignalStrength(Math.floor(baseStrength + fluctuation));
      }, 10000);
      
      return () => clearInterval(interval);
    } else {
      setWifiSignalStrength(0);
    }
  }, [isWifiConnected]);

  // RAM management
  useEffect(() => {
    const ramInterval = setInterval(() => {
      setRamUsed((prev) => {
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
      }, 3000);
    }, 2000);
  };

  // Terminate specific running app
  const terminateApp = (appName: string) => {
    setRunningApps((prev) => {
      const updatedApps = prev.filter((app) => app.name !== appName);
      const releasedRam = prev.find((app) => app.name === appName)?.ram || 0;
      setRamUsed((prevRam) => Math.max(1.5, prevRam - releasedRam));
      return updatedApps;
    });
  };

  // Set wallpaper from gallery
  const setWallpaperFromGallery = (imageUrl: string) => {
    setWallpaperImage(imageUrl);
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

  const setCustomWifiSignal = (strength: number) => setWifiSignalStrength(strength);
  const setCustomWifiIp = (ip: string) => setWifiIp(ip);

  const toggleWifi = (state?: boolean, networkName?: string) => {
    const newState = typeof state !== 'undefined' ? state : !isWifiConnected;
    setIsWifiConnected(newState);
    
    if (newState && networkName) {
      setConnectedWifiName(networkName);
    } else if (!newState) {
      setConnectedWifiName(null);
      setWifiSignalStrength(0);
      setWifiIp("-");
    }
  };

  const toggleCellular = () => {
    setIsCellularConnected((prev) => !prev);
  };

  const setBatteryCharging = (charging: boolean) => {
    setIsCharging(charging);
  };

  const simulateCall = (phoneNumber: string, name: string = "") => {
    setIsInCall(true);
    setCurrentCallNumber(phoneNumber);
    setCurrentCallName(name || null);
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
    wifiSignalStrength,
    connectedWifiName,
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
    isPoweringOff,
    isRestarting,
    isShutDown,
    terminateApp,
    setWallpaperFromGallery,
    wallpaperImage,
    wifiSignalStrength,
    connectedWifiName,
    wifiIp,
    setCustomWifiSignal,
    setCustomWifiIp,
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
