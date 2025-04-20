
import React from "react";
import { usePhone } from "@/context/PhoneContext";
import StatusBar from "./StatusBar";
import NavigationBar from "./NavigationBar";
import LockScreen from "./LockScreen";

interface PhoneFrameProps {
  children: React.ReactNode;
}

const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  const { isLocked, setIsLocked } = usePhone();
  
  const handleUnlock = () => {
    setIsLocked(false);
  };
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 p-4">
      <div className="relative w-full max-w-[375px] h-[750px] bg-phone-frame rounded-[40px] overflow-hidden shadow-2xl border-8 border-phone-frame">
        {/* Reducir el tamaño del adorno de la cámara */}
        <div className="absolute top-0 left-0 right-0 flex justify-center z-10 pt-1">
          <div className="w-32 h-5 bg-black rounded-b-2xl flex items-center justify-center">
            <div className="w-12 h-1.5 bg-gray-800 rounded-full mr-3"></div>
            <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
          </div>
        </div>
        
        {/* Botones del teléfono */}
        <div className="absolute top-32 right-[-8px] w-1 h-16 bg-phone-button rounded-l-md"></div>
        <div className="absolute top-56 right-[-8px] w-1 h-16 bg-phone-button rounded-l-md"></div>
        <div className="absolute top-32 left-[-8px] w-1 h-24 bg-phone-button rounded-r-md"></div>
        
        {/* Pantalla del teléfono */}
        <div className="absolute inset-0 bg-phone-screen flex flex-col">
          {isLocked ? (
            <LockScreen onUnlock={handleUnlock} />
          ) : (
            <>
              <StatusBar />
              <div className="flex-1 overflow-hidden">
                {children}
              </div>
              <NavigationBar />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhoneFrame;
