
import React, { useEffect } from "react";
import { usePhone } from "@/context/PhoneContext";
import PhoneApp from "./apps/PhoneApp";
import CameraApp from "./apps/CameraApp";
import MicrophoneApp from "./apps/MicrophoneApp";
import BatteryApp from "./apps/BatteryApp";
import ConnectivityApp from "./apps/ConnectivityApp";
import MemoryApp from "./apps/MemoryApp";
import GalleryApp from "./apps/GalleryApp";
import GameApp from "./apps/GameApp";
import CalculatorApp from "./apps/CalculatorApp";
import CalendarApp from "./apps/CalendarApp";
import ContactsApp from "./apps/ContactsApp";
import MessagesApp from "./apps/MessagesApp";
import WebViewApp from "./apps/WebViewApp";

const AppScreen: React.FC = () => {
  const { currentApp } = usePhone();
  
  // Listen for manual camera shutdown events
  useEffect(() => {
    const handleCameraShutdown = () => {
      console.log("Camera forced shutdown event received");
      // This is just a backup - the actual shutdown happens in the CameraApp component
    };
    
    window.addEventListener('camera-force-shutdown', handleCameraShutdown);
    
    return () => {
      window.removeEventListener('camera-force-shutdown', handleCameraShutdown);
      console.log("AppScreen cleanup");
    };
  }, []);
  
  // Renderizar la aplicación apropiada según currentApp
  const renderApp = () => {
    switch (currentApp) {
      case "phone":
        return <PhoneApp />;
      case "camera":
        return <CameraApp key="camera-app" />; // Key ensures component remounts when navigating back
      case "microphone":
        return <MicrophoneApp />;
      case "battery":
        return <BatteryApp />;
      case "connectivity":
        return <ConnectivityApp />;
      case "memory":
        return <MemoryApp />;
      case "gallery":
        return <GalleryApp />;
      case "game":
        return <GameApp />;
      case "calculator":
        return <CalculatorApp />;
      case "calendar":
        return <CalendarApp />;
      case "contacts":
        return <ContactsApp />;
      case "messages":
        return <MessagesApp />;
      case "amazon":
      case "tiktok":
      case "banco":
      case "slither":
      case "ujap":
        return <WebViewApp />;
      default:
        return null;
    }
  };
  
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-1 overflow-hidden">
        {renderApp()}
      </div>
    </div>
  );
};

export default AppScreen;
