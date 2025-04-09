
import React, { useState, useEffect } from "react";
import { usePhone } from "@/context/PhoneContext";
import { Battery, Wifi, Signal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Point {
  x: number;
  y: number;
  id: number;
}

const LockScreen: React.FC<{ onUnlock: () => void }> = ({ onUnlock }) => {
  const { batteryLevel, isWifiConnected, isCellularConnected } = usePhone();
  const [pattern, setPattern] = useState<number[]>([]);
  const [patternIsCorrect, setPatternIsCorrect] = useState<boolean | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const correctPattern = [0, 3, 6, 7, 8]; // Patrón en forma de "L" (equivalente a I en una matriz 3x3)
  
  const points: Point[] = [
    { x: 0, y: 0, id: 0 },
    { x: 1, y: 0, id: 1 },
    { x: 2, y: 0, id: 2 },
    { x: 0, y: 1, id: 3 },
    { x: 1, y: 1, id: 4 },
    { x: 2, y: 1, id: 5 },
    { x: 0, y: 2, id: 6 },
    { x: 1, y: 2, id: 7 },
    { x: 2, y: 2, id: 8 }
  ];
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const handlePointClick = (id: number) => {
    if (patternIsCorrect !== null) return;
    
    // Evitar duplicados
    if (!pattern.includes(id)) {
      const newPattern = [...pattern, id];
      setPattern(newPattern);
      
      // Verificar si el patrón está completo
      if (newPattern.length === correctPattern.length) {
        const isCorrect = newPattern.every((point, index) => point === correctPattern[index]);
        setPatternIsCorrect(isCorrect);
        
        if (isCorrect) {
          setTimeout(() => {
            onUnlock();
          }, 500);
        } else {
          setTimeout(() => {
            setPattern([]);
            setPatternIsCorrect(null);
          }, 1000);
        }
      }
    }
  };
  
  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = currentTime.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-blue-900 to-black text-white">
      {/* Barra de estado */}
      <div className="h-7 flex justify-between items-center px-4 text-xs font-medium">
        <div>{formattedTime}</div>
        
        <div className="flex items-center space-x-2">
          {isCellularConnected && <Signal size={16} />}
          {isWifiConnected && <Wifi size={16} />}
          <div className="flex items-center">
            <Battery size={16} />
            <span className="text-xs ml-1">{Math.floor(batteryLevel)}%</span>
          </div>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-6xl font-light mb-2">{formattedTime}</div>
        <div className="text-lg font-light mb-12 capitalize">{formattedDate}</div>
        
        {/* Patrón de desbloqueo */}
        <div className="mb-8">
          <div className="grid grid-cols-3 gap-6">
            {points.map((point) => (
              <Button
                key={point.id}
                variant="ghost"
                className={`rounded-full h-14 w-14 border-2 ${
                  pattern.includes(point.id) 
                    ? patternIsCorrect === null 
                      ? "border-blue-400 bg-blue-400/30" 
                      : patternIsCorrect 
                        ? "border-green-500 bg-green-500/30" 
                        : "border-red-500 bg-red-500/30"
                    : "border-white/50"
                }`}
                onClick={() => handlePointClick(point.id)}
              />
            ))}
          </div>
        </div>
        
        <p className="text-sm text-white/70">
          Dibuje el patrón para desbloquear
        </p>
      </div>
      
      <div className="p-6">
        <Button 
          variant="ghost" 
          className="w-full border border-white/30 text-white"
          onClick={() => {
            setPattern([]);
            setPatternIsCorrect(null);
          }}
        >
          Borrar
        </Button>
      </div>
    </div>
  );
};

export default LockScreen;
