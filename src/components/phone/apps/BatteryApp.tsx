
import React from "react";
import { usePhone } from "@/context/PhoneContext";
import { Battery, BatteryCharging, Clock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";

const BatteryApp: React.FC = () => {
  const { batteryLevel, isCharging, setBatteryCharging } = usePhone();
  const batteryPercentage = Math.floor(batteryLevel);
  
  const getBatteryColor = () => {
    if (batteryPercentage > 50) return "text-green-500";
    if (batteryPercentage > 15) return "text-yellow-500";
    return "text-red-500";
  };
  
  const getEstimatedTime = () => {
    // Simple estimation based on battery level
    const hoursLeft = isCharging 
      ? Math.round((100 - batteryPercentage) / 25) // Time to full
      : Math.round(batteryPercentage / 10); // Time to empty
      
    return hoursLeft;
  };
  
  return (
    <div className="h-full flex flex-col p-6">
      <h2 className="text-2xl font-semibold text-center mb-8">Batería</h2>
      
      <div className="flex-1 flex flex-col items-center">
        <div className="w-32 h-32 rounded-full border-4 border-gray-200 flex items-center justify-center mb-8">
          {isCharging ? (
            <BatteryCharging size={48} className="text-green-500" />
          ) : (
            <Battery size={48} className={getBatteryColor()} />
          )}
        </div>
        
        <div className="text-4xl font-bold mb-2">{batteryPercentage}%</div>
        
        <div className="w-full max-w-md mb-8">
          <Progress value={batteryPercentage} className={`h-3 ${getBatteryColor()}`} />
        </div>
        
        <div className="flex items-center text-gray-600 mb-8">
          <Clock size={20} className="mr-2" />
          <span>
            {isCharging 
              ? `Aproximadamente ${getEstimatedTime()} hora${getEstimatedTime() !== 1 ? 's' : ''} hasta carga completa` 
              : `Aproximadamente ${getEstimatedTime()} hora${getEstimatedTime() !== 1 ? 's' : ''} restantes`}
          </span>
        </div>
        
        <div className="w-full max-w-md">
          <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg mb-3">
            <div>
              <div className="font-medium">Cargando</div>
              <div className="text-sm text-gray-500">{isCharging ? "Conectado" : "Desconectado"}</div>
            </div>
            <Switch 
              checked={isCharging} 
              onCheckedChange={(checked) => setBatteryCharging(checked)} 
            />
          </div>
          
          <div className="bg-gray-100 rounded-lg p-4">
            <h3 className="font-medium mb-2">Salud de la Batería</h3>
            <p className="text-sm text-gray-600">Capacidad Máxima: 92%</p>
            <p className="text-sm text-gray-600 mt-1">Capacidad de Rendimiento Máximo: Normal</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatteryApp;
