
import React from "react";
import { usePhone } from "@/context/PhoneContext";
import { Power } from "lucide-react";

const ShutdownOverlay: React.FC = () => {
  const { isShutDown, isPoweringOff, isRestarting } = usePhone();
  
  if (!isShutDown && !isPoweringOff && !isRestarting) return null;
  
  return (
    <div className="absolute inset-0 z-50 bg-black flex items-center justify-center">
      {(isPoweringOff || isRestarting) ? (
        <div className="text-white flex flex-col items-center">
          <div className="animate-spin mb-4">
            <Power size={32} />
          </div>
          <p>{isRestarting ? "Reiniciando..." : "Apagando..."}</p>
        </div>
      ) : null}
    </div>
  );
};

export default ShutdownOverlay;
