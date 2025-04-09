
import React, { useState, useEffect } from "react";
import { usePhone } from "@/context/PhoneContext";
import { HardDrive, Cpu, Database, Trash2, Image, Phone, Camera, Music, Globe, FileText } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const MemoryApp: React.FC = () => {
  const { 
    storageUsed: contextStorageUsed, 
    totalStorage, 
    ramUsed: contextRamUsed, 
    totalRam,
    terminateApp
  } = usePhone();
  
  // Initialize apps and storage data
  const [appSizes, setAppSizes] = useState([
    { name: "Fotos y Videos", size: 8.3, icon: <Image size={20} className="text-blue-500" /> },
    { name: "Aplicaciones", size: 6.2, icon: <Globe size={20} className="text-green-500" /> },
    { name: "Música", size: 4.5, icon: <Music size={20} className="text-purple-500" /> },
    { name: "Documentos", size: 3.2, icon: <FileText size={20} className="text-yellow-500" /> },
    { name: "Sistema", size: 3.7, icon: <Database size={20} className="text-gray-500" /> },
    { name: "Otros", size: 2.1, icon: <Database size={20} className="text-orange-500" /> },
  ]);
  
  const [runningApps, setRunningApps] = useState([
    { name: "Sistema", ram: 1.6, icon: <Database size={16} className="text-gray-500" /> },
    { name: "Cámara", ram: 0.8, icon: <Camera size={16} className="text-blue-500" /> },
    { name: "Galería", ram: 0.4, icon: <Image size={16} className="text-purple-500" /> },
    { name: "Teléfono", ram: 0.3, icon: <Phone size={16} className="text-green-500" /> },
    { name: "Aplicaciones en Segundo Plano", ram: 0.1, icon: <Database size={16} className="text-orange-500" /> },
  ]);
  
  // Calculate total RAM and storage based on running apps and app sizes
  const [ramUsed, setRamUsed] = useState(() => {
    return runningApps.reduce((total, app) => total + app.ram, 0);
  });
  
  const [storageUsed, setStorageUsed] = useState(() => {
    return appSizes.reduce((total, app) => total + app.size, 0);
  });
  
  // Actualización dinámica de la RAM
  useEffect(() => {
    const interval = setInterval(() => {
      // Actualizar apps en ejecución con valores fluctuantes
      setRunningApps(prev => {
        const updatedApps = prev.map(app => {
          const appFluctuation = (Math.random() * 0.2) - 0.1; // -0.1 a +0.1
          return {
            ...app,
            ram: Math.max(0.1, app.ram + appFluctuation)
          };
        });
        
        // Recalculate total RAM
        const newTotalRam = updatedApps.reduce((total, app) => total + app.ram, 0);
        setRamUsed(newTotalRam);
        
        return updatedApps;
      });
    }, 2000); // Actualizar cada 2 segundos
    
    return () => clearInterval(interval);
  }, []);
  
  // Manejar el cierre de una aplicación
  const handleCloseApp = (appName: string) => {
    if (appName === "Sistema") {
      toast.error("No se puede cerrar el Sistema");
      return;
    }
    
    // Find app RAM before removing it
    const appToClose = runningApps.find(app => app.name === appName);
    if (!appToClose) return;
    
    // Update the list of running apps
    setRunningApps(prev => {
      const updatedApps = prev.filter(app => app.name !== appName);
      // Recalculate total RAM after removing the app
      const newTotalRam = updatedApps.reduce((total, app) => total + app.ram, 0);
      setRamUsed(newTotalRam);
      return updatedApps;
    });
    
    // Call the context function
    terminateApp(appName);
    
    // Show notification
    toast.success(`${appName} cerrado`);
  };
  
  // Calcular porcentajes
  const storagePercentage = (storageUsed / totalStorage) * 100;
  const ramPercentage = (ramUsed / totalRam) * 100;
  
  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto">
      <h2 className="text-2xl font-semibold text-center mb-6">Almacenamiento y Memoria</h2>
      
      <div className="space-y-6">
        {/* Sección de Almacenamiento */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center mb-3">
            <HardDrive size={24} className="text-blue-500 mr-2" />
            <h3 className="font-medium">Almacenamiento</h3>
          </div>
          
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span>{storageUsed.toFixed(1)} GB usados</span>
              <span>{totalStorage} GB total</span>
            </div>
            <Progress value={storagePercentage} className="h-2" />
          </div>
          
          <div className="text-sm text-gray-600 mb-3">
            <span className="text-blue-500">{(totalStorage - storageUsed).toFixed(1)} GB</span> disponibles
          </div>
          
          <div className="border-t pt-3">
            <h4 className="font-medium text-sm mb-2">Desglose de Almacenamiento</h4>
            <div className="space-y-2">
              {appSizes.map((app) => (
                <div key={app.name} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="mr-2">{app.icon}</div>
                    <span>{app.name}</span>
                  </div>
                  <span className="text-sm text-gray-600">{app.size.toFixed(1)} GB</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Sección de RAM */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center mb-3">
            <Cpu size={24} className="text-green-500 mr-2" />
            <h3 className="font-medium">Memoria RAM</h3>
          </div>
          
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span>{ramUsed.toFixed(1)} GB usados</span>
              <span>{totalRam} GB total</span>
            </div>
            <Progress value={ramPercentage} className="h-2" />
          </div>
          
          <div className="text-sm text-gray-600 mb-3">
            <span className="text-green-500">{(totalRam - ramUsed).toFixed(1)} GB</span> disponibles
          </div>
          
          <div className="border-t pt-3">
            <h4 className="font-medium text-sm mb-2">Aplicaciones Activas</h4>
            <div className="space-y-2">
              {runningApps.map((app) => (
                <div key={app.name} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="mr-2">{app.icon}</div>
                    <span className="text-sm">{app.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-600">{app.ram.toFixed(1)} GB</span>
                    {app.name !== "Sistema" && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 ml-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleCloseApp(app.name)}
                        title={`Cerrar ${app.name}`}
                      >
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Sección de Limpieza */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center mb-3">
            <Trash2 size={24} className="text-red-500 mr-2" />
            <h3 className="font-medium">Limpieza</h3>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">
            Libera espacio eliminando archivos temporales y limpiando la caché de las aplicaciones.
          </p>
          
          <Button className="w-full">Optimizar Almacenamiento</Button>
        </div>
      </div>
    </div>
  );
};

export default MemoryApp;
