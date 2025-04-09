
import React from "react";
import { usePhone } from "@/context/PhoneContext";
import { Home, Layers, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NavigationBar: React.FC = () => {
  const { currentApp, setCurrentApp, goBack } = usePhone();

  // Explicitly force camera shutdown when navigating away
  const handleGoHome = () => {
    // If we're in the camera app, dispatch an event to ensure camera shutdown
    if (currentApp === "camera") {
      const shutdownEvent = new CustomEvent('camera-force-shutdown');
      window.dispatchEvent(shutdownEvent);
    }
    
    // Set current app to null (go to home screen)
    setCurrentApp(null);
  };
  
  const handleGoBack = () => {
    // If we're in the camera app, dispatch an event to ensure camera shutdown
    if (currentApp === "camera") {
      const shutdownEvent = new CustomEvent('camera-force-shutdown');
      window.dispatchEvent(shutdownEvent);
    }
    
    // Use the goBack function from context
    goBack();
  };

  return (
    <div className="h-12 bg-black bg-opacity-80 flex justify-around items-center text-white">
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-white hover:bg-white/10"
        onClick={handleGoBack}
        aria-label="Volver"
      >
        <ArrowLeft size={22} />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="rounded-full border-2 border-white text-white hover:bg-white/10"
        onClick={handleGoHome}
        aria-label="Inicio"
      >
        <Home size={22} />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-white hover:bg-white/10 opacity-50"
        disabled={true}
        aria-label="Aplicaciones recientes"
      >
        <Layers size={22} />
      </Button>
    </div>
  );
};

export default NavigationBar;
